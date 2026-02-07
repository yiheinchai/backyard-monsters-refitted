import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import { ImageCache } from './com/monsters/display/ImageCache';
import { SpecialInfo_CLIP } from './SpecialInfo_CLIP';

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }


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
            this.tName.htmlText = "<b>" + name + ": " + getGLOBAL().FormatNumber(quantity) + "</b>";
        } else {
            this.tName.htmlText = "<b>" + name + "</b>";
        }
        ImageCache.GetImageWithCallBack(image, ImageLoaded);
    }
}
