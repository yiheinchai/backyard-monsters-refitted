import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import { TweenLite } from "gs/TweenLite";

import { ListView_CLIP } from "../../maproom/views/ListView_CLIP";
import { DescentMapRoom } from "../DescentMapRoom";
import { MapRoom } from "../MapRoom";
import { PlayerLayer } from "../PlayerLayer";
import { BaseObject } from "../model/BaseObject";
import { ListViewArrow } from "./ListViewArrow";
import { ListViewItem } from "./ListViewItem";
import { WMListViewItem } from "./WMListViewItem";

import { MAPROOM_DESCENT } from "../../../../MAPROOM_DESCENT";
import { MAPROOM_INFERNO } from "../../../../MAPROOM_INFERNO";

// Lazy imports to break circular dependency chains
function getSOUNDS(): any { return require("../../../../SOUNDS").SOUNDS; }


/**
 * ListView - paginated list view of bases in the Inferno map room.
 */
export class ListView extends ListView_CLIP {
    public players: PlayerLayer | null = null;
    public rows: Array<any> = [];
    private gotFirstData: boolean = false;
    private shell: Sprite | null = null;
    public bNext: ListViewArrow | null = null;
    public bPrevious: ListViewArrow | null = null;
    private currentSort: string = "";
    private sortedData: Array<any> = [];
    private reversed: boolean = false;
    private currentPage: number = 0;
    private pageLimit: number = 0;
    private currentSorter: MovieClip | null = null;
    private rowsPerPage: number = 7;
    private btns: Array<MovieClip> = [];
    private _BRIDGE: any = null;

    constructor() {
        super();
        this.btns = [this.levelBtn, this.lastSeenBtn, this.nameBtn, this.winBtn, this.statusBtn];
        for (const btn of this.btns) {
            btn.addEventListener(MouseEvent.MOUSE_DOWN, this.sortHandler.bind(this));
            btn.mouseChildren = false;
            btn.useHandCursor = true;
            btn.buttonMode = true;
        }
        this.bPrevious = new ListViewArrow();
        this.bPrevious.rotation = 180;
        this.bPrevious.x = -20;
        this.bPrevious.y = 190;
        this.bPrevious.Trigger();
        this.addChild(this.bPrevious);
        this.bNext = new ListViewArrow();
        this.bNext.x = 720;
        this.bNext.y = 190;
        this.bNext.Trigger();
        this.addChild(this.bNext);
        this.bNext.visible = this.bPrevious.visible = false;
        this.bPrevious.buttonMode = this.bNext.buttonMode = true;
    }

    public Setup(): void {
        this.players!.addEventListener(Event.COMPLETE, this.onPlayersLoad.bind(this));
        this.addEventListener(Event.ADDED_TO_STAGE, this.onAdd.bind(this));
        this.rows = [];
        this.shell = new Sprite();
        this.shell.mask = this.mask_mc;
        this.addChild(this.shell);
        const sortBtns = [this.levelBtn, this.lastSeenBtn, this.statusBtn, this.nameBtn, this.winBtn];
        for (const btn of sortBtns) {
            (btn as any).sorter_mc.gotoAndStop(1);
        }
        this.setChildIndex(this.bPrevious!, this.numChildren - 1);
        this.setChildIndex(this.bNext!, this.numChildren - 1);
        if (MAPROOM_DESCENT._open) {
            if (DescentMapRoom.BRIDGE) {
                this._BRIDGE = DescentMapRoom.BRIDGE;
            }
        } else if (MAPROOM_INFERNO._open) {
            if (MapRoom.BRIDGE) {
                this._BRIDGE = MapRoom.BRIDGE;
            }
        }
    }

    public Clear(): void {
        this.players = null;
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i].parent) {
                this.rows[i].parent.removeChild(this.rows[i]);
            }
        }
        if (Boolean(this.shell) && Boolean(this.shell!.parent)) {
            this.shell!.parent.removeChild(this.shell!);
        }
        this.shell = null;
        this.rows = [];
    }

    private onAdd(event: Event): void {
    }

    private onPlayersLoad(event: Event): void {
        if (!this.gotFirstData) {
            for (const baseData of this.players!.baseData) {
                const item = baseData.wm.Get() === 1 ? new WMListViewItem() : new ListViewItem();
                item.Setup(baseData);
                this.rows.push(item);
            }
            this.gotFirstData = true;
            this.btns[this._BRIDGE._lastSort].dispatchEvent(new MouseEvent(MouseEvent.MOUSE_DOWN));
            if (this._BRIDGE._lastSortReversed === 1) {
                this.btns[this._BRIDGE._lastSort].dispatchEvent(new MouseEvent(MouseEvent.MOUSE_DOWN));
            }
            if (this.players!.baseData.length > 7) {
                this.bNext!.addEventListener(MouseEvent.MOUSE_DOWN, this.nextDown.bind(this));
                this.bPrevious!.addEventListener(MouseEvent.MOUSE_DOWN, this.prevDown.bind(this));
                this.pageLimit = Math.floor((this.players!.baseData.length - 1) / 7);
                this.bNext!.visible = true;
                this.bPrevious!.visible = true;
            }
            this.displayArray(this.rows);
            this.scrollToPage(0);
        } else {
            this.displayArray(this.rows);
        }
    }

    private nextDown(event: MouseEvent): void {
        getSOUNDS().Play("click1");
        if (this.currentPage < this.pageLimit) {
            this.scrollToPage(this.currentPage + 1);
        }
    }

    private prevDown(event: MouseEvent): void {
        getSOUNDS().Play("click1");
        if (this.currentPage > 0) {
            this.scrollToPage(this.currentPage - 1);
        }
    }

    public scrollToPage(page: number = 0): void {
        this.currentPage = page;
        TweenLite.to(this.shell, 0.3, { "x": -page * this.mask_mc.width });
        if (this.currentPage > 0) {
            this.bPrevious!.Trigger(true);
        } else {
            this.bPrevious!.Trigger(false);
        }
        if (this.currentPage < this.pageLimit) {
            this.bNext!.Trigger(true);
        } else {
            this.bNext!.Trigger(false);
        }
        const startIdx = this.currentPage * this.rowsPerPage;
        const endIdx = (this.currentPage + 1) * this.rowsPerPage > this.rows.length ? this.rows.length : (this.currentPage + 1) * this.rowsPerPage;
        for (let i = startIdx; i < endIdx; i++) {
            this.rows[i].Display();
        }
    }

    private displayArray(arr: Array<any>): void {
        this.cleanup();
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            this.shell!.addChild(item);
            item.x = 8 + this.mask_mc.width * Math.floor(i / this.rowsPerPage);
            item.y = 26 + (i * 50 - 50 * this.rowsPerPage * Math.floor(i / this.rowsPerPage));
        }
    }

    private sortHandler(event: MouseEvent): void {
        if (this.currentSorter) {
            (this.currentSorter as any).sorter_mc.gotoAndStop(1);
            this.currentSorter.gotoAndStop(1);
        }
        let sortField = "";
        switch (event.target) {
            case this.nameBtn:
                sortField = "ownerName";
                break;
            case this.lastSeenBtn:
                sortField = "online";
                break;
            case this.winBtn:
                sortField = "attackStarPoints";
                break;
            case this.statusBtn:
                sortField = "status";
                break;
            case this.levelBtn:
                sortField = "level";
        }
        const isString = sortField === "ownerName" || sortField === "status";
        if (this.currentSort === sortField) {
            this.reversed = !this.reversed;
        } else {
            this.reversed = false;
        }
        // Custom sort implementation
        this.sortedData = [...this.rows].sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            if (isString) {
                valA = String(valA).toLowerCase();
                valB = String(valB).toLowerCase();
            }
            let result = 0;
            if (valA < valB) result = -1;
            else if (valA > valB) result = 1;
            if (!isString && !this.reversed) result = -result;
            if (isString && this.reversed) result = -result;
            return result;
        });
        if (this.reversed) {
            (event.target as any).sorter_mc.gotoAndStop(3);
        } else {
            (event.target as any).sorter_mc.gotoAndStop(2);
        }
        this.currentSort = sortField;
        this.currentSorter = event.target as MovieClip;
        this.currentSorter.gotoAndStop(2);
        this.displayArray(this.sortedData);
        this.scrollToPage(0);
        for (let i = 0; i < this.btns.length; i++) {
            if (event.target === this.btns[i]) {
                this._BRIDGE.setLastSort(i);
                break;
            }
        }
        this._BRIDGE.setLastSortReversed(this.reversed ? 1 : 0);
    }

    private cleanup(): void {
        const children = [];
        for (let i = 0; i < this.shell!.numChildren; i++) {
            children.push(this.shell!.getChildAt(i));
        }
        for (const child of children) {
            child.parent.removeChild(child);
        }
    }
}
