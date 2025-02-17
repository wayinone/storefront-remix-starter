import React, { useState, useEffect } from 'react';
import { Form, useFetcher } from '@remix-run/react';
// import { ColorSelector, FontSelector, TextInputBox, getGoogleFontLink, textCheck, TextCheckMessage } from '~/utils/custom_selectors';
import { ColorSelector } from '~/components/visualizer/utils/color_selectors';
import { FontSelector, getGoogleFontLink } from '~/components/visualizer/utils/font_selectors';
import { TextInputBox, textCheck, TextCheckMessage } from '~/components/visualizer/utils/text_input';
import { BuildPlateVisualizer, ItemOptions, draw_text_on_canvas } from '~/components/visualizer/utils/custom_visualizer';
import { ActionFunctionArgs, DataFunctionArgs, LinksFunction } from '@remix-run/node';
import { CONSTRAINTS, DEFAULT_DISPLAY } from '~/components/visualizer/utils/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import { action } from '~/routes/api.active-order';

export const links: LinksFunction = () => {
    return [
        { rel: 'stylesheet', href: getGoogleFontLink() },
    ];
}


export function PlateCustomizer({
    allowATC,
    setAllowATC,
}: {
    allowATC: boolean;
    setAllowATC: React.Dispatch<React.SetStateAction<boolean>>;
}) {

    const fetcher = useFetcher();

    const [itemOptions, setItemOptions] = useState<ItemOptions>({
        text_top: DEFAULT_DISPLAY.text,
        text_bottom: DEFAULT_DISPLAY.text,
        primary_color: DEFAULT_DISPLAY.primary_color,
        base_color: DEFAULT_DISPLAY.base_color,
        font_top: DEFAULT_DISPLAY.font_top,
        font_bottom: DEFAULT_DISPLAY.font_bottom
    });

    const [sameColorWarning, setSameColorWarning] = useState(false);

    const [boardWidth_cm, setBoardWidth_cm] = useState(8.0);

    let currentBoardWidth: number = 8.0;

    // useEffect is to handle client-side rendering (so that we have `document` object inside
    //  the function `draw_text_on_canvas`)
    // Note that this hook will run depends on the state of itemOptions
    useEffect(() => {
        const updateBoardWidth = async () => {
            currentBoardWidth = await draw_text_on_canvas(itemOptions);
            // if (currentBoardWidth > CONSTRAINTS.maxPlateWidth) {
            //     setAllowUpdateBoard(false);
            // }
            setBoardWidth_cm(currentBoardWidth);
            setAllowATC(currentBoardWidth <= CONSTRAINTS.maxPlateWidth);
        };
        updateBoardWidth();
    }, [itemOptions]);

    const handleInputChange = (name: string, value: string, allowed: boolean = true) => {
        // This function is to update the state of the itemOptions when the user changes the input

        let sameColorEvent = false;
        if (name === 'primary_color') {
            sameColorEvent = (value === itemOptions.base_color);
        }
        else if (name === 'base_color') {
            sameColorEvent = (value === itemOptions.primary_color);
        }
        setSameColorWarning(sameColorEvent);

        if (allowed && !sameColorEvent) {
            setItemOptions((prevOptions) => ({
                ...prevOptions,
                [name]: value,
            }));
        }
        else {
            setAllowATC(false);
        }
    };

    return (
            <div className='form-group  flex-column align-items-center pl-2'>
                <div className='form-group d-flex  space-x-2  pt-1'>
                    <TextInputBox name="text_top" displayName="Text Top" defaultValue={DEFAULT_DISPLAY.text} onChange={handleInputChange} />
                    <FontSelector name="font_top" displayName="Top Plate Font" isAdditive={true} defaultFont={DEFAULT_DISPLAY.font_top} onChange={handleInputChange} />
                </div>
                <div className='form-group d-flex  space-x-2  pt-1'>
                    <TextInputBox name="text_bottom" displayName="Text Bottom" defaultValue={DEFAULT_DISPLAY.text} onChange={handleInputChange} />
                    <FontSelector name="font_bottom" displayName="Bottom Plate Font" isAdditive={false} defaultFont={DEFAULT_DISPLAY.font_bottom} onChange={handleInputChange} />
                </div>

                <div className='form-group space-x-2 d-flex  pt-1' >
                    <ColorSelector name="primary_color" displayName="Primary Color" defaultColor={DEFAULT_DISPLAY.primary_color} onChange={handleInputChange} />
                </div>
                <div className='form-group space-x-2 d-flex  pt-1'>
                    <ColorSelector name="base_color" displayName="Base Color" defaultColor={DEFAULT_DISPLAY.base_color} onChange={handleInputChange} />
                </div>
                {sameColorWarning && <p className='text-red-500'>Error!: Primary color and base color are the same!</p>}

                <div className='p-2'>
                    <BuildPlateVisualizer />
                    <p> H x W (estimated): 1.8 cm x <span className={boardWidth_cm > CONSTRAINTS.maxPlateWidth ? 'text-red-500' : ''}>{boardWidth_cm}</span> cm </p>
                    {boardWidth_cm > CONSTRAINTS.maxPlateWidth && <p className='text-red-500'>Error!: Build width is too wide (more than {CONSTRAINTS.maxPlateWidth}cm). Try changing a font or using lowercase letters.</p>}
                </div>
            </div>
    );
}

// define the action that do the submit, for test purpose, just print the input text
// note that action is executed at server side
// export const action = async ({ request }: ActionFunctionArgs) => {
//     const data = new URLSearchParams(await request.text());

//     console.log(data);

//     const itemOptions: ItemOptions = {
//         text_top: data.get('text_top') || '',
//         text_bottom: data.get('text_bottom') || '',
//         primary_color: data.get('primary_color') || '',
//         base_color: data.get('base_color') || '',
//         font_top: data.get('font_top') || '',
//         font_bottom: data.get('font_bottom') || ''
//     };

//     return new Response(JSON.stringify({ itemOptions }), {
//         status: 200,
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
// };