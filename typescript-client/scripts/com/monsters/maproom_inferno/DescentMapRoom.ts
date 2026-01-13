import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { DescentLayer } from "./views/DescentLayer";
import { DescentView } from "./views/DescentView";
import { MiniMap } from "./views/MiniMap";
import { Obstruction } from "./views/Obstruction";
import { PushPin } from "./views/PushPin";
import { MapRoomPopup_InfernoDescent } from "../../../MapRoomPopup_InfernoDescent";

import { GLOBAL } from "../../../GLOBAL";
import { SOUNDS } from "../../../SOUNDS";

/**
 * Descent map room - inferno descent map room popup.
 */
export class DescentMapRoom extends MapRoomPopup_InfernoDescent {
    public static top: Sprite | null = null;
    public static _useMailBoxForTruces: boolean = true;
    public static currentView: MovieClip | null = null;
    public static BRIDGE: Record<string, any> = {};

    public players: DescentLayer | null = null;
    public miniMap: MiniMap | null = null;
    public dv: DescentView | null = null;
    private firstRun: boolean = true;
    public _tutorialModeThresh: number = 130;

    constructor() {
        super();
    }

    public init(bridge: Record<string, any>): void {
        DescentMapRoom.BRIDGE = bridge;
        this.Setup();
        this.players!.Get();
    }

    public Setup(): void {
        this.x = GLOBAL._SCREENCENTER.x;
        this.y = GLOBAL._SCREENCENTER.y + 20;
        DescentMapRoom.top = new Sprite();
        DescentMapRoom.top.addChild(this.bReturn);
        this.addChild(DescentMapRoom.top);
        this.players = new DescentLayer();
        if (DescentMapRoom.BRIDGE.TUTORIAL._stage < this._tutorialModeThresh) {
            this.players._wmbToDisplay = 1;
            this.players._playersLimit = 0;
        }
        this.players.addEventListener(Event.COMPLETE, this.onPlayersFirstLoad.bind(this));
        this.bReturn.SetupKey("btn_returnhome");
        this.bReturn.addEventListener(MouseEvent.MOUSE_DOWN, this.rtBtnDown.bind(this));
        this.dv = DescentView.getInstance();
        this.dv.players = this.players;
        this.dv.Setup();
        PushPin.Setup();
    }

    private onPlayersFirstLoad(event: Event): void {
        if (DescentMapRoom.BRIDGE) {
            DescentMapRoom.BRIDGE.readyFunction();
        }
        this.players!.removeEventListener(Event.COMPLETE, this.onPlayersFirstLoad.bind(this));
        if (DescentMapRoom.BRIDGE.scrollToBaseID !== 0) {
            this.mvBtnDown();
            this.dv!.scrollToBaseId(DescentMapRoom.BRIDGE.scrollToBaseID);
        } else {
            const viewIndex: number = DescentMapRoom.BRIDGE.TUTORIAL._stage <= this._tutorialModeThresh ? 0 : DescentMapRoom.BRIDGE._lastView;
            const viewFunctions: Array<Function> = [this.mvBtnDown.bind(this), this.lvBtnDown.bind(this)];
            viewFunctions[viewIndex]();
        }
    }

    private mvBtnDown(event: MouseEvent | null = null): void {
        this.setView(this.dv!);
    }

    private lvBtnDown(event: MouseEvent | null = null): void {
        // List view
    }

    private rtBtnDown(event: MouseEvent | null = null): void {
        this.Hide();
    }

    public setView(view: MovieClip): void {
        if (!this.firstRun) {
            SOUNDS.Play("click1");
        }
        if (Boolean(DescentMapRoom.currentView) && Boolean(DescentMapRoom.currentView!.parent)) {
            DescentMapRoom.currentView!.parent.removeChild(DescentMapRoom.currentView!);
            DescentMapRoom.currentView = null;
        }
        DescentMapRoom.currentView = view;
        this.mcImage.addChild(DescentMapRoom.currentView);
        if (DescentMapRoom.currentView === this.dv) {
            this.dv!.onAdd();
        }
        this.setChildIndex(DescentMapRoom.top!, this.numChildren - 1);
        const viewType: number = view === this.dv ? 0 : 1;
        DescentMapRoom.BRIDGE.setLastView(viewType);
        this.firstRun = false;
    }

    public Tick(): void {
        this.players!.Tick();
    }

    public Get(): void {
        this.players!.Get();
    }

    public Hide(...rest: any[]): void {
        if (DescentMapRoom.BRIDGE.Hide) {
            Obstruction.Clear();
            this.dv!.Clear();
            this.players = null;
            DescentMapRoom.BRIDGE.Hide();
            DescentMapRoom.BRIDGE = null!;
        }
    }

    public Resize(): void {
        this.x = GLOBAL._SCREENCENTER.x;
        this.y = GLOBAL._SCREENCENTER.y + 20;
    }
}
