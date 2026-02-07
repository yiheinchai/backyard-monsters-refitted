import MouseEvent from "openfl/events/MouseEvent";

import { EnumYardType } from "../../enums/EnumYardType";
import { MapRoom3Tutorial } from "../MapRoom3Tutorial";
import { popup_outpost_secured } from "../../../../popup_outpost_secured";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getBASE(): any { return require("../../../../BASE").BASE; }
function getTUTORIAL(): any { return require("../../../../TUTORIAL").TUTORIAL; }



/**
 * Map room 3 outpost secured - popup displayed when outpost is captured.
 */
export class MapRoom3OutpostSecured extends popup_outpost_secured {
    protected m_nCellType: number;

    constructor(cellType: number, data: Record<string, any>) {
        super();
        this.setup(cellType, data);
    }

    public setup(cellType: number, data: Record<string, any>): void {
        this.m_nCellType = cellType;
        switch (this.m_nCellType) {
            case EnumYardType.RESOURCE:
                this.tfTitle.htmlText = getKEYS().Get("ro_taken_title");
                this.tfBody.htmlText = getKEYS().Get("ro_taken_desc", {
                    "v1": data.level,
                    "v2": getGLOBAL().FormatNumber(data[2] * 60),
                    "v3": getGLOBAL().FormatNumber(data[10]),
                    "v4": data[7]
                });
                break;
            case EnumYardType.STRONGHOLD:
                this.tfTitle.htmlText = getKEYS().Get("sh_taken_title");
                this.tfBody.htmlText = getKEYS().Get("sh_taken_desc", {
                    "v1": data.level,
                    "v2": data[5],
                    "v3": data[6],
                    "v4": data[7]
                });
                break;
            case EnumYardType.PLAYER:
                break;
            case EnumYardType.FORTIFICATION:
                if (data.fortified) {
                    this.tfTitle.htmlText = getKEYS().Get("opd_controlled_taken_title");
                    this.tfBody.htmlText = getKEYS().Get("opd_controled_taken_desc", { "v1": this.getAdjacentCellCopy(data.fortified) });
                } else {
                    this.tfTitle.htmlText = getKEYS().Get("opd_notcontrolled_taken_title");
                    this.tfBody.htmlText = getKEYS().Get("opd_notcontroled_taken_desc", { "v1": this.getAdjacentCellCopy(data.weakened) });
                }
                break;
        }
        if (getTUTORIAL()._stage < 120) {
            getTUTORIAL()._stage = 120;
        }
        if (getTUTORIAL()._stage > 120) {
            this.mcEnter.addEventListener(MouseEvent.CLICK, this.enterOutpost.bind(this), false, 0, true);
        }
        this.mcMap.addEventListener(MouseEvent.CLICK, this.openMap.bind(this), false, 0, true);
        if (getTUTORIAL()._stage > 120) {
            this.mcEnter.SetupKey("btn_enteroutpost");
        } else {
            this.mcEnter.visible = this.mcEnter.enabled = this.mcEnter.Enabled = false;
        }
        if (getTUTORIAL()._stage > 120) {
            this.mcMap.SetupKey("btn_openmap");
        } else {
            this.mcMap.SetupKey("btn_returnhome");
        }
        this.mcFrame.Setup(false);
    }

    private openMap(event: MouseEvent): void {
        if (getTUTORIAL()._stage > 120) {
            getGLOBAL().ShowMap();
        } else {
            MapRoom3Tutorial.instance.advance();
            getBASE().LoadBase(null, 0, 0, getGLOBAL().e_BASE_MODE.BUILD, false, EnumYardType.MAIN_YARD);
        }
    }

    private enterOutpost(event: MouseEvent): void {
        const something: number = 0;
        getBASE().LoadBase(null, 0, getBASE()._baseID, getGLOBAL().e_BASE_MODE.BUILD, false, this.m_nCellType, something);
    }

    private getAdjacentCellCopy(type: number): string {
        switch (type) {
            case EnumYardType.RESOURCE:
                return getKEYS().Get("nwm_resource");
            case EnumYardType.STRONGHOLD:
                return getKEYS().Get("nwm_stronghold");
            case EnumYardType.PLAYER:
                return getKEYS().Get("nwm_mainyard");
            default:
                return "cell";
        }
    }
}
