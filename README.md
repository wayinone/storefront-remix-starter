# Vendure Remix Storefront Starter

An e-commerce storefront for [Vendure](https://www.vendure.io) built with [Remix](https://remix.run).

👉 [remix-storefront.vendure.io](https://remix-storefront.vendure.io/)

![Screenshot](https://www.vendure.io/blog/2022/05/lightning-fast-headless-commerce-with-vendure-and-remix/lighthouse-score.webp)

## To do

Most Vendure features are already part of this starter. Notable missing Vendure features:
- Default billing/shipping addresses
   - This is part of the account page (https://github.com/vendure-ecommerce/storefront-remix-starter/pull/39) but not yet used in checkout
- Separate billing address in checkout
- Promotions
- Localization
- Multi channel support

General things missing:
- Global input validation
- Sitemap generation
- Metadata

**Contributions welcome!**

## CustomFields

If you add custom fields in the backend. e.g. For entity `Product`, you added a customField `customizableOption` (in the backend repo's `vendure-config.ts`) as follows:
```
export const config: VendureConfig = {
...
customFields: { 
    Product: [
            {
                name: 'customizableOption',
                type: 'string',
                defaultValue: 'none',  // the string used here (e.g. 'doubleAS') will be used in the storefront to have the correct customizable options
                label: [{ languageCode: LanguageCode.en, value: 'Customizable Option' }],
                public: true,
            }
        ],
  ...
  }
}
```

The in the storefront, to be able to use this new field in `routes.product.$slug`, you needs to do:
1. spin up the backend server so that `localhost:3000/shop-api` is alive
2. Start from where we want to use the new field (in `routes.product.$slug`), since the return of `getProductBySlug` is defined at `./app/providers/products/products.ts` -> `sdk.product` (Line 17), we need to update the `gql` query about `product`, which means we need to add the following lines inside of `detailedProductFragment` gql query:
  ```
  customFields {
      customizableOption
  }
  ```
3. Then we need to run `yarn generate` (this is defined in package.json -> scripts) to do the codegen to update the type of `product` so that it has the new field.

Note that in `./codegen.yml` there is a `document` option that will glob all the specified (*.tsx or *.ts) file that has `gql` tag and will generate type for them.

Also note, in `http://localhost:3000/shop-api` there is also a `Query.Product` that is defined by the backend UI.
Note that in the storefront we need to define the mutation again from client side. 

Note that the only the schema, query and mutation with `gql` tag that defined in the `./codegen.yml`-> `document` will participate the `codegen` operation.

## Development

1. Clone this repo
2. `yarn install`
3. Create a `.env` file in the root dir with the following command and update it with your variables:
   
   ```bash
   cp .env.template .env
   ```
   
5. `yarn dev` - run the storefront with a local Remix server
6. `yarn dev:cf` - runs locally with the Cloudflare Pages configuration

### Add dependency
```
yarn add [package]
```
e.g. `yarn add react-select` 
(yarn will resolve dependencies. If you use `npm i [package]` you will usually get dependency issue.)

### Vendure Server

This storefront requires a Vendure V2 server. You can either run a local instance, or use our public demo server.  
If you're looking for V1 support, [75eb880](https://github.com/vendure-ecommerce/storefront-remix-starter/tree/75eb880052d7f76b2026fc917cf545996012e3ac) is the last supported commit.

#### Code Generation

Whenever the Graphql documents (the constants using the `gql` tag) in the [./app/providers](./app/providers) (I think the scope is any ts or tsx file inside of `./app/**.*` but this repo keep all the services, aka providers, in the same folder so it is easier to find) dir changes,
you should run `yarn generate` (or `npm run generate`) to generate new sdk definitions from `./codegen.yml`. 

Note that We can use `sdk` because in codegen.yaml we have the sdk plug in:

E.g. For `authenticate` mutation that can be found in shop-api, and we want to use the mutation, we can add the following gql in `./app/providers/account.ts`

```
gql`
  mutation authenticate($input: AuthenticationInput!, $rememberMe: Boolean) {
    authenticate(input: $input, rememberMe: $rememberMe) {
      __typename
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;
```

And then run `yarn generate`, then we can use this to define `authenticate` function with sdk.authenticate in a ts file (we can define that at the same file `./app/providers/account.ts` 
as long as the codegen has already run)

```
import {
  AuthenticationInput,
  AuthenticateMutation,
} from '~/generated/graphql';
import { sdk, WithHeaders } from '~/graphqlWrapper';

export const authenticate = async (
  input: AuthenticationInput,
  rememberMe: boolean,
): Promise<WithHeaders<AuthenticateMutation['authenticate']>> => {
  return sdk.authenticate({ input, rememberMe })
    .then((res) => ({
      ...res.authenticate,
      _headers: res._headers,
    }));
}

```

For a more detailed guide on how to work with code generation, check the wiki about [querying custom fields](https://github.com/vendure-ecommerce/storefront-remix-starter/wiki/Querying-custom-fields).

Or [Vendure doc about codegen](https://docs.vendure.io/guides/storefront/codegen/)

#### Local

You can set up a local instance, populated with test data by following the instructions in the Vendure [Getting Started guide](https://docs.vendure.io/getting-started/). Note that make sure you have enabled the `bearer` method for managing session tokens:

```ts
// vendure-config.ts
export const config: VendureConfig = {
  authOptions: {
    tokenMethod: ['bearer', 'cookie'], // or just 'bearer'
    // ...
  },
  // ...
};
```

## Payment Gateways

Currently, both Stripe and Braintree are supported out of the box, but only one of them can be used at the same time

### Stripe integration

This repo has a built-in Stripe payment integration. To enable it, ensure that your Vendure server is set up with
the [StripePlugin](https://docs.vendure.io/reference/core-plugins/payments-plugin/stripe-plugin/).

Ensure your new PaymentMethod uses the word `stripe` somewhere in its code, as that's how this integration will know
to load the Stripe payment element.

Then add your Stripe publishable key to the env file:

```
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Important note**: There's a race condition between Stripe redirecting a customer to the confirmation page and the webhook receiving the confirmation in the Vendure backend. As this condition is not very distinguishable from other potential issues, it is currently addressed by implementing a very simple retry system of 5 retries every 2.5s You can tweak these settings in the [CheckoutConfirmation route](./app/routes/checkout/confirmation.%24orderCode.tsx).

### Braintree integration

This repo has built-in Braintree integration. To enable it, ensure that your Vendure server is set up with
the [BraintreePlugin](https://docs.vendure.io/reference/core-plugins/payments-plugin/braintree-plugin/).

Currently, `storeCustomersInBraintree` has to be set to `true` in plugin options.

## Translation
The translation uses react-i18next package. The json file used for the translation is in [/public/locales](./public/locales/) folder.

## Deployment

This repo is configured to deploy to either Netlify or Cloudflare Pages or to build locally with specialised build targets (`build(:nf/:cf)`).

No special setup should be needed, as the [remix.config.js](./remix.config.js) file contains a check for the `process.env.CF_PAGES` / `process.env.NETLIFY` environment variable to determine whether to use the Cloudflare Pages or Netlify server configuration.

Follow the usual procedure for setting up a project in Netlify/CF Pages and point it to your clone of this repo on GitHub/Gitlab.

**Be sure to change the cookie secret in [app/sessions.ts](./app/sessions.ts) for production use!**

## Notes
* PDP: `app/routes/product.$slug`
* the right slider of shopping cart: `app/components/cart/CartTray.tsx` (used in `app/root.tsx`)

## License

MIT
