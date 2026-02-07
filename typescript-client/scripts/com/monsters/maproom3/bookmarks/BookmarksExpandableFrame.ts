import Sprite from "openfl/display/Sprite";
import MouseEvent from "openfl/events/MouseEvent";

import { MapRoom3ExpandableFrame } from "../../../../MapRoom3ExpandableFrame";

import { TweenLite } from "gs/TweenLite";

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("../../../../BASE").BASE; }


/**
 * Bookmarks expandable frame - collapsible/expandable frame for bookmarks.
 */
export class BookmarksExpandableFrame extends MapRoom3ExpandableFrame {
    private readonly EXPAND_TWEEN_TIME: number = 0.5;
    private m_Contents: Sprite | null;
    private m_MaxExpandedHeight: number;
    private m_ExpandUp: boolean = false;
    private m_Expanded: boolean = true;

    constructor(contents: Sprite, headerLabel: string, maxHeight: number = -1, expandUp: boolean = false) {
        super();
        this.headerText.htmlText = headerLabel;
        this.headerText.mouseEnabled = false;
        this.m_Contents = contents;
        this.contentsContainer.addChild(this.m_Contents);
        this.contentsContainer.mask = this.background;
        this.m_MaxExpandedHeight = maxHeight !== -1 ? maxHeight : this.m_Contents.height;
        this.m_ExpandUp = expandUp;
        if (this.m_ExpandUp === true) {
            this.y -= this.m_MaxExpandedHeight + this.frameFooter.height;
        }
        const frameStyle: number = getBASE().isInfernoMainYardOrOutpost ? 2 : 1;
        this.frameHeader.gotoAndStop(frameStyle);
        this.frameBorders.gotoAndStop(frameStyle);
        this.frameFooter.gotoAndStop(frameStyle);
        this.frameBorders.mouseEnabled = false;
        this.frameBorders.mouseChildren = false;
        this.Collapse(false);
        this.collapseExpandButton.visible = this.m_MaxExpandedHeight > 0;
        this.collapseExpandButton.buttonMode = true;
        this.collapseExpandButton.addEventListener(MouseEvent.CLICK, this.OnCollapseExpandButtonClicked.bind(this), false, 0, true);
    }

    public Clear(): void {
        this.collapseExpandButton.removeEventListener(MouseEvent.CLICK, this.OnCollapseExpandButtonClicked.bind(this));
        this.contentsContainer.removeChild(this.m_Contents!);
        this.m_Contents = null;
    }

    private OnCollapseExpandButtonClicked(event: MouseEvent): void {
        if (this.m_Expanded) {
            this.Collapse();
        } else {
            this.Expand();
        }
    }

    private Expand(animate: boolean = true): void {
        if (this.m_Expanded === true) {
            return;
        }
        if (this.m_ExpandUp) {
            this.ExpandUp(animate);
        } else {
            this.ExpandDown(animate);
        }
        this.collapseExpandButton.gotoAndStop(2);
        this.m_Expanded = true;
    }

    private Collapse(animate: boolean = true): void {
        if (this.m_Expanded === false) {
            return;
        }
        if (this.m_ExpandUp) {
            this.CollapseDown(animate);
        } else {
            this.CollapseUp(animate);
        }
        this.collapseExpandButton.gotoAndStop(1);
        this.m_Expanded = false;
    }

    private ExpandDown(animate: boolean = true): void {
        const duration: number = animate ? this.EXPAND_TWEEN_TIME : 0;
        const footerY: number = this.frameHeader.y + this.frameHeader.height + this.m_MaxExpandedHeight;
        TweenLite.to(this.background, duration, { "height": this.m_MaxExpandedHeight });
        TweenLite.to(this.frameBorders, duration, { "height": this.m_MaxExpandedHeight });
        TweenLite.to(this.frameFooter, duration, { "y": footerY });
    }

    private CollapseUp(animate: boolean = true): void {
        const duration: number = animate ? this.EXPAND_TWEEN_TIME : 0;
        const footerY: number = this.frameHeader.y + this.frameHeader.height - this.frameFooter.height;
        TweenLite.to(this.background, duration, { "height": 0 });
        TweenLite.to(this.frameBorders, duration, { "height": 0 });
        TweenLite.to(this.frameFooter, duration, { "y": footerY });
    }

    private ExpandUp(animate: boolean = true): void {
        const duration: number = animate ? this.EXPAND_TWEEN_TIME : 0;
        TweenLite.to(this, duration, { "y": this.y - (this.m_MaxExpandedHeight + this.frameFooter.height) });
        this.ExpandDown(animate);
    }

    private CollapseDown(animate: boolean = true): void {
        const duration: number = animate ? this.EXPAND_TWEEN_TIME : 0;
        TweenLite.to(this, duration, { "y": this.y + (this.m_MaxExpandedHeight + this.frameFooter.height) });
        this.CollapseUp(animate);
    }
}
