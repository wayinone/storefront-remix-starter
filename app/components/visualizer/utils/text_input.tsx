import React, { useState } from 'react';
import { CONSTRAINTS } from "./constants";


export type TextCheckMessage = {
    message: string;
    isValid: boolean;
}

const validRegExTest = new RegExp(`^[${CONSTRAINTS.validSpecialChars}]+$`);

export async function textCheck(text: string): Promise<TextCheckMessage> {
    // check if the text is empty
    if (text.length === 0) {
        return { message: 'Text cannot be empty', isValid: false };
    }

    if ((text.startsWith(' ')) || text.endsWith(' ')) {
        return { message: 'Text cannot start or end with space', isValid: false };
    }

    // check if the text is too long
    if (text.length > CONSTRAINTS.maxTextLength) {
        return { message: `Text is too long (limit to ${CONSTRAINTS.maxTextLength} characters)`, isValid: false };
    }

    // check if the text contains special characters
    if (!validRegExTest.test(text)) {
        return {
            message: `Text contains invalid characters, only ${CONSTRAINTS.validSpecialChars} are allowed`,
            isValid: false
        };
    }
    return { message: 'Text is valid', isValid: true };
}

export const TextInputBox = ({
    name,
    displayName,
    onChange,
    defaultValue = 'Example Text',
}: {
    name: string;
    displayName: string;
    onChange: (name: string, value: string, allowed: boolean) => void;
    defaultValue?: string;
}) => {

    const [textWarning, setTextWarning] = useState<TextCheckMessage>({ message: '', isValid: true });

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextWarning(
            await textCheck(event.target.value).then((res) => {
                onChange(name, event.target.value, res.isValid);
                return res;
            })
        );
    };

    return (
        <span>
            <label htmlFor={name} className=''>{displayName}</label>
            <input
                type="text"
                className="form-control bg-white text-black font-mono w-30"
                id={name}
                name={name}
                onChange={handleChange}
                defaultValue={defaultValue}
            />
            {!textWarning.isValid && <small className="text-red-500">Warning: {textWarning.message}</small>}
        </span>
    );
};