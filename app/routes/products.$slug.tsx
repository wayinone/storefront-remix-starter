import { DataFunctionArgs, json } from '@remix-run/server-runtime';
import { useState } from 'react';
import { Price } from '~/components/products/Price';
import { getProductBySlug } from '~/providers/products/products';
import {
  FetcherWithComponents,
  ShouldRevalidateFunction,
  useLoaderData,
  useOutletContext,
  MetaFunction,
} from '@remix-run/react';
import { CheckIcon, HeartIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { APP_META_TITLE } from '~/constants';
import { CartLoaderData } from '~/routes/api.active-order';
import { getSessionStorage } from '~/sessions';
import { ErrorCode, ErrorResult, Product } from '~/generated/graphql';
import Alert from '~/components/Alert';
import { StockLevelLabel } from '~/components/products/StockLevelLabel';
import TopReviews from '~/components/products/TopReviews';
import { ScrollableContainer } from '~/components/products/ScrollableContainer';
import { useTranslation } from 'react-i18next';
import { PlateCustomizer } from '~/components/visualizer/doubleAS';
import { ActionFunctionArgs, LinksFunction } from '@remix-run/node';
import { getGoogleFontLink } from '~/components/visualizer/utils/font_selectors';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ItemOptions } from '~/components/visualizer/utils/custom_visualizer';


export const meta: MetaFunction = ({ data }) => {
  return [
    {
      title: data?.product?.name
        ? `${data.product.name} - ${APP_META_TITLE}`
        : APP_META_TITLE,
    },
  ];
};

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: getGoogleFontLink() },
  ];
}

function ShippingInformation() {
  const { t } = useTranslation();

  return (
    <section className="mt-12 pt-12 border-t text-xs">
      <h3 className="text-gray-600 font-bold mb-2">
        {t('product.shippingAndReturns')}
      </h3>
      <div className="text-gray-500 space-y-1">
        <p>{t('product.shippingInfo')}</p>
        <p>{t('product.shippingCostsInfo')}</p>
        <p>{t('product.returnsInfo')}</p>
      </div>
    </section>
  );
}

export async function loader({ params, request }: DataFunctionArgs) {
  // In the provided code, the params object has a slug attribute because 
  // the route definition for this component includes a dynamic segment named slug. 
  // This dynamic segment is part of the URL pattern for the route, and Remix 
  // automatically extracts it and makes it available in the params object.
  const { product } = await getProductBySlug(params.slug!, { request });
  if (!product) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  const sessionStorage = await getSessionStorage();
  const session = await sessionStorage.getSession(
    request?.headers.get('Cookie'),
  );
  const error = session.get('activeOrderError');
  return json(
    { product: product!, error },
    {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    },
  );
}

export const shouldRevalidate: ShouldRevalidateFunction = () => true;

export default function ProductSlug() {
  const { product, error } = useLoaderData<typeof loader>();

  const { activeOrderFetcher } = useOutletContext<{
    activeOrderFetcher: FetcherWithComponents<CartLoaderData>;
  }>();
  /*
  activeOrderFetcher is a FetcherWithComponents, which is a special component in Remix that allows you to fetch data and render components based on the fetched data.
  e.g. activeOrderFetcher should have the following properties:
  - Form: A component that can be used to submit a form to the fetcher.
  - load: A function to load data from a URL.
  - submit: A function to submit a form to the fetcher.
  - ...the return of `Fetcher`
    - data: The data returned from the fetcher. This data has type `CartLoaderData`
    - state: The state of the fetcher. This can be 'idle', 'submitting', or 'loading'.
    - formData: The data submitted to the fetcher.
  ...

  The entire data structure of activeOrderFetcher can be found in the type definition of FetcherWithComponents

  */
  const { activeOrder } = activeOrderFetcher.data ?? {};
  const addItemToOrderError = getAddItemToOrderError(error);
  const { t } = useTranslation();

  if (!product) {
    return <div>{t('product.notFound')}</div>;
  }

  const customizableOption = product.customFields?.customizableOption;

  const findVariantById = (id: string) =>
    product.variants.find((v) => v.id === id);

  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0].id,
  );
  const selectedVariant = findVariantById(selectedVariantId);
  if (!selectedVariant) {
    setSelectedVariantId(product.variants[0].id);
  }

  const qtyInCart =
    activeOrder?.lines.find((l) => l.productVariant.id === selectedVariantId)
      ?.quantity ?? 0;


  const asset = product.assets[0];
  const brandName = product.facetValues.find(
    (fv) => fv.facet.code === 'brand',
  )?.name;

  const [featuredAsset, setFeaturedAsset] = useState(
    selectedVariant?.featuredAsset,
  );

  const [allowATC, setAllowATC] = useState(true);


  return (
    <div>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
          {product.name}
        </h2>
        <Breadcrumbs
          items={
            product.collections[product.collections.length - 1]?.breadcrumbs ??
            []
          }
        ></Breadcrumbs>
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12">
          {/* Image gallery */}
          <div className="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
            <span className="rounded-md overflow-hidden">
              <div className="w-full h-full object-center object-cover rounded-lg">
                <img
                  src={
                    (featuredAsset?.preview || product.featuredAsset?.preview) +
                    '?w=800'
                  }
                  alt={product.name}
                  className="w-full h-full object-center object-cover rounded-lg"
                />
              </div>
            </span>

            {product.assets.length > 1 && (
              <ScrollableContainer>
                {product.assets.map((asset) => (
                  <div
                    className={`basis-1/3 md:basis-1/4 flex-shrink-0 select-none touch-pan-x rounded-lg ${featuredAsset?.id == asset.id
                      ? 'outline outline-2 outline-primary outline-offset-[-2px]'
                      : ''
                      }`}
                    onClick={() => {
                      setFeaturedAsset(asset);
                    }}
                  >
                    <img
                      draggable="false"
                      className="rounded-lg select-none h-24 w-full object-cover"
                      src={
                        asset.preview +
                        '?preset=full' /* not ideal, but technically prevents loading 2 seperate images */
                      }
                    />
                  </div>
                ))}
              </ScrollableContainer>
            )}
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="">
              <h3 className="sr-only">{t('product.description')}</h3>

              <div
                className="text-base text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            </div>


            <activeOrderFetcher.Form method="post" action="/api/active-order">
              <input type="hidden" name="action" value="addItemToOrder" />
              {/* When click the button, the above input will be in the request body, with key `action` and value `addItemToOrder` */}
              {1 < product.variants.length ? (
                <div className="mt-4">
                  <label
                    htmlFor="option"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('product.selectOption')}
                  </label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    id="productVariant"
                    value={selectedVariantId}
                    name="variantId"
                    onChange={(e) => {
                      setSelectedVariantId(e.target.value);

                      const variant = findVariantById(e.target.value);
                      if (variant) {
                        setFeaturedAsset(variant!.featuredAsset);
                      }
                    }}
                  >
                    {product.variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                // if there is only one variant, don't show the select
                <input
                  type="hidden"
                  name="variantId"
                  value={selectedVariantId}
                ></input>
              )}

              <div className="mt-10 flex flex-col sm:flex-row sm:items-center">
                <p className="text-3xl text-gray-900 mr-4">
                  <Price
                    priceWithTax={selectedVariant?.priceWithTax}
                    currencyCode={selectedVariant?.currencyCode}
                  ></Price>
                </p>
                <div className="flex sm:flex-col1 align-baseline">
                  <button
                    type="submit"
                    className={`max-w-xs flex-1 ${activeOrderFetcher.state !== 'idle'
                      ? 'bg-gray-400'
                      : qtyInCart === 0
                        ? 'bg-primary-600 hover:bg-primary-700'
                        : 'bg-green-600 active:bg-green-700 hover:bg-green-700'
                      }
                                     transition-colors border border-transparent rounded-md py-3 px-8 flex items-center
                                      justify-center text-base font-medium text-white focus:outline-none
                                      focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500 sm:w-full`}
                    disabled={(activeOrderFetcher.state !== 'idle') || (!allowATC)}
                  >
                    {(qtyInCart && !customizableOption)? (
                      <span className="flex items-center">
                        <CheckIcon className="w-5 h-5 mr-1" /> {qtyInCart}{' '}
                        {t('product.inCart')}
                      </span>
                    ) : (
                      t('product.addToCart')
                    )}
                  </button>

                  <button
                    type="button"
                    className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <HeartIcon
                      className="h-6 w-6 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">
                      {t('product.addToFavorites')}
                    </span>
                  </button>
                </div>
              </div>



              <div className="mt-2 flex items-center space-x-2">
                <span className="text-gray-500">{selectedVariant?.sku}</span>
                <StockLevelLabel stockLevel={selectedVariant?.stockLevel} />
              </div>
              {addItemToOrderError && (
                <div className="mt-4">
                  <Alert message={addItemToOrderError} />
                </div>

              )}

              {customizableOption === 'doubleAS' &&
                <div className="container">
                  <input type="hidden" name="action" value="addItemToOrder" />
                  <input type="hidden" name="variantId" value={selectedVariantId} />
                  <PlateCustomizer allowATC={allowATC} setAllowATC={setAllowATC} />
                </div>
              }


            </activeOrderFetcher.Form>


            <ShippingInformation />

          </div>
        </div>
      </div>
      <div className="mt-24">
        <TopReviews></TopReviews>
      </div>
    </div>
  );
}

export function CatchBoundary() {
  /*
  In Remix, CatchBoundary is a special component that you can define in your route modules to handle errors that occur during data loading or rendering.
  * Error Handling: The CatchBoundary component is used to catch and handle errors that occur during the execution of the loader function or while rendering the component. This allows you to provide a custom error UI for your users.
  * Component Definition: You define the CatchBoundary component in your route module. Remix will automatically use this component to render any errors that occur within the scope of the route.
  * Usage Context: In the provided code, the CatchBoundary component is defined to handle errors related to the product page. If an error occurs, such as the product not being found, the CatchBoundary component will render a custom error message.
  */
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
        {t('product.notFound')}
      </h2>
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12">
        {/* Image gallery */}
        <div className="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
          <span className="rounded-md overflow-hidden">
            <div className="w-full h-96 bg-slate-200 rounded-lg flex content-center justify-center">
              <PhotoIcon className="w-48 text-white"></PhotoIcon>
            </div>
          </span>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <div className="">{t('product.notFoundInfo')}</div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAddItemToOrderError(error?: ErrorResult): string | undefined {
  if (!error || !error.errorCode) {
    return undefined;
  }
  switch (error.errorCode) {
    case ErrorCode.OrderModificationError:
    case ErrorCode.OrderLimitError:
    case ErrorCode.NegativeQuantityError:
    case ErrorCode.InsufficientStockError:
      return error.message;
  }
}
