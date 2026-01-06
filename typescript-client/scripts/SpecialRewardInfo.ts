import { Bitmap } from 'openfl/display/Bitmap';
import { BitmapData } from 'openfl/display/BitmapData';
import { ImageCache } from './com/monsters/display/ImageCache';
import { SpecialInfo_CLIP } from './SpecialInfo_CLIP';
import { GLOBAL } from './GLOBAL';

export class SpecialRewardInfo extends SpecialInfo_CLIP {
    constructor() {
        super();
    }

    public Setup(name: string, quantity: number, image: string): void {
        const ImageLoaded = (param1: string, param2: BitmapData): void => {
            this.mcImage.addChild(new Bitmap(param2));
            this.mcImage.width = 30;
            this.mcImage.height = 27;
        };

        if (quantity) {
            this.tName.htmlText = "<b>" + name + ": " + GLOBAL.FormatNumber(quantity) + "</b>";
        } else {
            this.tName.htmlText = "<b>" + name + "</b>";
        }
        ImageCache.GetImageWithCallBack(image, ImageLoaded);
    }
}
