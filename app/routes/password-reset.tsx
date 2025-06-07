import { resetPassword } from '~/providers/account/account';
import { ActionFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { useState, useEffect } from 'react';
import { useActionData, useLocation } from '@remix-run/react';
import { PasswordInput } from '~/components/PasswordInput';
import { FormSubmitMessageProps, FormSubmitMessage } from '~/components/FormSubmitMessage';


export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const password = body.get('password') as string || '';
  const token = body.get('token') as string || '';

  if (!token) {
    return json({ success: false, message: 'Invalid or missing token.' }, { status: 400 });
  }

  const result = await resetPassword(token, password, { request });

  if (result.__typename === 'CurrentUser') {
    const formSuccess: FormSubmitMessageProps = {
      success: true,
      message: 'Your password has been reset successfully. You will be redirected to your account page shortly.',
    };
    return json(formSuccess, { status: 200 });
  } else {
    const formError: FormSubmitMessageProps = {
      success: false,
      message: result.message || 'An error occurred while resetting your password. Please try again.',
    };
    return json(formError, { status: 401 });
  }
}

/**
 * 
 * @returns A page for users to reset their password.
 * User will arrive at this page after clicking the password reset link sent to their email.
 * The link contains a onetime token that is used to verify the request.
 */

export default function PasswordResetPage() {
  const [passwordValue, setPasswordValue] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [repeatPasswordValid, setRepeatPasswordValid] = useState(false);
  const formSubmitResult = useActionData<FormSubmitMessageProps>();
  const location = useLocation();
  // Extract the token from the URL query parameters
  const token = new URLSearchParams(location.search).get('token');

  if (!token) {
    return <div className="text-red-500">Invalid or missing token.</div>;
  }

  useEffect(() => {
    if (formSubmitResult?.success) {
      console.log('redirecting to account page after password reset');
      const timeout = setTimeout(() => {
        // Use window.location.href (instead of `redirect`, which is not working) to redirect immediately
        window.location.href = '/account';
      }, 3000);
      return () => clearTimeout(timeout); // Cleanup timeout on component unmount
    }
  }, [formSubmitResult]);

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose a new password.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form method="post" className="space-y-4">
            <input type="hidden" name="token" value={token} />
            <PasswordInput
              label='Password'
              name="password"
              completeSignal={passwordValid}
              setCompleteSignal={setPasswordValid}
              checkStrongPassword={true}
              setIncompleteSignal={setRepeatPasswordValid}
              setValue={setPasswordValue}
            />

            <PasswordInput
              label='RepeatPassword'
              name="repeatPassword"
              completeSignal={repeatPasswordValid}
              setCompleteSignal={setRepeatPasswordValid}
              passwordToBeRepeated={passwordValue}
            />

            {/* Display form submit result message */}
            {formSubmitResult && (
              <FormSubmitMessage
                success={formSubmitResult.success}
                message={formSubmitResult.message}
              />
            )}

            {/* Error message */}
            <button
              type="submit"
              disabled={!passwordValid || !repeatPasswordValid}
              className={
                `w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                ${!passwordValid || !repeatPasswordValid ? 'opacity-50 cursor-not-allowed' : ''}`
              }
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}