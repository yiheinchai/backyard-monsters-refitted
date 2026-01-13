import MouseEvent from 'openfl/events/MouseEvent';
import { popup_prefab_help_CLIP } from './popup_prefab_help_CLIP';
import { popup_prefab } from './popup_prefab';
import { KEYS } from './KEYS';
import { POPUPS } from './POPUPS';

/**
 * popup_prefab_help - Help popup for prefab starter kits
 * Converted from ActionScript to TypeScript
 */
export class popup_prefab_help extends popup_prefab_help_CLIP {
    constructor() {
        super();
        this.b1.SetupKey("newmap_sk_btn");
        this.b1.Highlight = true;
        this.b1.addEventListener(MouseEvent.CLICK, this.Next.bind(this));
        this.tTitle.htmlText = KEYS.Get("newmap_sk_title");
        this.tMessage.htmlText = KEYS.Get("newmap_sk_hlp");
    }

    private Next(param1: MouseEvent | null = null): void {
        this.b1.removeEventListener(MouseEvent.CLICK, this.Next.bind(this));
        POPUPS.Next();
        POPUPS.Push(new popup_prefab());
    }
}
