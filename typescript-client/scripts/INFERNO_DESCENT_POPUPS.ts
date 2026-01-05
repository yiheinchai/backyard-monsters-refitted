
import { POPUPS } from './POPUPS';
import { KEYS } from './KEYS';
import { GLOBAL } from './GLOBAL';
import { LOGGER } from './LOGGER';
import { INFERNOPORTAL } from './INFERNOPORTAL';
import { BASE } from './BASE';
import { EnumYardType } from './com/monsters/enums/EnumYardType'; // Stub needed
import { MapRoomManager } from './MapRoomManager';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { WMBASE } from './WMBASE';

import MovieClip from 'openfl/display/MovieClip';
import Point from 'openfl/geom/Point';
import MouseEvent from 'openfl/events/MouseEvent';
import TextField from 'openfl/text/TextField';
import { popup_infernodescent_battle_report } from './popup_infernodescent_battle_report'; // Stub needed
import { popup_infernoentice_CLIP } from './popup_infernoentice_CLIP'; // Stub needed
import { popup_infernoemerge_dialog } from './popup_infernoemerge_dialog'; // Stub needed
import { popup_dialogue } from './popup_dialogue'; // Stub needed

export class INFERNO_DESCENT_POPUPS {
    private static readonly _MOLOCH_PORTRAIT_GLOAT: string = "portrait_muloch_gloat.png";
    private static readonly _MOLOCH_PORTRAIT_WHIMPER: string = "portrait_muloch_whimper.png";
    private static readonly _MOLOCH_PORTRAIT_NEUTRAL: string = "portrait_moloch.png";
    private static readonly _PORTRAIT_IMAGE_OFFSET: Point = new Point(-75, 50);
    private static _level: number;

    constructor() {}

    public static ShowTauntDialog(param1: number): void {
        let _loc2_: any = POPUPS.DisplayDialogue("", KEYS.Get("descent_moloch_taunt" + param1), KEYS.Get("taunt_player_response" + param1), INFERNO_DESCENT_POPUPS._MOLOCH_PORTRAIT_NEUTRAL, INFERNO_DESCENT_POPUPS._PORTRAIT_IMAGE_OFFSET, POPUPS.Next);
        INFERNO_DESCENT_POPUPS.FormatTextFieldForDialog(_loc2_.tBody);
    }

    public static ShowPostAttackPopup(param1: number, param2: boolean, param3: number[], param4: number[]): void {
        INFERNO_DESCENT_POPUPS._level = param1;
        let _loc6_: number[] = INFERNO_DESCENT_POPUPS.UpdateTotalLoot(param3, param4);
        if (param2) {
            INFERNO_DESCENT_POPUPS.ShowWhimperDialog(param1);
             INFERNO_DESCENT_POPUPS.ShowBattleReport(param1, param3, _loc6_);
             if(param1 >= MAPROOM_DESCENT._descentLvlMax - 1) {
                 INFERNO_DESCENT_POPUPS.ShowCapturePopup();
             }
             LOGGER.Stat([87, param1, "Victory"]);
        } else {
            INFERNO_DESCENT_POPUPS.ShowGloatDialog(param1);
            LOGGER.Stat([87, param1, "Defeat"]);
        }
    }

    public static ShowEnticePopup(): void {
        let CloseAndEnter = (param1: MouseEvent): void => {
            POPUPS.Next();
            GLOBAL.StatSet("p_id", 1);
            INFERNOPORTAL.EnterPortal();
        };
        let entice: any = new popup_infernoentice_CLIP();
        entice.tDesc.htmlText = KEYS.Get("entercavern_direct_popup");
        entice.tButton.htmlText = KEYS.Get(INFERNOPORTAL.ENTER_BUTTON);
        entice.tButton.mouseEnabled = false;
        entice.bEnter.Setup(" ");
        entice.bEnter.addEventListener(MouseEvent.CLICK, CloseAndEnter);
        POPUPS.Push(entice);
    }
    
    public static ShowGloatDialog(param1: number): MovieClip {
        return INFERNO_DESCENT_POPUPS.ShowAttackEndDialog(INFERNO_DESCENT_POPUPS._MOLOCH_PORTRAIT_GLOAT, KEYS.Get("descent_moloch_gloat" + param1), KEYS.Get("gloat_player_response" + param1));
    }

    public static ShowWhimperDialog(param1: number): MovieClip {
        return INFERNO_DESCENT_POPUPS.ShowAttackEndDialog(INFERNO_DESCENT_POPUPS._MOLOCH_PORTRAIT_WHIMPER, KEYS.Get("descent_moloch_whimper" + param1), KEYS.Get("whimper_player_response" + param1));
    }

    public static ShowBattleReport(param1: number, param2: number[], param3: number[]): void {
        let _loc4_: string = KEYS.Get("descent_battlereport", { "v1": param2[0], "v2": param2[1], "v3": param2[2], "v4": param2[3] });
        let _loc5_: InfernoBattleReportPopup = new InfernoBattleReportPopup("<b>" + KEYS.Get("pop_youlooted_title") + "</b>", _loc4_, param3);
        if (INFERNO_DESCENT_POPUPS.isBragable(param1)) {
            _loc5_.bButton.SetupKey("btn_brag");
            _loc5_.bButton.Highlight = true;
            _loc5_.bButton.addEventListener(MouseEvent.CLICK, INFERNO_DESCENT_POPUPS.BragBattleReport);
        } else {
             _loc5_.bButton.SetupKey("btn_close");
             _loc5_.bButton.addEventListener(MouseEvent.CLICK, INFERNO_DESCENT_POPUPS.CloseBattleReport);
        }
        POPUPS.Push(_loc5_, null, null, null, "portrait_moloch.png");
    }

    private static UpdateTotalLoot(param1: number[], param2: number[]): number[] {
        let _loc3_: number[] = [];
        for (let i = 0; i < param1.length; i++) {
            _loc3_[i] = param1[i] + param2[i];
        }
        return _loc3_;
    }

    private static CloseBattleReport(param1: MouseEvent): void {
         // remove listener logic
         POPUPS.Next();
    }

    private static isBragable(param1: number): boolean {
        return param1 == 1 || param1 == 4 || param1 == 7;
    }

    private static BragBattleReport(param1: MouseEvent): void {
         GLOBAL.CallJS("sendFeed", ["loot", KEYS.Get("pop_cavernwin" + INFERNO_DESCENT_POPUPS._level + "_streamtitle"), KEYS.Get("pop_cavernwin" + INFERNO_DESCENT_POPUPS._level + "_streambody"), "pop_cavernwin" + INFERNO_DESCENT_POPUPS._level + ".png"]);
         POPUPS.Next();
    }

    public static ShowCapturePopup(): void {
         let _loc1_: any = new popup_infernoemerge_dialog();
         // setup ...
         POPUPS.Push(_loc1_, null, null, "");
         // stats...
         WMBASE.DestroyAllDescent();
    }

    private static ClosedCapturePopup(param1: MouseEvent): void {
         MapRoomManager.instance.mapRoomVersion = MapRoomManager.MAP_ROOM_VERSION_1;
         BASE.LoadBase(GLOBAL._infBaseURL, 0, 0, "ibuild", false, EnumYardType.INFERNO_YARD);
    }
    
    private static ShowAttackEndDialog(param1: string, param2: string, param3: string): MovieClip {
        let _loc4_: any = POPUPS.DisplayDialogue("", param2, param3, param1, INFERNO_DESCENT_POPUPS._PORTRAIT_IMAGE_OFFSET, POPUPS.Next);
        INFERNO_DESCENT_POPUPS.FormatTextFieldForDialog(_loc4_.tBody);
        return _loc4_ as MovieClip;
    }

    private static FormatTextFieldForDialog(param1: TextField): TextField {
        param1.htmlText = "<i>" + param1.htmlText + "</i>";
        return param1;
    }
}

export class InfernoBattleReportPopup extends popup_infernodescent_battle_report {
    public bButton: any; // Stub property
    constructor(param1: string, param2: string, param3: number[]) {
        super();
        this.tTitle.htmlText = param1;
        this.tBody.htmlText = param2;
        // loop for resources logic simplified
    }
}
