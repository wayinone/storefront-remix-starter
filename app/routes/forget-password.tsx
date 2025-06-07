import { requestPasswordReset } from '~/providers/account/account';
import { ActionFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { useState } from 'react';
import { useFetcher, Link, useActionData } from '@remix-run/react';
import { ErrorResult } from '~/generated/graphql';
import { GenericInput } from '~/components/account/GenericInput';
import { XCircleIcon, CheckIcon } from '@heroicons/react/24/solid';


type FormSubmitMessage = {
  success: boolean;
  message?: string;
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const email = body.get('email') as string || '';

  const result = await requestPasswordReset(email, { request });

  console.log('Password reset request result:', result);
  if (result?.__typename === 'Success') {
    console.log('Password reset request successful');
    const formSuccess: FormSubmitMessage = {
      success: true,
      message: `A password reset link has been sent to ${email}. Please check your inbox.`,
    };
    return json(formSuccess, { status: 200 });
  }
  else {
    console.error('Password reset request failed', result);
    const formError: FormSubmitMessage = {
      success: false,
      message: result?.errorCode || 'An error occurred while processing your request.',
    };
    return json(formError, { status: 401 });
  }
}

/**
 * 
 * @returns A page for users to request a password reset.
 * This page includes a form where users can enter their email address to receive a password reset link.
 * Note that if the provided email address is not registered, the user will still receive a success message.
 * This is a common practice to prevent email enumeration attacks.
 * Also, we will not send any email if the email address is not registered.
 */

export default function ForgetPasswordPage() {
  const [emailValid, setEmailValid] = useState(false);
  const formSubmitResult = useActionData<FormSubmitMessage>();


  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form method="post" className="space-y-4">
            <GenericInput
              label="Email"
              name="email"
              completeSignal={emailValid}
              setCompleteSignal={setEmailValid}
              isEmail={true}
              isRequired={true}
            />
            {formSubmitResult && (
              <div className={`rounded-md p-4 ${formSubmitResult.success ? 'bg-green-50' : 'bg-red-50'}`}>                <div className='flex'>
                  <div className="flex-shrink-0">
                    {formSubmitResult.success ? (
                      <CheckIcon className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-400" />
                    )
                    }
                  </div>
                  <div className='ml-3'>
                    <h3 className={`text-sm ${formSubmitResult.success ? 'text-green-600' : 'text-red-600'}`}>
                      {formSubmitResult.message}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={!emailValid}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded ${!emailValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Reset Password
            </button>
          </form>

          <div className="mt-4 text-sm">
            Remembered your password?{' '}
            <Link to="/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}