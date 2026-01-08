import { BitmapData } from "openfl/display/BitmapData";
import { GlowFilter } from "openfl/filters/GlowFilter";
import { AntiAliasType } from "openfl/text/AntiAliasType";
import { TextField } from "openfl/text/TextField";
import { TextFormat } from "openfl/text/TextFormat";

/**
 * Utility for rendering text to BitmapData images.
 */
export class ImageText {
    constructor() {}

    public static Get(text: string, size: number = 13, letterSpacing: number = 0, filters: any[] | null = null): BitmapData {
        const format = new TextFormat();
        format.font = "Groboldov";
        format.size = size;
        format.color = 0xFFFFFF;
        format.letterSpacing = letterSpacing;
        
        const textField = new TextField();
        textField.embedFonts = true;
        textField.antiAliasType = AntiAliasType.NORMAL;
        textField.width = 600;
        textField.defaultTextFormat = format;
        textField.htmlText = text;
        
        if (filters) {
            textField.filters = filters;
        } else {
            textField.filters = [new GlowFilter(0, 1, 2, 2, 5, 2)];
        }
        
        const bmd = new BitmapData(Math.floor(textField.textWidth + 5), Math.floor(textField.textHeight + 5), true, 0);
        bmd.draw(textField);
        return bmd;
    }
}
