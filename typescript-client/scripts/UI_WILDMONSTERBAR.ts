import { MouseEvent } from 'openfl/events/MouseEvent';
import { UI_WILDMONSTERBAR_CLIP } from './UI_WILDMONSTERBAR_CLIP';
import { KEYS } from './KEYS';
import { WMATTACK } from './WMATTACK';

export class UI_WILDMONSTERBAR extends UI_WILDMONSTERBAR_CLIP {
    constructor() {
        super();
        this.info.addEventListener(MouseEvent.CLICK, this.infoDown.bind(this));
        this.tA.htmlText = KEYS.Get("ai_monsterbar_title");
        this.info.addEventListener(MouseEvent.MOUSE_OVER, this.infoOver.bind(this));
        this.info.addEventListener(MouseEvent.MOUSE_OUT, this.infoOut.bind(this));
        this.info.tA.htmlText = "<b>" + KEYS.Get("ai_monsterbar_sendnow_btn") + "</b>";
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
        WMATTACK.Attack();
    }
}
