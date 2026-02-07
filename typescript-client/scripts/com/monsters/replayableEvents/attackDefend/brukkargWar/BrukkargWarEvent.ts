import { TRIBES } from "../../../ai/TRIBES";
import { Message } from "../../../frontPage/messages/Message";
import { IReplayableEventUI } from "../../IReplayableEventUI";
import { MultiRewardReplayableEventUI } from "../../MultiRewardReplayableEventUI";
import { ReplayableEventHandler } from "../../ReplayableEventHandler";
import { ReplayableEventQuota } from "../../ReplayableEventQuota";
import { ReplayableEventUI } from "../../ReplayableEventUI";
import { AttackDefend } from "../AttackDefend";
import { BrukkargWarPromoMessage1 } from "../../../frontPage/messages/events/brukkargWar/BrukkargWarPromoMessage1";
import { BrukkargWarPromoMessage2 } from "../../../frontPage/messages/events/brukkargWar/BrukkargWarPromoMessage2";
import { BrukkargWarPromoMessage3 } from "../../../frontPage/messages/events/brukkargWar/BrukkargWarPromoMessage3";
import { BrukkargWarStartMessage } from "../../../frontPage/messages/events/brukkargWar/BrukkargWarStartMessage";
import { BrukkargWarEndMessage } from "../../../frontPage/messages/events/brukkargWar/BrukkargWarEndMessage";
import { BrukkargWarRewardMessage } from "../../../frontPage/messages/events/brukkargWar/BrukkargWarRewardMessage";
import { BrukkargWarFinalAttackMessage } from "./messages/BrukkargWarFinalAttackMessage";
import { BrukkargWarFirstAttackMessage } from "./messages/BrukkargWarFirstAttackMessage";
import { SpurtzCannonQuota1 } from "./quotas/SpurtzCannonQuota1";
import { SpurtzCannonQuota2 } from "./quotas/SpurtzCannonQuota2";
import { SpurtzCannonQuota3 } from "./quotas/SpurtzCannonQuota3";
import { WaveObj } from "../../monsterInvasion/WaveObj";

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../../../KEYS").KEYS; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Brukkarg War event - attack/defend event with waves and base attacks.
 */
export class BrukkargWarEvent extends AttackDefend {
    private static readonly WAVES: Array<any> = [
        // Wave configuration - complex nested array of WaveObj instances
        // Simplified for TypeScript - would need full WaveObj conversion
    ];

    private readonly _BUILDING_REWARD_ID: string = "C17";
    private readonly _WAVES_TOTAL: number = 25;

    constructor() {
        super(25);
        this._name = "Brukkarg War";
        this._progress = -1;
        this._priority = 500;
        this._id = 5;
        this._yardsToDestroy = 5;
        this._wavesTotal = this._WAVES_TOTAL;
        this._wavesBeforeAttack = 5;
        this._maxWaves = 25;
        this._titleImage = "events/brukkargWar/brukkarg_countdown_title_v2.png";
        this._imageURL = "events/brukkargWar/brukkarg_countdown_image_v2.png";
        this._messages = [
            new BrukkargWarPromoMessage1(),
            new BrukkargWarPromoMessage2(),
            new BrukkargWarPromoMessage3(),
            new BrukkargWarStartMessage(),
            new BrukkargWarEndMessage()
        ];
        this._rewardMessage = new BrukkargWarRewardMessage();
        this._duration = 432000;
        this._originalStartDate = 1342724400;
        this.m_mustBeInsideBase = true;
        this._quotas.push(new SpurtzCannonQuota1());
        this._quotas.push(new SpurtzCannonQuota2());
        this._quotas.push(new SpurtzCannonQuota3());
        this._quotas.push(new ReplayableEventQuota(AttackDefend.SCORE_PER_WAVE * 5, null, null, new BrukkargWarFirstAttackMessage()));
        this._quotas.push(new ReplayableEventQuota(AttackDefend.SCORE_PER_YARD * 4 + AttackDefend.SCORE_PER_WAVE * 25, null, null, new BrukkargWarFinalAttackMessage()));
    }

    public override set score(value: number) {
        super.score = value;
        if (this._score === 4025 && this._intactBaseList && this._intactBaseList.length < 5) {
            ReplayableEventHandler.callServerMethod("copybase", [["eventid", 5]], this.copyBaseCallback.bind(this));
        }
    }

    public override get imageURL(): string {
        return this.hasEventStarted ? "events/brukkargWar/brukkarg_running_image.png" : this._imageURL;
    }

    public override get titleImage(): string {
        return this.hasEventStarted ? "events/brukkargWar/brukkarg_logo.png" : this._titleImage;
    }

    public override get buttonCopy(): string {
        if (this.readyToAttackNextYard()) {
            this._buttonCopy = getKEYS().Get("btn_attack");
        } else {
            this._buttonCopy = getKEYS().Get("btn_next");
        }
        return this._buttonCopy;
    }

    public override createNewUI(): IReplayableEventUI {
        if (this.hasEventStarted) {
            return new MultiRewardReplayableEventUI();
        }
        return new ReplayableEventUI();
    }

    protected override onInitialize(): void {
        super.onInitialize();
    }

    public override pressedActionButton(): void {
        super.pressedActionButton();
    }

    protected override setupNextWave(): void {
        super.setupNextWave();
        if (this._score >= 4024) {
            ReplayableEventHandler.callServerMethod("copybase", [["eventid", 5]], this.copyBaseCallback.bind(this));
        }
    }

    protected copyBaseCallback(data: Record<string, any>): void {
        if ((typeof data.baseid === "number") && this._intactBaseList.length < 5) {
            this._intactBaseList.push({
                "id": data.baseid,
                "destroyed": false,
                "level": 0
            });
            TRIBES.B_IDS.push(data.baseid);
            getBASE().addEventBaseException(data.baseid);
        }
    }

    protected override getWaveArray(): Array<any> {
        return BrukkargWarEvent.WAVES;
    }

    public override doesQualify(): boolean {
        return false;
    }

    protected override loadedBaseList(data: Record<string, any>): void {
        super.loadedBaseList(data);
        if (this._score === 4025 && this._intactBaseList.length < 5) {
            ReplayableEventHandler.callServerMethod("copybase", [["eventid", 5]], this.copyBaseCallback.bind(this));
        }
    }
}
