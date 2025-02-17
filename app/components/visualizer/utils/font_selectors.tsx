import { FONT_MENU, FontMenuItem } from "./data";
import React, { useState, useId } from 'react';
import Select, { StylesConfig } from 'react-select';



export const getGoogleFontLink = (): string => {
    const fontFamilies = FONT_MENU.map(
        font => font.fm_name.split(' (')[0].replace(/ /g, '+')
    ).join('&family='); // join the font family with &family=
    return `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
}


export function getFontInfoFromID(font_id: string): { fontFamily: string, fontWeight: string, fontStyle: string } {
    // font_id is in the format of "Crimson_Text__bold_italic"
    const fontWeight = font_id.split('__')[1]?.split('_')[0] || 'normal';
    const fontStyle = font_id.split('__')[1]?.split('_').length === 2 ? 'italic' : 'normal';
    const fontFamily = font_id.split('__')[0].replace(/_/g, ' ');  // e.g. 'Crimson Text'
    return { fontFamily, fontWeight, fontStyle };
}

interface FontOption {
    readonly value: string;  // The value of the font that will be submitted in the form
    readonly label: string;  // The display name of the font
    readonly fontFamily: string; // e.g. 'Crimson Text'
    readonly fontWeight: string;  // e.g. 'bold', 'regular', 'semibold, 'normal', etc.
    readonly fontStyle: string;  // currently only 'italic' or 'normal'
    readonly isDisabled?: boolean;
}

function getFontOptions(
    fontMenuItems: FontMenuItem[],
    isAdditive: boolean
): readonly FontOption[] {
    const font_id_key = isAdditive ? 'additive_font_id' : 'subtractive_font_id';

    return fontMenuItems.map((font) => {
        const font_id = font[font_id_key];

        if (!font_id) {
            console.error(`Font ID is missing for font: ${font.fm_name}`);
            return {
                value: '',
                label: font.fm_name,
                fontFamily: font.fm_name.split(' (')[0],
                fontWeight: 'normal',
                fontStyle: 'normal',
                isDisabled: true,
            };
        }

        return {
            value: font_id,  // e.g. "Crimson_Text__bold_italic"
            label: font.fm_name, // e.g. 'Crimson Text (Italic)'
            isDisabled: font.is_disabled ? true : false,
            ...getFontInfoFromID(font_id)
        };
    });
}

const additiveFontOptions: readonly FontOption[] = getFontOptions(FONT_MENU, true);
const subtractiveFontOptions: readonly FontOption[] = getFontOptions(FONT_MENU, false);

const fontStyles: StylesConfig<FontOption> = { // the type of fontStyles will be the output of StylesConfig that input with FontOption
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            fontFamily: data.fontFamily,
            fontWeight: data.fontWeight,
            fontStyle: data.fontStyle,
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                    ? '#007BFF'
                    : isFocused
                        ? '#00EEFFFF'
                        : undefined,
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? 'white'
                    : 'black',
            cursor: isDisabled ? 'not-allowed' : 'default',
        };
    },
    input: (styles) => ({ ...styles }),  // input is the input box
    singleValue: (styles, { data }) => ({ // single value is the selected value
        ...styles,
        fontFamily: data.fontFamily,
        fontWeight: data.fontWeight,
        fontStyle: data.fontStyle,
    }),
};

export const FontSelector = ({
    name,
    displayName,
    isAdditive,
    defaultFont,
    onChange,
}: {
    name: string;
    displayName: string;
    isAdditive: boolean;
    defaultFont: string;
    onChange: (name: string, value: string) => void;
}) => {
    const fontOptions = isAdditive ? additiveFontOptions : subtractiveFontOptions;
    const defaultOption = fontOptions.find((option) => option.value === defaultFont);
    if (!defaultOption) {
        console.error(`Default font ${defaultFont} not found in options`);
    }
    const [selectedOption, setSelectedOption] = useState<FontOption | null>(defaultOption || fontOptions[0]);

    const handleChange = (option: FontOption | null) => {
        setSelectedOption(option);
        onChange(name, option ? option.value : '');
    };

    return (
        <span>
            <label htmlFor={name}>
                {displayName}
            </label>

            <Select
                defaultValue={defaultOption || fontOptions[0]}
                options={fontOptions}
                styles={fontStyles}
                onChange={(option) => handleChange(option as FontOption)}
                instanceId={useId()} // to avoid warning of `Warning: Prop `id` did not match.` from react-select
            // although it causes `Warning: Extra attributes from the server: aria-activedescendant` in the console
            />
            <input type="hidden" name={name} value={selectedOption?.value} />
        </span>
    );
};