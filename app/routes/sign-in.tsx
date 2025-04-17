import { Link, useFetcher, useSearchParams } from '@remix-run/react';
import { DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { login, authenticate } from '~/providers/account/account';
import { ErrorResult } from '~/generated/graphql';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { Button } from '~/components/Button';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { GOOGLE_CLIENT_ID } from '~/constants';


import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
  

export async function action({ params, request }: DataFunctionArgs) {
  const body = await request.formData();
  const actionType = body.get('actionType');

  const handleResponse = (result: any, redirectTo: string = '/account') => {
    if (result.__typename === 'CurrentUser') {
      return redirect(redirectTo, { headers: result._headers });
    } else {
      return json(result, { status: 401 });
    }
  };

  if (actionType === 'login') {
    const email = body.get('email');
    const password = body.get('password');
    if (typeof email === 'string' && typeof password === 'string') {
      const rememberMe = !!body.get('rememberMe');
      const redirectTo = (body.get('redirectTo') || '/account') as string;
      const result = await login(email, password, rememberMe, { request });
      return handleResponse(result, redirectTo);
    }
  } else if (actionType === 'googleSignIn') {
    const id_token = body.get('id_token');
    if (typeof id_token === 'string') {
      const rememberMe = !!body.get('rememberMe');
      const result = await authenticate(
        { google: { token: id_token } },
        rememberMe,
        { request }
      );
      return handleResponse(result);
    }
  } else {
    return json({ error: 'Invalid action type' }, { status: 400 });
  }
}


export default function SignInPage() {
  const [searchParams] = useSearchParams();
  const login = useFetcher<ErrorResult>(); // This hook is to submit form data to the `action` function
  const { t } = useTranslation();

  const handleGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      console.error('Credential is missing');
      return;
    }

    const formData = new FormData();
    formData.set('actionType', 'googleSignIn');
    formData.set('id_token', credentialResponse.credential);

    // Submit the form data to the action function
    login.submit(formData, { method: 'post' });
  };

  return (
    <>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl text-gray-900">
            {t('account.signInTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('common.or')}{' '}
            <Link
              to="/sign-up"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('account.register')}
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            
            <login.Form method="post">
              <fieldset disabled={login.state !== 'idle'} className="space-y-6">
                <input
                  type="hidden"
                  name="redirectTo"
                  value={searchParams.get('redirectTo') ?? undefined}
                />
                <input
                  type="hidden"
                  name="actionType"
                  value="login"
                />
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('account.emailAddress')}
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder={t('account.emailAddress')}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:text-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('account.password')}
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder={t('account.password')}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:text-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                      defaultChecked
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {t('account.rememberMe')}
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      {t('account.forgotPassword')}
                    </a>
                  </div>
                </div>

                {login.data && login.state === 'idle' && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircleIcon
                          className="h-5 w-5 text-red-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {t('account.errorSignIn')}
                        </h3>
                        <p className="text-sm text-red-700 mt-2">
                          {login.data.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <span className="flex gap-4 items-center">
                      {login.state !== 'idle' && (
                        <ArrowPathIcon className="animate-spin h-5 w-5 text-gray-500" />
                      )}
                      {t('account.signIn')}
                    </span>
                  </Button>
                </div>
              </fieldset>
            </login.Form>
              {/* horizontal line */}
              <div className="flex items-center justify-between">
                <div className="border-t border-gray-300 w-full" />
                <div className="px-4 text-gray-500">{t('common.or')}</div>
                <div className="border-t border-gray-300 w-full" />
            </div>
           

            <div>
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => console.log('Login Failed')}
                  auto_select={false}
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
