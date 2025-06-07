import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { ActionFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { registerCustomerAccount, customerRegisterStatus } from '~/providers/account/account';
import { XCircleIcon } from '@heroicons/react/24/solid';
import {
  extractRegistrationFormValues,
} from '~/utils/registration-helper';
import { API_URL, DEMO_API_URL } from '~/constants';
import { useTranslation } from 'react-i18next';
import { getFixedT } from '~/i18next.server';
import { useState } from 'react';
import { set } from 'zod';
import { PasswordInput } from '~/components/PasswordInput';

const EMAIL_REGEX = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

type RegisterValidationErrors = {
  form?: string;
};

type InputFeedback = {
  isValid: boolean;
  message: string;
}

export async function action({ request }: ActionFunctionArgs) {
  if (API_URL === DEMO_API_URL) {
    const t = await getFixedT(request);

    return {
      form: t('vendure.registrationError'),
    };
  }

  const body = await request.formData();

  const variables = extractRegistrationFormValues(body);
  const result = await registerCustomerAccount({ request }, variables);
  if (result.__typename === 'Success') {
    console.log('Registration successful');
    return redirect('/sign-up-success');
  } else {
    const formError: RegisterValidationErrors = {
      form: result.errorCode,
    };
    return json(formError, { status: 401 });
  }
}

export default function SignUpPage() {
  const [emailFeedback, setEmailFeedback] = useState<InputFeedback>({isValid: false, message: '*required'});
  const [firstNameValid, setFirstNameValid] = useState(false)
  const [lastNameValid, setLastNameValid] = useState(false)
  const [searchParams] = useSearchParams();
  const formErrors = useActionData<RegisterValidationErrors>();
  const { t } = useTranslation();

  const [passwordValid, setPasswordValid] = useState(false);
  const [repeatPasswordValid, setRepeatPasswordValid] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    if (!email) {
      setEmailFeedback({isValid: false, message: '*required'}); 
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailFeedback({isValid: false, message: 'Please enter a valid email address'});
    } else {
      setEmailFeedback({isValid: true, message: ''});
    }
  }

  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>, 
    setValid: React.Dispatch<React.SetStateAction<boolean>>) => {
    const value = event.target.value.trim();
    if (value.length < 1) {
      setValid(false);
      return;
    }
    setValid(true);
  }

  return (
    <>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl text-gray-900">
            {t('account.create')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('common.or')}{' '}
            <Link
              to="/sign-in"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('account.login')}
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 ">
            
            <Form className="space-y-6 " method="post">
              <input
                type="hidden"
                name="redirectTo"
                value={searchParams.get('redirectTo') ?? undefined}
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
                    className="input-field"
                    onChange={handleEmailChange}
                  />
                  {!emailFeedback.isValid && (
                    <div className="text-xs text-red-700">
                      {emailFeedback.message}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t('account.firstName')}
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    onChange={(event) => handleNameChange(event, setFirstNameValid)}
                    className="input-field"
                  />
                </div>
                {!firstNameValid && (
                  <div className="text-xs text-red-700">
                    *required
                  </div>)
                }
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="input-field"
                >
                  {t('account.lastName')}
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    onChange={(event) => handleNameChange(event, setLastNameValid)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                {!lastNameValid && (
                  <div className="text-xs text-red-700">
                    *required
                  </div>)
                }
              </div>
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

              {formErrors?.form && (
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
                        {t('account.createError')}
                      </h3>
                      <p className="text-sm text-red-700 mt-2">
                        {formErrors.form}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={
                    !emailFeedback.isValid ||
                    !firstNameValid ||
                    !lastNameValid ||
                    !passwordValid ||
                    !repeatPasswordValid
                  }
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    emailFeedback.isValid &&
                    firstNameValid &&
                    lastNameValid &&
                    passwordValid &&
                    repeatPasswordValid
                      ? 'bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {t('account.signUp')}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}