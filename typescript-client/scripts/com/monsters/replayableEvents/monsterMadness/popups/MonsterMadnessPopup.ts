import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Event from "openfl/events/Event";

import { ImageCache } from "../../../display/ImageCache";
import { MapRoomManager } from "../../../maproom_manager/MapRoomManager";
import { MonsterMadness } from "../../attacking/monsterMadness/MonsterMadness";
import { MonsterMadnessPopupInfo } from "./MonsterMadnessPopupInfo";
import { MonsterMadnessPopupInfoSet1 } from "./MonsterMadnessPopupInfoSet1";
import { MonsterMadnessPopupInfoSet2 } from "./MonsterMadnessPopupInfoSet2";
import { MonsterMadnessPopupInfoSet3 } from "./MonsterMadnessPopupInfoSet3";
import { MonsterMadnessPopupInfoSet4 } from "./MonsterMadnessPopupInfoSet4";
import { MonsterMadnessPopupInfoGoal1 } from "./MonsterMadnessPopupInfoGoal1";
import { MonsterMadnessPopupInfoGoal1Complete } from "./MonsterMadnessPopupInfoGoal1Complete";
import { MonsterMadnessPopupInfoGoal2 } from "./MonsterMadnessPopupInfoGoal2";
import { MonsterMadnessPopupInfoGoal2Complete } from "./MonsterMadnessPopupInfoGoal2Complete";
import { MonsterMadnessPopupInfoGoal3 } from "./MonsterMadnessPopupInfoGoal3";
import { MonsterMadnessPopupInfoGoal3Complete } from "./MonsterMadnessPopupInfoGoal3Complete";
import { MonsterMadnessPopupInfoEventComplete } from "./MonsterMadnessPopupInfoEventComplete";
import { MonsterMadnessPopup_CLIP } from "../../../../../MonsterMadnessPopup_CLIP";

import { GLOBAL } from "../../../../../GLOBAL";
import { KEYS } from "../../../../../KEYS";
import { CREATURES } from "../../../../../CREATURES";
import { CHAMPIONCAGE } from "../../../../../CHAMPIONCAGE";
import { MAPROOM_DESCENT } from "../../../../../MAPROOM_DESCENT";
import { UI2 } from "../../../../../UI2";

/**
 * Monster Madness popup - main event popup displaying goals and progress.
 */
export class MonsterMadnessPopup extends MonsterMadnessPopup_CLIP {
    public static readonly MR2_AND_INFERNO: number = 1;
    public static readonly MR2: number = 2;
    public static readonly INFERNO: number = 3;
    public static readonly TOWNHALL_GREATER_THAN_5: number = 4;
    public static readonly TOWNHALL_LESS_THAN_5: number = 5;
    public static readonly _MEDIA_DIMENTIONS_X: number = 200;
    public static readonly _MEDIA_DIMENTIONS_Y: number = 200;

    private static readonly _infoSets: Array<MonsterMadnessPopupInfo> = [
        new MonsterMadnessPopupInfoSet1(),
        new MonsterMadnessPopupInfoSet2(),
        new MonsterMadnessPopupInfoSet3(),
        new MonsterMadnessPopupInfoSet4(),
        new MonsterMadnessPopupInfoGoal1(),
        new MonsterMadnessPopupInfoGoal1Complete(),
        new MonsterMadnessPopupInfoGoal2(),
        new MonsterMadnessPopupInfoGoal2Complete(),
        new MonsterMadnessPopupInfoGoal3(),
        new MonsterMadnessPopupInfoGoal3Complete(),
        new MonsterMadnessPopupInfoEventComplete()
    ];

    public infoIndex: number = 0;

    constructor() {
        super();
        const userState: number = this.getUserState();
        const infoSet: MonsterMadnessPopupInfo = MonsterMadnessPopup._infoSets[MonsterMadnessPopup.getSetIndex()];
        this.infoIndex = MonsterMadnessPopup._infoSets.indexOf(infoSet);
        ImageCache.GetImageWithCallBack(infoSet.getBanner(userState), this.onImageLoad.bind(this), true, 4, "", [this.mcImage]);
        let guardianName: string = "";
        if (CREATURES._guardian) {
            guardianName = String(CHAMPIONCAGE._guardians["G" + CREATURES._guardian._type].name);
        }
        this.tCopy.htmlText = KEYS.Get(infoSet.getCopy(userState), {
            "v1": guardianName,
            "v2": guardianName
        });
        infoSet.addEventListener(MonsterMadnessPopupInfo.REMOVE_LOADING_CIRCLE, this.onRemoveLoadingCircle.bind(this), false, 0, true);
        infoSet.setupButton(this.bAction, userState);
        infoSet.setupButton2(this.bAction2, userState);
        this.mcVideo.addChild(infoSet.getMedia(userState));
        UI2.DebugWarningEdit("MM Userstate: " + userState);
    }

    public static getSetIndex(): number {
        let setIndex: number = 0;
        const dateIndex: number = MonsterMadness.EVENT_DATES.indexOf(MonsterMadness.activeDate);
        if (MonsterMadness.hasEventStarted || Boolean(MonsterMadness.points)) {
            const points: number = MonsterMadness.points;
            if (points >= MonsterMadness.POINTS_GOAL3) {
                setIndex = 9;
            } else if (points >= MonsterMadness.POINTS_GOAL2) {
                setIndex = 7;
            } else if (points >= MonsterMadness.POINTS_GOAL1) {
                setIndex = 5;
            } else {
                setIndex = 4;
            }
            const lastPopupIndex: number = GLOBAL.StatGet(MonsterMadness.LAST_POPUP_INDEX);
            if (setIndex <= lastPopupIndex && MonsterMadnessPopup._infoSets[setIndex].isOnlySeenOnce) {
                setIndex++;
            }
            return setIndex;
        }
        const currentTime: number = MonsterMadness.currentTime;
        for (let i = dateIndex; i >= 0; i--) {
            if (currentTime >= MonsterMadness.EVENT_DATES[i].getUTCSeconds()) {
                return i;
            }
        }
        return 0;
    }

    protected onRemoveLoadingCircle(event: Event): void {
        if (this.mcLoading && this.mcLoading.parent && this.mcLoading.parent === this) {
            this.removeChild(this.mcLoading);
        }
    }

    private onImageLoad(url: string, bitmapData: BitmapData, args: Array<any> = []): void {
        (args[0] as MovieClip).addChild(new Bitmap(bitmapData));
    }

    private getUserState(): number {
        if (MapRoomManager.instance.isInMapRoom2 && MAPROOM_DESCENT.DescentPassed) {
            return MonsterMadnessPopup.MR2_AND_INFERNO;
        }
        if (MapRoomManager.instance.isInMapRoom2) {
            return MonsterMadnessPopup.MR2;
        }
        if (MAPROOM_DESCENT.DescentPassed) {
            return MonsterMadnessPopup.INFERNO;
        }
        if (Boolean(GLOBAL.townHall) && GLOBAL.townHall._lvl.Get() >= 5) {
            return MonsterMadnessPopup.TOWNHALL_GREATER_THAN_5;
        }
        return MonsterMadnessPopup.TOWNHALL_LESS_THAN_5;
    }
}
