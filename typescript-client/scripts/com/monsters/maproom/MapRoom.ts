import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { old_maproom } from "../../../old_maproom";
import { ListView } from "./views/ListView";
import { MapView } from "./views/MapView";
import { MiniMap } from "./MiniMap";
import { Obstruction } from "./Obstruction";
import { PlayerLayer } from "./PlayerLayer";
import { PushPin } from "./PushPin";

// Lazy imports to break circular dependency chains
function getTUTORIAL(): any { return require("../../../TUTORIAL").TUTORIAL; }



/**
 * MapRoom - main map room controller for normal mode.
 */
export class MapRoom extends old_maproom {
    public static top: Sprite;
    public static _useMailBoxForTruces: boolean = true;
    public static currentView: MovieClip | null = null;
    public static BRIDGE: Record<string, any> = {};

    public players: PlayerLayer | null = null;
    public miniMap: MiniMap | null = null;
    public mv: MapView | null = null;
    public lv: ListView | null = null;
    private firstRun: boolean = true;
    public _tutorialModeThresh: number = 130;

    constructor() {
        super();
    }

    public init(bridge: Record<string, any>): void {
        MapRoom.BRIDGE = bridge;
        this.Setup();
        this.players!.Get();
    }

    public Setup(): void {
        this.x = 0;
        this.y = 20;
        MapRoom.top = new Sprite();
        MapRoom.top.addChild(this.mvBtn);
        MapRoom.top.addChild(this.lvBtn);
        this.addChild(MapRoom.top);
        this.players = new PlayerLayer();
        if (MapRoom.BRIDGE.getTUTORIAL()._stage < this._tutorialModeThresh) {
            this.players._wmbToDisplay = 1;
            this.players._playersLimit = 0;
        }
        this.players.addEventListener(Event.COMPLETE, this.onPlayersFirstLoad.bind(this));
        this.mvBtn.SetupKey("map_map_btn");
        this.lvBtn.SetupKey("map_list_btn");
        this.mvBtn.addEventListener(MouseEvent.MOUSE_DOWN, this.mvBtnDown.bind(this));
        this.lvBtn.addEventListener(MouseEvent.MOUSE_DOWN, this.lvBtnDown.bind(this));
        this.mv = MapView.getInstance();
        this.mv.players = this.players;
        this.mv.Setup();
        this.lv = new ListView();
        this.lv.players = this.players;
        this.lv.Setup();
        PushPin.Setup();
    }

    private onPlayersFirstLoad(event: Event): void {
        if (MapRoom.BRIDGE) {
            MapRoom.BRIDGE.readyFunction();
        }
        this.players!.removeEventListener(Event.COMPLETE, this.onPlayersFirstLoad.bind(this));
        if (MapRoom.BRIDGE.scrollToBaseID !== 0) {
            this.mvBtnDown();
            this.mv!.scrollToBaseId(MapRoom.BRIDGE.scrollToBaseID);
        } else {
            const viewIndex = MapRoom.BRIDGE.getTUTORIAL()._stage <= this._tutorialModeThresh ? 0 : MapRoom.BRIDGE._lastView;
            const viewFuncs = [this.mvBtnDown.bind(this), this.lvBtnDown.bind(this)];
            viewFuncs[viewIndex]();
        }
    }

    private mvBtnDown(event: MouseEvent | null = null): void {
        this.setView(this.mv!);
        this.mvBtn.Highlight = true;
        this.lvBtn.Highlight = false;
    }

    private lvBtnDown(event: MouseEvent | null = null): void {
        if (getTUTORIAL()._stage < 110) {
            return;
        }
        this.setView(this.lv!);
        this.lvBtn.Highlight = true;
        this.mvBtn.Highlight = false;
    }

    public setView(view: MovieClip): void {
        if (!this.firstRun) {
            MapRoom.BRIDGE.SOUNDS.Play("click1");
        }
        if (Boolean(MapRoom.currentView) && Boolean(MapRoom.currentView!.parent)) {
            MapRoom.currentView!.parent.removeChild(MapRoom.currentView!);
            MapRoom.currentView = null;
        }
        MapRoom.currentView = view;
        this.mcHolder.addChild(MapRoom.currentView);
        if (MapRoom.currentView === this.mv) {
            this.mv!.onAdd();
        }
        this.setChildIndex(MapRoom.top, this.numChildren - 1);
        const viewIndex = view === this.mv ? 0 : 1;
        MapRoom.BRIDGE.setLastView(viewIndex);
        this.firstRun = false;
    }

    public Tick(): void {
        this.players!.Tick();
    }

    public Get(): void {
        this.players!.Get();
    }

    public Hide(...rest: any[]): void {
        if (MapRoom.BRIDGE.Hide) {
            Obstruction.Clear();
            this.mv!.Clear();
            this.players = null;
            this.lv!.Clear();
            const hideFunc = MapRoom.BRIDGE.Hide;
            MapRoom.BRIDGE = {};
            hideFunc();
        }
    }

    public Resize(): void {
        this.x = 0;
        this.y = 20;
    }
}
