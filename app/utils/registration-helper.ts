import { RegisterCustomerAccountMutationVariables } from '~/generated/graphql';


export const extractRegistrationFormValues = (
  formData: FormData,
): RegisterCustomerAccountMutationVariables => {
  const input: RegisterCustomerAccountMutationVariables['input'] = {
    emailAddress: formData.get('email') as string,
    firstName: (formData.get('firstName') as string) || void 0,
    lastName: (formData.get('lastName') as string) || void 0,
    password: formData.get('password') as string,
  };

  return { input };
};
