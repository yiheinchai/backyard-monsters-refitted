import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MouseEvent from 'openfl/events/MouseEvent';
import { ImageCache } from './com/monsters/display/ImageCache';
import { popup_prefab_enlarge_CLIP } from './popup_prefab_enlarge_CLIP';
import { GLOBAL } from './GLOBAL';
import { POPUPSETTINGS } from './POPUPSETTINGS';

/**
 * popup_prefab_enlarge - Enlarged prefab popup for displaying large prefab images
 * Converted from ActionScript to TypeScript
 */
export class popup_prefab_enlarge extends popup_prefab_enlarge_CLIP {
    constructor() {
        super();
    }

    public Setup(param1: number): void {
        ImageCache.GetImageWithCallBack(
            "ui/prefab-large-" + (param1 + 1) + ".v5.jpg",
            this.ShowImage.bind(this),
            true,
            1
        );
    }

    public ShowImage(param1: string, param2: BitmapData): void {
        this.mcImage.addChild(new Bitmap(param2));
    }

    public Hide(param1: MouseEvent | null = null): void {
        GLOBAL.BlockerRemove();
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }
}
