import MouseEvent from 'openfl/events/MouseEvent';
import { UI_WILDMONSTERBAR_CLIP } from './UI_WILDMONSTERBAR_CLIP';

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("./KEYS").KEYS; }
function getWMATTACK(): any { return require("./WMATTACK").WMATTACK; }


export class UI_WILDMONSTERBAR extends UI_WILDMONSTERBAR_CLIP {
    constructor() {
        super();
        this.info.addEventListener(MouseEvent.CLICK, this.infoDown.bind(this));
        this.tA.htmlText = getKEYS().Get("ai_monsterbar_title");
        this.info.addEventListener(MouseEvent.MOUSE_OVER, this.infoOver.bind(this));
        this.info.addEventListener(MouseEvent.MOUSE_OUT, this.infoOut.bind(this));
        (this.info as any).tA.htmlText = "<b>" + getKEYS().Get("ai_monsterbar_sendnow_btn") + "</b>";
        this.info.mouseChildren = false;
        this.info.useHandCursor = true;
    }

    private infoOver(param1: MouseEvent): void {
        this.info.gotoAndStop(2);
    }

    private infoOut(param1: MouseEvent): void {
        this.info.gotoAndStop(1);
    }

    private infoDown(param1: MouseEvent): void {
        getWMATTACK().Attack();
    }
}
