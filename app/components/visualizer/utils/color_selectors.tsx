import { FILAMENT_COLORS } from "./data";
import { useState, useId } from 'react';
import chroma from 'chroma-js';
import Select, { StylesConfig } from 'react-select';

export function getHexColorByName(colorName: string): string {
    const color = FILAMENT_COLORS.find((c) => c.name === colorName);
    return color ? color.hex_code : '';
}

interface ColorOption {
    readonly value: string;  // The value of the color that will be submitted in the form
    readonly label: string;  // The display name of the color
    readonly color: string;
    readonly isDisabled?: boolean; // if true, this color will not be selectable but will be shown in the selector
}


const colorOptions: readonly ColorOption[] = FILAMENT_COLORS
    .filter((filamentColor) => filamentColor.is_supported)
    .map((filamentColor) => ({
        value: filamentColor.name,
        label: filamentColor.display_name,
        color: filamentColor.hex_code,
        isDisabled: filamentColor.is_disabled ? true : false,
    }));

const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',
    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 15,
        width: 15,
        border: (chroma.contrast(color, 'white') > 2) ? 'none' : '1px solid #ccc',
    },
});

const colorStyles: StylesConfig<ColorOption> = { // the type of colorStyles will be the output of StylesConfig that input with ColorOption
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color);
        return {
            ...styles,
            //   fontFamily: 'cursive',
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                    ? data.color
                    : isFocused
                        ? (chroma.contrast(color, 'white') > 1)
                            ? color.alpha(0.3).css()
                            : 'lightgray'
                        : undefined,
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? chroma.contrast(data.color, 'white') > 2
                        ? 'white'
                        : 'black'
                    : 'black',
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled
                    ? isSelected
                        ? data.color
                        : color.alpha(0.4).css()
                    : undefined,
            },
            ...dot(data.color),
        };
    },
    input: (styles) => ({ ...styles, ...dot(), }),  // input is the input box
    //   placeholder: (styles) => ({ ...styles, ...dot('#ccc') }), //
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }), // single value is the selected value
};

// ColorSelector is a custom selector for color
// `name` will be the key of the color in the form data
export const ColorSelector = ({
    name,
    displayName,
    defaultColor,
    onChange,
}: {
    name: string;
    displayName: string;
    defaultColor: string;
    onChange: (name: string, value: string) => void;
}) => {

    const defaultOption = colorOptions.find((option) => option.value === defaultColor);
    if (!defaultOption) {
        console.error(`Default color ${defaultColor} not found in options`);
    }
    const [selectedOption, setSelectedOption] = useState<ColorOption | null>(defaultOption || colorOptions[0]);

    const handleChange = (option: ColorOption | null) => {
        setSelectedOption(option);
        onChange(name, option ? option.value : '');
    };

    return (
        <span>
            <label htmlFor={name}>
                {displayName}
            </label>
            <Select
                defaultValue={defaultOption || colorOptions[0]}
                options={colorOptions}
                styles={colorStyles}
                onChange={(option) => handleChange(option as ColorOption)}
                instanceId={useId()} // to avoid warning of `Warning: Prop `id` did not match.` from react-select
            />
            <input type="hidden" name={name} value={selectedOption?.value} />
        </span>
    );
};