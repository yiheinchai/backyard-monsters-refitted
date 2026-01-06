import { MovieClip } from 'openfl/display/MovieClip';
import { Event } from 'openfl/events/Event';
import { MouseEvent } from 'openfl/events/MouseEvent';
import { TextField } from 'openfl/text/TextField';
import { Point } from 'openfl/geom/Point';
import { WMBASE } from './com/monsters/ai/WMBASE';
import { EnumYardType } from './com/monsters/enums/EnumYardType';
import { MapRoomManager } from './com/monsters/maproom_manager/MapRoomManager';
import { popup_dialogue } from './popup_dialogue';
import { popup_infernodescent_battle_report } from './popup_infernodescent_battle_report';
import { popup_infernoentice_CLIP } from './popup_infernoentice_CLIP';
import { popup_infernoemerge_dialog } from './popup_infernoemerge_dialog';
import { BASE } from './BASE';
import { GLOBAL } from './GLOBAL';
import { INFERNOPORTAL } from './INFERNOPORTAL';
import { KEYS } from './KEYS';
import { LOGGER } from './LOGGER';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { POPUPS } from './POPUPS';

class InfernoBattleReportPopup extends popup_infernodescent_battle_report {
    constructor(param1: string, param2: string, param3: number[]) {
        super();
        this.tTitle.htmlText = param1;
        this.tBody.htmlText = param2;
        for (let _loc4_ = 0; _loc4_ < param3.length; _loc4_++) {
            const _loc5_ = "mcResource" + (_loc4_ + 1);
            const _loc6_ = this.getChildByName(_loc5_) as MovieClip;
            switch (_loc4_) {
                case 0:
                    _loc6_.tTitle.htmlText = "<b>" + KEYS.Get("#r_bone#") + "</b>";
                    break;
                case 1:
                    _loc6_.tTitle.htmlText = "<b>" + KEYS.Get("#r_coal#") + "</b>";
                    break;
                case 2:
                    _loc6_.tTitle.htmlText = "<b>" + KEYS.Get("#r_sulfur#") + "</b>";
                    break;
                case 3:
                    _loc6_.tTitle.htmlText = "<b>" + KEYS.Get("#r_magma#") + "</b>";
                    break;
                case 4:
                    _loc6_.tTitle.htmlText = "<b>" + KEYS.Get("#r_shiny#") + "</b>";
                    break;
            }
            _loc6_.tValue.htmlText = "<b>" + Math.floor(param3[_loc4_]).toString() + "</b>";
            _loc6_.stop();
        }
    }
}

export class INFERNO_DESCENT_POPUPS {
    private static readonly _MOLOCH_PORTRAIT_GLOAT: string = "portrait_muloch_gloat.png";
    private static readonly _MOLOCH_PORTRAIT_WHIMPER: string = "portrait_muloch_whimper.png";
    private static readonly _MOLOCH_PORTRAIT_NEUTRAL: string = "portrait_moloch.png";
    private static readonly _TOTAL_LOOT_LABEL: string = "descentTotalLoot";
    private static readonly _PORTRAIT_IMAGE_OFFSET: Point = new Point(-75, 50);
    private static _level: number;

    constructor() {
    }

    public static ShowTauntDialog(param1: number): void {
        const _loc2_ = POPUPS.DisplayDialogue("", KEYS.Get("descent_moloch_taunt" + param1), KEYS.Get("taunt_player_response" + param1), INFERNO_DESCENT_POPUPS._MOLOCH_PORTRAIT_NEUTRAL, INFERNO_DESCENT_POPUPS._PORTRAIT_IMAGE_OFFSET, POPUPS.Next) as popup_dialogue;
        INFERNO_DESCENT_POPUPS.FormatTextFieldForDialog(_loc2_.tBody);
    }

    public static ShowPostAttackPopup(param1: number, param2: boolean, param3: number[], param4: number[]): void {
        let _loc5_: MovieClip;
        INFERNO_DESCENT_POPUPS._level = param1;
        const _loc6_ = INFERNO_DESCENT_POPUPS.UpdateTotalLoot(param3, param4);
        if (param2) {
            _loc5_ = INFERNO_DESCENT_POPUPS.ShowWhimperDialog(param1);
            INFERNO_DESCENT_POPUPS.ShowBattleReport(param1, param3, _loc6_);
            if (param1 >= MAPROOM_DESCENT._descentLvlMax - 1) {
                INFERNO_DESCENT_POPUPS.ShowCapturePopup();
            }
            LOGGER.Stat([87, param1, "Victory"]);
        } else {
            _loc5_ = INFERNO_DESCENT_POPUPS.ShowGloatDialog(param1);
            LOGGER.Stat([87, param1, "Defeat"]);
        }
    }

    public static ShowEnticePopup(): void {
        const CloseAndEnter = (param1: MouseEvent): void => {
            POPUPS.Next();
            GLOBAL.StatSet("p_id", 1);
            INFERNOPORTAL.EnterPortal();
        };
        const entice = new popup_infernoentice_CLIP();
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
        const _loc4_ = KEYS.Get("descent_battlereport", {
            "v1": param2[0],
            "v2": param2[1],
            "v3": param2[2],
            "v4": param2[3]
        });
        const _loc5_ = new InfernoBattleReportPopup("<b>" + KEYS.Get("pop_youlooted_title") + "</b>", _loc4_, param3);
        if (INFERNO_DESCENT_POPUPS.isBragable(param1)) {
            _loc5_.bButton.SetupKey("btn_brag");
            _loc5_.bButton.Highlight = true;
            _loc5_.bButton.addEventListener(MouseEvent.CLICK, INFERNO_DESCENT_POPUPS.BragBattleReport, false, 0, true);
        } else {
            _loc5_.bButton.SetupKey("btn_close");
            _loc5_.bButton.addEventListener(MouseEvent.CLICK, INFERNO_DESCENT_POPUPS.CloseBattleReport, false, 0, true);
        }
        POPUPS.Push(_loc5_, null, null, null, "portrait_moloch.png");
    }

    private static UpdateTotalLoot(param1: number[], param2: number[]): number[] {
        const _loc3_: number[] = [];
        for (let _loc4_ = 0; _loc4_ < param1.length; _loc4_++) {
            _loc3_[_loc4_] = param1[_loc4_] + param2[_loc4_];
        }
        return _loc3_;
    }

    private static CloseBattleReport(param1: MouseEvent): void {
        (param1.target as MovieClip).removeEventListener(Event.REMOVED_FROM_STAGE, INFERNO_DESCENT_POPUPS.CloseBattleReport);
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
        const _loc1_ = new popup_infernoemerge_dialog();
        _loc1_.tBody.htmlText = "<b>" + KEYS.Get("descent_pop_victory_title") + "</b><br><br>";
        _loc1_.tBody.htmlText += KEYS.Get("descent_pop_victory_body");
        _loc1_.bAction.Setup(KEYS.Get("descent_pop_victory_button"));
        _loc1_.bAction.addEventListener(MouseEvent.CLICK, INFERNO_DESCENT_POPUPS.ClosedCapturePopup);
        POPUPS.Push(_loc1_, null, null, "");
        GLOBAL.StatSet("descentLvl", MAPROOM_DESCENT._descentLvlMax);
        MAPROOM_DESCENT._descentLvl = MAPROOM_DESCENT._descentLvlMax;
        MAPROOM_DESCENT.DescentPassed;
        WMBASE.DestroyAllDescent();
    }

    private static ClosedCapturePopup(param1: MouseEvent): void {
        MapRoomManager.instance.mapRoomVersion = MapRoomManager.MAP_ROOM_VERSION_1;
        BASE.LoadBase(GLOBAL._infBaseURL, 0, 0, "ibuild", false, EnumYardType.INFERNO_YARD);
    }

    private static ShowAttackEndDialog(param1: string, param2: string, param3: string): MovieClip {
        const _loc4_ = POPUPS.DisplayDialogue("", param2, param3, param1, INFERNO_DESCENT_POPUPS._PORTRAIT_IMAGE_OFFSET, POPUPS.Next) as popup_dialogue;
        INFERNO_DESCENT_POPUPS.FormatTextFieldForDialog(_loc4_.tBody);
        return _loc4_;
    }

    private static FormatTextFieldForDialog(param1: TextField): TextField {
        param1.htmlText = "<i>" + param1.htmlText + "</i>";
        return param1;
    }

    public static isInDescent(): boolean {
        return BASE.isInfernoMainYardOrOutpost && !MAPROOM_DESCENT.DescentPassed && GLOBAL.mode == GLOBAL.e_BASE_MODE.WMATTACK;
    }
}
