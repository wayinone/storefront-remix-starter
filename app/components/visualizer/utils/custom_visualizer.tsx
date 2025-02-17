
import { BUILD_DIMS, px2mm } from './constants';

import { getFontInfoFromID } from './font_selectors';
import { getHexColorByName } from './color_selectors';

const ADDITIVE_PLATE_CANVAS_ID = 'canvas_additive';
const SUBTRACTIVE_PLATE_CANVAS_ID = 'canvas_subtractive';

function gel(id: string): HTMLElement {   
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id ${id} not found`);
    }
    return element as HTMLElement;
}

export type ItemOptions = {
    text_top: string;
    text_bottom: string;
    font_top: string;
    font_bottom: string;
    primary_color: string;
    base_color: string;
}

function getFontCanvasString(
    itemOptions: ItemOptions,
    is_subtractive: boolean,
    font_size_multiplier: number = 1.0): string {
    let font = is_subtractive ? itemOptions.font_bottom : itemOptions.font_top;
    let fontInfo = getFontInfoFromID(font);
    const font_option_text = `${fontInfo.fontStyle} normal normal ${BUILD_DIMS.font_size * font_size_multiplier}px ${fontInfo.fontFamily}`;
    return font_option_text;
}

type BboxInfo = {
    x: number;
    y: number;
    w: number;
    h: number;
    text_start_y: number;
    text_start_x_offset: number;
    font_string: string;
}

function getTextBoundingBox(
    itemOptions: ItemOptions, 
    ctx: CanvasRenderingContext2D,
    text_x: number, 
    text_y: number,
    is_subtractive: boolean
): BboxInfo {
    // get xywh of the text bounding box
    let font_string = getFontCanvasString(itemOptions, is_subtractive);
    ctx.font = font_string;
    let text = is_subtractive ? itemOptions.text_bottom : itemOptions.text_top;
    let textMetrics_raw = ctx.measureText(text);
    let textHeight_raw = textMetrics_raw.actualBoundingBoxAscent + textMetrics_raw.actualBoundingBoxDescent;

    let font_string_adjusted = getFontCanvasString(itemOptions, is_subtractive, BUILD_DIMS.font_size / textHeight_raw);
    ctx.font = font_string_adjusted;
    let textMetrics = ctx.measureText(text);
    let textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

    let font = is_subtractive ? itemOptions.font_bottom : itemOptions.font_top;
    let italic_adjustment = getFontInfoFromID(font).fontStyle === 'italic' ? BUILD_DIMS.text_extra_margin_right_for_italic : BUILD_DIMS.text_extra_margin_right;

    let x = text_x - textMetrics.actualBoundingBoxLeft;
    let y = text_y - textMetrics.actualBoundingBoxAscent;
    let w = textMetrics.width;
    let h = textHeight;
    return {
        x: x,
        y: y,
        w: w + italic_adjustment,
        h: h,
        text_start_y: text_y + textMetrics.actualBoundingBoxAscent,
        text_start_x_offset: italic_adjustment / 3,
        font_string: font_string_adjusted
    }
}


const start_x = 50;
const start_y = 30;

async function draw_a_blank_plate_v2(
    itemOptions: ItemOptions,
    canvas_additive: HTMLCanvasElement,
    canvas_subtractive: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    text_width: number, 
    is_subtractive = false) {

    // clear the canvas
    if (!is_subtractive) {
        ctx.clearRect(0, 0, canvas_additive.width, canvas_additive.height);
    } else {
        ctx.clearRect(0, 0, canvas_subtractive.width, canvas_subtractive.height);
    }
    ctx.lineWidth = 0;

    let text_padding = BUILD_DIMS.text_margin + BUILD_DIMS.boarder_width;
    let overall_height = BUILD_DIMS.font_size + 2 * text_padding;
    let overall_width = text_width + 2 * text_padding + BUILD_DIMS.ring_width;

    // set the canvas width to fit the plate
    ctx.canvas.width  = overall_width + 20;

    ctx.fillStyle = getHexColorByName(itemOptions.primary_color);
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    // The overall outer shape
    ctx.roundRect(
        start_x - text_padding - BUILD_DIMS.ring_width,
        start_y - text_padding,
        text_width + 2 * text_padding + BUILD_DIMS.ring_width,
        overall_height,
        8
    );

    // The ring hole
    ctx.roundRect(
        start_x - text_padding - BUILD_DIMS.ring_width + BUILD_DIMS.offset_ring_hole,
        start_y - text_padding + BUILD_DIMS.offset_ring_hole,
        BUILD_DIMS.w_ring_hole,
        overall_height - BUILD_DIMS.offset_ring_hole * 2,
        5
    );
    ctx.stroke();
    ctx.fill('evenodd');

    ctx.lineWidth = BUILD_DIMS.back_skirt_channel_width;
    ctx.strokeStyle = getHexColorByName(itemOptions.base_color)
    ctx.beginPath();
    ctx.roundRect(
        start_x - BUILD_DIMS.text_margin,
        start_y - BUILD_DIMS.text_margin,
        text_width + 2 * BUILD_DIMS.text_margin,
        overall_height - 2 * BUILD_DIMS.boarder_width,
        3
    );
    ctx.stroke()
    if (!is_subtractive) {

        ctx.fillStyle = getHexColorByName(itemOptions.base_color)
        ctx.fill();
    }
    // ctx.strokeStyle = 'black';
}

function draw_text(
    itemOptions: ItemOptions, 
    ctx: CanvasRenderingContext2D,
    bbox: BboxInfo,
    base_width: number,
    is_subtractive: boolean
) {
    let text = is_subtractive ? itemOptions.text_bottom : itemOptions.text_top;
    let color = is_subtractive ? getHexColorByName(itemOptions.base_color) : getHexColorByName(itemOptions.primary_color);
    ctx.fillStyle = color;
    ctx.font = bbox.font_string;
    let x_offset = (base_width - bbox.w) / 2;
    ctx.fillText(text, start_x + x_offset + bbox.text_start_x_offset, bbox.text_start_y);
    ctx.stroke();
}


// Draw the text on the canvas, the return value is the width of the board in cm
export async function draw_text_on_canvas(
    itemOptions: ItemOptions,
): Promise<number> {
    const canvas_additive = gel(ADDITIVE_PLATE_CANVAS_ID) as HTMLCanvasElement;
    const canvas_subtractive = gel(SUBTRACTIVE_PLATE_CANVAS_ID) as HTMLCanvasElement;
    let ctx_t = canvas_additive.getContext('2d');
    let ctx_b = canvas_subtractive.getContext('2d');
    if (!ctx_t || !ctx_b) {
        throw new Error('Failed to get 2D context');    
    }
    let bbox_top = getTextBoundingBox(itemOptions, ctx_t, start_x, start_y, false);
    let bbox_btm = getTextBoundingBox(itemOptions, ctx_b, start_x, start_y, true);
    let text_width = Math.max(bbox_top.w, bbox_btm.w);

    draw_a_blank_plate_v2(itemOptions, canvas_additive, canvas_subtractive, ctx_t, text_width, false);
    draw_a_blank_plate_v2(itemOptions, canvas_additive, canvas_subtractive, ctx_b, text_width, true);

    draw_text(itemOptions, ctx_t, bbox_top, text_width, false);
    draw_text(itemOptions, ctx_b, bbox_btm, text_width, true);

    let boardWidth = text_width + BUILD_DIMS.ring_width + 2 * (BUILD_DIMS.text_margin + BUILD_DIMS.boarder_width);
    let boardWidth_cm = (px2mm * boardWidth /10).toFixed(1);
    return parseFloat(boardWidth_cm);
}

export const BuildPlateVisualizer = () => {
    return (
        <div className="overflow-auto overflow-y-hidden p-0 bg-white">
            <canvas id={ADDITIVE_PLATE_CANVAS_ID} />
            <canvas id={SUBTRACTIVE_PLATE_CANVAS_ID} />
        </div>
    );
};