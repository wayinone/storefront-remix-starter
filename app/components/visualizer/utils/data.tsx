type FILAMENT_COLOR = {
  name: string;  // name of the color used in storing parameters
  display_name: string;  // name of the color shown in the selector
  hex_code: string;
  is_disabled?: boolean;  // if true, it will be shown in the selector but not selectable (Good for OOS colors)
  is_supported?: boolean;  // if false, it will not be shown in the selector
}

export const FILAMENT_COLORS: FILAMENT_COLOR[] = [
  {
    "name": "lemon_yellow",
    "display_name": "Lemon Yellow",
    "hex_code": "#F7D959",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "dark_red",
    "display_name": "Dark Red",
    "hex_code": "#BB3D43",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "dark_brown",
    "display_name": "Dark Brown",
    "hex_code": "#7D6556",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "dark_green",
    "display_name": "Dark Green",
    "hex_code": "#68724D",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "dark_blue",
    "display_name": "Dark Blue",
    "hex_code": "#042F56",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "jade_white",
    "display_name": "Jade White",
    "hex_code": "#FFFFFF",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "beige",
    "display_name": "Beige",
    "hex_code": "#F7E6DE",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "gray",
    "display_name": "Gray",
    "hex_code": "#8E9089",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "bronze",
    "display_name": "Bronze",
    "hex_code": "#847D48",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "brown",
    "display_name": "Brown",
    "hex_code": "#9D432C",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "cocoa_brown",
    "display_name": "Cocoa Brown",
    "hex_code": "#6F5034",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "maroon_red",
    "display_name": "Maroon Red",
    "hex_code": "#9D2235",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "red",
    "display_name": "Red",
    "hex_code": "#C12E1F",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "pink",
    "display_name": "Pink",
    "hex_code": "#F55A74",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "hot_pink",
    "display_name": "Hot Pink",
    "hex_code": "#F5547C",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "orange",
    "display_name": "Orange",
    "hex_code": "#FF6A13",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "pumpkin_orange",
    "display_name": "Pumpkin Orange",
    "hex_code": "#FF9016",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "yellow",
    "display_name": "Yellow",
    "hex_code": "#F4EE2A",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "bright_green",
    "display_name": "Bright Green",
    "hex_code": "#BECF00",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "bambu_green",
    "display_name": "Bambu Green",
    "hex_code": "#00AE42",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "mistletoe_green",
    "display_name": "Mistletoe Green",
    "hex_code": "#3F8E43",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "cyan",
    "display_name": "Cyan",
    "hex_code": "#0086D6",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "blue",
    "display_name": "Blue",
    "hex_code": "#0A2989",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "cobalt_blue",
    "display_name": "Cobalt Blue",
    "hex_code": "#0056B8",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "purple",
    "display_name": "Purple",
    "hex_code": "#5E43B7",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "indigo_purple",
    "display_name": "Indigo Purple",
    "hex_code": "#482960",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "blue_gray",
    "display_name": "Blue Gray",
    "hex_code": "#5B6579",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "light_gray",
    "display_name": "Light Gray",
    "hex_code": "#D1D3D5",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "dark_gray",
    "display_name": "Dark Gray",
    "hex_code": "#545454",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "black",
    "display_name": "Black",
    "hex_code": "#000000",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "ivory_white",
    "display_name": "Ivory White",
    "hex_code": "#FFFFFF",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "latte_brown",
    "display_name": "Latte Brown",
    "hex_code": "#D3B7A7",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "desert_tan",
    "display_name": "Desert Tan",
    "hex_code": "#E8DBB7",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "ash_gray",
    "display_name": "Ash Gray",
    "hex_code": "#9B9EA0",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "lilac_purple",
    "display_name": "Lilac Purple",
    "hex_code": "#AE96D4",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "sakura_pink",
    "display_name": "Sakura Pink",
    "hex_code": "#E8AFCF",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "mandarin_orange",
    "display_name": "Mandarin Orange",
    "hex_code": "#F99963",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "scarlet_red",
    "display_name": "Scarlet Red",
    "hex_code": "#DE4343",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "grass_green",
    "display_name": "Grass Green",
    "hex_code": "#61C680",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "ice_blue",
    "display_name": "Ice Blue",
    "hex_code": "#A3D8E1",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "marine_blue",
    "display_name": "Marine Blue",
    "hex_code": "#0078BF",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "charcoal",
    "display_name": "Charcoal",
    "hex_code": "#000000",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "gold",
    "display_name": "Gold",
    "hex_code": "#E4BD68",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "silver",
    "display_name": "Silver",
    "hex_code": "#A6A9AA",
    "is_disabled": true,
    "is_supported": false
  },
  {
    "name": "sunflower_yellow",
    "display_name": "Sunflower Yellow",
    "hex_code": "#FEC600",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "magenta",
    "display_name": "Magenta",
    "hex_code": "#EC008C",
    "is_disabled": false,
    "is_supported": true
  },
  {
    "name": "turquoise",
    "display_name": "Turquoise",
    "hex_code": "#00B1B7",
    "is_disabled": false,
    "is_supported": true
  }
]

export type FontMenuItem = {
  fm_name: string;
  additive_font_id: string;
  subtractive_font_id: string;
  is_disabled?: boolean;  // if true, it will be shown in the selector but not selectable
}

export const FONT_MENU: FontMenuItem[] = [
  {
    "fm_name": "Caveat",
    "additive_font_id": "Caveat__medium",
    "subtractive_font_id": "Caveat__medium"
  },
  {
    "fm_name": "Charm",
    "additive_font_id": "Charm__bold",
    "subtractive_font_id": "Charm__regular"
  },
  {
    "fm_name": "Comic Neue",
    "additive_font_id": "Comic_Neue__bold",
    "subtractive_font_id": "Comic_Neue__bold"
  },
  {
    "fm_name": "Crimson Text",
    "additive_font_id": "Crimson_Text__bold",
    "subtractive_font_id": "Crimson_Text__semibold"
  },
  {
    "fm_name": "Crimson Text (Italic)",
    "additive_font_id": "Crimson_Text__bold_italic",
    "subtractive_font_id": "Crimson_Text__semibold_italic"
  },
  {
    "fm_name": "Fuzzy Bubbles",
    "additive_font_id": "Fuzzy_Bubbles__bold",
    "subtractive_font_id": "Fuzzy_Bubbles__regular"
  },
  {
    "fm_name": "Gluten",
    "additive_font_id": "Gluten__semibold",
    "subtractive_font_id": "Gluten__regular"
  },
  {
    "fm_name": "Gorditas",
    "additive_font_id": "Gorditas__bold",
    "subtractive_font_id": "Gorditas__regular"
  },
  {
    "fm_name": "Kalam",
    "additive_font_id": "Kalam__bold",
    "subtractive_font_id": "Kalam__regular"
  },
  {
    "fm_name": "Kodchasan",
    "additive_font_id": "Kodchasan__bold",
    "subtractive_font_id": "Kodchasan__medium"
  },
  {
    "fm_name": "Kodchasan (Italic)",
    "additive_font_id": "Kodchasan__bold_italic",
    "subtractive_font_id": "Kodchasan__medium_italic"
  },
  {
    "fm_name": "Mitr",
    "additive_font_id": "Mitr__bold",
    "subtractive_font_id": "Mitr__regular"
  },
  {
    "fm_name": "Noto Serif",
    "additive_font_id": "Noto_Serif__black",
    "subtractive_font_id": "Noto_Serif__medium"
  },
  {
    "fm_name": "Noto Serif (Italic)",
    "additive_font_id": "Noto_Serif__extrabold_italic",
    "subtractive_font_id": "Noto_Serif__medium_italic"
  },
  {
    "fm_name": "Oleo Script",
    "additive_font_id": "Oleo_Script__bold",
    "subtractive_font_id": "Oleo_Script__regular"
  },
  {
    "fm_name": "Oleo Script Swash Caps",
    "additive_font_id": "Oleo_Script_Swash_Caps__bold",
    "subtractive_font_id": "Oleo_Script_Swash_Caps__regular"
  },
  {
    "fm_name": "Roboto",
    "additive_font_id": "Roboto__black",
    "subtractive_font_id": "Roboto__medium"
  },
  {
    "fm_name": "Roboto (Italic)",
    "additive_font_id": "Roboto__black_italic",
    "subtractive_font_id": "Roboto__medium_italic"
  },
  {
    "fm_name": "Tillana",
    "additive_font_id": "Tillana__extrabold",
    "subtractive_font_id": "Tillana__regular"
  },
  {
    "fm_name": "Ubuntu Mono",
    "additive_font_id": "Ubuntu_Mono__bold",
    "subtractive_font_id": "Ubuntu_Mono__regular"
  }
]