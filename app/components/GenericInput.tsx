import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const EMAIL_REGEX = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

interface GenericInputProps {
  label: string; // Label will be displayed above the input field
  name: string; // name for the input, for the form submission (this is the element name in request.formData())
  completeSignal: boolean; // external signal to indicate if the email is valid
  setCompleteSignal: Dispatch<SetStateAction<boolean>>; // external signal to indicate if the email is valid
  isEmail?: boolean; // if true, it will validate the input as an email
  isRequired?: boolean; // if true, it will require the input to be filled
}

export function GenericInput(props: GenericInputProps) {
  const [fieldValue, setFieldValue] = useState('');
  const [invalidMessages, setInvalidateMessages] = useState<string[]>(['*required']); // default message, will be removed when the user starts typing

  const validateEmail = () => {
    if (!fieldValue) {
      setInvalidateMessages(['*required']);
      props.setCompleteSignal(false);
    } else if (!EMAIL_REGEX.test(fieldValue)) {
      setInvalidateMessages(['Please enter a valid email address']);
      props.setCompleteSignal(false);
    } else {
      setInvalidateMessages([]);
      props.setCompleteSignal(true);
    }
  };

  useEffect(() => {
    
    if (!fieldValue && props.isRequired) {
      setInvalidateMessages(['*required']);
      props.setCompleteSignal(false);
    }
    else if (fieldValue) {
      if (props.isEmail) {
        validateEmail();
      } else {
        setInvalidateMessages([]);
        props.setCompleteSignal(true);
      }
    }
    
  }, [fieldValue]);

  return (
    <div>
      <label htmlFor={props.name} className="block text-sm font-medium text-gray-700">
        {props.label}
      </label>
      <div className="mt-1">
        <input
          type={props.isEmail ? 'email' : 'text'}
          autoComplete={props.isEmail ? 'email' : props.name}
          required={props.isRequired}
          name={props.name}
          id={props.name}
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          className="input-field"
        />
      </div>
      {invalidMessages.length > 0 && (
        <div className="text-red-500 text-sm mt-1">
          {invalidMessages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      )}
    </div>
  );
}