import Event from "openfl/events/Event";

import { SecNum } from "../../../../cc/utils/SecNum";
import { KorathReward } from "../../looting/wotc/rewards/KorathReward";
import { MonsterMadnessPopup } from "../../monsterMadness/popups/MonsterMadnessPopup";
import { MonsterMadnessInfoBar } from "./MonsterMadnessInfoBar";
import { Reward } from "../../../rewarding/Reward";
import { RewardHandler } from "../../../rewarding/RewardHandler";
import { RewardLibrary } from "../../../rewarding/RewardLibrary";

// Lazy imports to break circular dependency chains
function getConsole(): any { return require("../../../debug/Console").Console; }
function getBASE(): any { return require("../../../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }
function getTUTORIAL(): any { return require("../../../../../TUTORIAL").TUTORIAL; }



/**
 * Monster Madness - community event tracking and management.
 */
export class MonsterMadness {
    public static readonly POINTS_GOAL1: number = 42000000;
    public static readonly POINTS_GOAL2: number = 94500000;
    public static readonly POINTS_GOAL3: number = 160125000;
    public static readonly LAST_POPUP_INDEX: string = "lastPopupIndex";
    public static readonly LAST_SCORE: string = "mmscore";
    public static readonly EVENT_DATES: Array<Date> = [
        new Date(2012, 2, 15, 12),
        new Date(2012, 2, 19, 12),
        new Date(2012, 2, 21, 12),
        new Date(2012, 2, 22, 12),
        new Date(2012, 2, 26, 12)
    ];
    public static today: Date = new Date(2012, 2, 23);
    public static infoBar: MonsterMadnessInfoBar | null = null;
    public static stage: number = 0;
    private static _points: SecNum = new SecNum(0);
    public static readonly SAVE_ID: string = "event_score";

    constructor() {
    }

    public static get points(): number {
        return MonsterMadness._points.Get();
    }

    public static set points(value: number) {
        MonsterMadness._points = new SecNum(value);
        MonsterMadness.stage = MonsterMadness.getStage();
        getGLOBAL().StatSet(MonsterMadness.LAST_SCORE, value);
    }

    public static updateKorathStats(): void {
        let powerLevel: number = 0;
        if (MonsterMadness.points >= MonsterMadness.POINTS_GOAL3) {
            powerLevel = 3;
        } else if (MonsterMadness.points >= MonsterMadness.POINTS_GOAL2) {
            powerLevel = 2;
        } else if (MonsterMadness.points >= MonsterMadness.POINTS_GOAL1) {
            powerLevel = 1;
        }
        if (powerLevel > 0) {
            MonsterMadness.setKorathPowerLevel(powerLevel);
        }
    }

    public static setKorathPowerLevel(level: number): void {
        let reward = RewardHandler.instance.getRewardByID(KorathReward.k_REWARD_ID);
        if (!reward) {
            reward = RewardLibrary.getRewardByID(KorathReward.k_REWARD_ID);
            if (!reward) {
                getConsole().warning("reward handler isnt working, you cant apply rewards here");
                return;
            }
            reward.value = level;
            RewardHandler.instance.addAndApplyReward(reward);
        } else if (level > reward.value) {
            reward.value = level;
            RewardHandler.instance.applyReward(reward);
        }
    }

    public static get hasEventStarted(): boolean {
        return MonsterMadness.currentTime > MonsterMadness.activeTime;
    }

    public static get hasEventEnded(): boolean {
        return MonsterMadness.currentTime > MonsterMadness.endTime;
    }

    public static get currentTime(): number {
        return getGLOBAL().Timestamp();
    }

    public static get timeUntilNextPhase(): number {
        let target = MonsterMadness.activeTime;
        if (MonsterMadness.currentTime > target) {
            target = MonsterMadness.endTime;
        }
        return target - MonsterMadness.currentTime;
    }

    public static get activeTime(): number {
        return 1332442800;
    }

    public static get endTime(): number {
        return 1332788400;
    }

    public static get activeDate(): Date {
        return MonsterMadness.EVENT_DATES[3];
    }

    public static get endDate(): Date {
        return MonsterMadness.EVENT_DATES[MonsterMadness.EVENT_DATES.length - 1];
    }

    private static getStage(): number {
        let stageNum: number = 0;
        if (MonsterMadness.currentTime <= MonsterMadness.endTime) {
            if (MonsterMadness.hasEventStarted) {
                if (MonsterMadness.points >= MonsterMadness.POINTS_GOAL2) {
                    stageNum = 4;
                } else if (MonsterMadness.points >= MonsterMadness.POINTS_GOAL1) {
                    stageNum = 3;
                } else {
                    stageNum = 2;
                }
            } else if (MonsterMadness.currentTime > MonsterMadness.EVENT_DATES[0].getUTCSeconds()) {
                stageNum = 1;
            }
        } else if (MonsterMadness.currentTime > MonsterMadness.endTime) {
            stageNum = 5;
        }
        return stageNum;
    }

    public static showPopup(forceShow: boolean = false): boolean {
        if (getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD) {
            return false;
        }
        if (MonsterMadness.hasNewPopupToShow() || forceShow) {
            const popup = new MonsterMadnessPopup();
            getPOPUPS().Push(popup);
            getGLOBAL().StatSet(MonsterMadness.LAST_POPUP_INDEX, popup.infoIndex);
        }
        return true;
    }

    public static initialize(): void {
        const lastScore = getGLOBAL().StatGet(MonsterMadness.LAST_SCORE);
        const loadedScore = getBASE().loadObject[MonsterMadness.SAVE_ID];
        if (loadedScore && loadedScore >= lastScore && !MonsterMadness.hasEventEnded || lastScore === -2126479027) {
            MonsterMadness.points = loadedScore;
        } else {
            MonsterMadness.points = lastScore;
        }
        if (MonsterMadness.hasEventEnded || getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD || getTUTORIAL()._stage < 200 || getGLOBAL()._sessionCount < 5) {
            return;
        }
        MonsterMadness.infoBar = new MonsterMadnessInfoBar();
        MonsterMadness.addInfoBar();
        MonsterMadness.showPopup();
    }

    private static hasNewPopupToShow(): boolean {
        return MonsterMadnessPopup.getSetIndex() > getGLOBAL().StatGet(MonsterMadness.LAST_POPUP_INDEX);
    }

    public static addInfoBar(): void {
        MonsterMadness.infoBar!.Setup();
        MonsterMadness.infoBar!.Resize();
        MonsterMadness.infoBar!.addEventListener(Event.ENTER_FRAME, MonsterMadness.updateInfoBar);
    }

    private static updateInfoBar(event: Event): void {
        MonsterMadness.infoBar!.Update();
    }

    public static removeInfoBar(): void {
        if (!MonsterMadness.infoBar) {
            return;
        }
        MonsterMadness.infoBar.removeEventListener(Event.ENTER_FRAME, MonsterMadness.updateInfoBar);
    }
}
