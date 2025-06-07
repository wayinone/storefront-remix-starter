import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon, CheckIcon} from '@heroicons/react/24/solid';
import { isStrongPassword } from '~/utils/ensure-strong-password';
import { set } from 'zod';


interface PasswordInputProps {
	label: string; // Label will be displayed above the input field
  name: string; // name for the input,for the form submission (this is the element name in request.formData())
  completeSignal: boolean
	setCompleteSignal: Dispatch<SetStateAction<boolean>>; // external signal to indicate if the password is valid
	setIncompleteSignal?: Dispatch<SetStateAction<boolean>>; // external signal to indicate other fields are not valid (e.g. repeat password will set to be invalid if the password is being edited)
	checkStrongPassword?: boolean;
	passwordToBeRepeated?: string; // if set, it will check if the input is the same as this value
  setValue?: Dispatch<SetStateAction<string>>; // optional, if set, it will set the value of the input field
}

export function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [invalidMessages, setInvalidateMessages] = useState<string[]>(['*required']); // default message, will be removed when the user starts typing
  const [fieldValue, setFieldValue] = useState('');


	const validatePassword = () => {
		const validationResult = isStrongPassword(fieldValue);
		if (!validationResult.isValid) {
      setInvalidateMessages(validationResult.errorMessages);
      props.setCompleteSignal(false);
    }
    else {
      setInvalidateMessages([]);
      props.setCompleteSignal(true);
    }
  }

  const checkPasswordRepeat = () => {
    if (fieldValue === '') {
      setInvalidateMessages(['*required']);
      props.setCompleteSignal(false);
    } else if (props.passwordToBeRepeated && fieldValue !== props.passwordToBeRepeated) {
      setInvalidateMessages(['Passwords do not match']);
      props.setCompleteSignal(false);
    } else {
      setInvalidateMessages([]);
      props.setCompleteSignal(true);
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Effect to take place whenever the `fieldValue` changes.
  // Without this, the input field will not be immediately updated, instead it will be updated on previous state when the input is changed.
  useEffect(() => {
    if (props.setValue) {
      props.setValue(fieldValue); // Set the value in the parent component if provided
    }
    if (props.setIncompleteSignal) {
      props.setIncompleteSignal(false); // Reset the incomplete signal when the password is being edited
    }
    if (props.checkStrongPassword) {
      validatePassword();
    }
    if (props.passwordToBeRepeated) {
      checkPasswordRepeat();
    }
    // If both checkStrongPassword and passwordToBeRepeated are not set, just set the isValid state to true
    if (!props.checkStrongPassword && !props.passwordToBeRepeated) {
      if (fieldValue === '') {
        setInvalidateMessages(['*required']);
        props.setCompleteSignal(false);
      } else {
        setInvalidateMessages([]);
        props.setCompleteSignal(true);
      }
    }
  }, [fieldValue]); // Run this effect whenever `fieldValue` changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(e.target.value); // Update the state
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{props.label}</label>
      <div className="mt-1 relative">
        <input
          id={props.name}
          name={props.name}
          type={showPassword ? 'text' : 'password'}
          onChange={handleChange}
          className="input-field"
        />

        {/* Check Icon */}
        {props.completeSignal && (
        <div className="absolute inset-y-0 right-6 pr-3 flex items-center">
          <CheckIcon className="text-green-600 w-6 h-6"/>
        </div>
        )}

        {/* visibility button */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2 group">
          <button
            type="button"
            onClick={toggleShowPassword} 
            >
            {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
            <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </button>
        </div>        
      </div>
      {/* Error message */}
      {(invalidMessages.length>0) &&(
      <div className="text-xs text-red-700 space-y-0 mt-1">        
        {invalidMessages.map((msg) => (
          <p key={msg} className="mb-1">
            {msg}
          </p>
        ))}
      </div>
      )}
    </div>
  );
}