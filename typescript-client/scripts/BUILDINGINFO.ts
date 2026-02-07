import { MapRoom3ConfirmMigrationPopup } from './com/monsters/maproom3/popups/MapRoom3ConfirmMigrationPopup';
import { MapRoom3RelocatePopup } from './com/monsters/maproom3/popups/MapRoom3RelocatePopup';
import { RADIO } from './com/monsters/radio/RADIO';
import { SiegeFactory } from './com/monsters/siege/SiegeFactory';
import { SiegeLab } from './com/monsters/siege/SiegeLab';
import MovieClip from 'openfl/display/MovieClip';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import TextField from 'openfl/text/TextField';
import TextFieldAutoSize from 'openfl/text/TextFieldAutoSize';
import { ACADEMY } from './ACADEMY';
import { HATCHERY } from './HATCHERY';
import { HATCHERYCC } from './HATCHERYCC';
import { MAPROOM } from './MAPROOM';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { MONSTERBAITER } from './MONSTERBAITER';
import { MUSHROOMS } from './MUSHROOMS';
import { SALESPECIALSPOPUP } from './SALESPECIALSPOPUP';
import { SIGNS } from './SIGNS';

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBRESOURCE(): any { return require("./BRESOURCE").BRESOURCE; }
function getBUILDING13(): any { return require("./BUILDING13").BUILDING13; }
function getBUILDING14(): any { return require("./BUILDING14").BUILDING14; }
function getBUILDINGOPTIONS(): any { return require("./BUILDINGOPTIONS").BUILDINGOPTIONS; }
function getBUY(): any { return require("./BUY").BUY; }
function getCHAMPIONCAGE(): any { return require("./CHAMPIONCAGE").CHAMPIONCAGE; }
function getCHAMPIONCHAMBER(): any { return require("./CHAMPIONCHAMBER").CHAMPIONCHAMBER; }
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getHOUSING(): any { return require("./HOUSING").HOUSING; }
function getINFERNOPORTAL(): any { return require("./INFERNOPORTAL").INFERNOPORTAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGIN(): any { return require("./LOGIN").LOGIN; }
function getMAP(): any { return require("./MAP").MAP; }
function getMONSTERLAB(): any { return require("./MONSTERLAB").MONSTERLAB; }
function getMONSTERBUNKER(): any { return require("./MONSTERBUNKER").MONSTERBUNKER; }
function getPLANNER(): any { return require("./PLANNER").PLANNER; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getSTORE(): any { return require("./STORE").STORE; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }


/**
 * BUILDINGINFO - Building Information Popup
 * Displays contextual building info and action buttons when hovering over buildings
 */
export class BUILDINGINFO {
    public static _mc: MovieClip | null = null;
    public static _buttonsMC: MovieClip | null = null;
    public static _building: BFOUNDATION | null = null;
    public static _clickPoint: Point | null = null;
    public static _props: any = null;
    private static _positionSet: boolean = false;

    constructor() {}

    public static Show(building: BFOUNDATION): void {
        if (getGLOBAL()._selectedBuilding && getGLOBAL()._selectedBuilding._moving) return;
        BUILDINGINFO._positionSet = false;
        BUILDINGINFO._building = building;
        BUILDINGINFO._props = getGLOBAL()._buildingProps[building._type - 1];
        BUILDINGINFO._mc = getMAP()._BUILDINGINFO!.addChild(new (GLOBAL as any).buildingInfoData()) as MovieClip;
        (BUILDINGINFO._mc as any).tName.autoSize = TextFieldAutoSize.CENTER;
        
        let nameText: string = "<b>" + getKEYS().Get(BUILDINGINFO._props.name) + "</b>";
        if (building._lvl.Get() > 0 && BUILDINGINFO._props.costs && BUILDINGINFO._props.costs.length > 1) {
            if (BUILDINGINFO._props.names && BUILDINGINFO._props.names.length > 1) {
                nameText = "<b>" + getKEYS().Get(BUILDINGINFO._props.names[building._lvl.Get() - 1]) + "</b>";
            } else {
                nameText += "<br><b>" + getKEYS().Get("bdg_infopop_levelnum", { v1: building._lvl.Get() }) + "</b>";
            }
            if (building._fortification.Get() > 0) {
                nameText += "<br><b>" + getKEYS().Get("bdg_fortified_level", { v1: building._fortification.Get() }) + "</b>";
            }
            if (building._class === "tower" && building._type !== 22 && getGLOBAL()._towerOverdrive && 
                getGLOBAL()._towerOverdrive.Get() >= getGLOBAL().Timestamp() && 
                building._countdownBuild.Get() === 0 && building._countdownUpgrade.Get() === 0) {
                nameText += "<font color=\"#0000ff\"> <br><b>" + getKEYS().Get("bdg_25%boost") + "</b></font>";
            }
        }
        (BUILDINGINFO._mc as any).tName.htmlText = nameText;
        BUILDINGINFO._mc!.removeEventListener(Event.ENTER_FRAME, BUILDINGINFO.Tick);
        BUILDINGINFO._mc!.addEventListener(Event.ENTER_FRAME, BUILDINGINFO.Tick);
        if (getGLOBAL()._zoomed) {
            BUILDINGINFO._mc!.scaleX = BUILDINGINFO._mc!.scaleY = 2;
        }
        BUILDINGINFO.Update();
    }

    public static Update(): void {
        if (!BUILDINGINFO._mc || !BUILDINGINFO._building) return;
        const building = BUILDINGINFO._building;
        const props = BUILDINGINFO._props;
        const buttons: any[] = [];
        let canDoMore: boolean = true;
        const isMR3Outpost: boolean = getMapRoomManager().instance.isInMapRoom3 && getBASE().isOutpost;

        // Count damaged buildings
        let damagedCount = 0;
        const instances = getInstanceManager().getInstancesByClass(getBFOUNDATION());
        for (const inst of instances) {
            if ((inst as BFOUNDATION).health < (inst as BFOUNDATION).maxHealth) damagedCount++;
        }

        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            // Handle repair, build, upgrade, fortify states
            if (building.health < building.maxHealth) {
                canDoMore = false;
                if (building._repairing === 0) {
                    buttons.push(["btn_repair", 30]);
                } else {
                    buttons.push(["btn_speedup", 30, damagedCount < 2]);
                    if (damagedCount >= 2) buttons.push(["btn_repairall", 30, true]);
                }
            } else if (building._countdownBuild.Get() > 0) {
                canDoMore = false;
                buttons.push(["btn_speedup", 30, true]);
                if (getTUTORIAL()._stage > 100 && props.type !== "decoration") {
                    buttons.push(["btn_stopbuild", 26]);
                }
            } else if (building._countdownUpgrade.Get() > 0) {
                canDoMore = false;
                buttons.push(["btn_speedup", 30, true]);
                if (getTUTORIAL()._stage > 100) buttons.push(["btn_stopupgrade", 26]);
            } else if (building._countdownFortify.Get() > 0) {
                canDoMore = false;
                buttons.push(["btn_speedup", 30, true]);
                buttons.push(["btn_stopfortify", 26]);
            } else if (props.type === "resource") {
                if (getBASE().isOutpost) {
                    buttons.push(["btn_bank_disabled", 30, 0, true]);
                } else {
                    if (getTUTORIAL()._stage !== 20 && getTUTORIAL()._stage !== 21) {
                        buttons.push(["btn_bank", 30, 0, getGLOBAL().FormatNumber(building._stored.Get())]);
                    }
                    if (getTUTORIAL()._stage >= 200) buttons.push(["btn_bankall", 30]);
                }
            }

            // Building-specific action buttons
            if (getTUTORIAL()._stage > 4 && canDoMore) {
                let isHighlight = true;
                let hasSpeedup = false;
                if (building._countdownBuild.Get() + building._countdownUpgrade.Get() + building._countdownFortify.Get() > 0 || building._repairing > 0) {
                    buttons.push(["btn_speedup", 30, true]);
                    hasSpeedup = true;
                }

                // Building-specific buttons based on ID
                if (props.id === 8) {
                    buttons.push([getBASE().isInfernoMainYardOrOutpost ? "btn_openstrongbox" : "btn_openlocker", 30, true]);
                } else if (props.id === 9) {
                    buttons.push(["btn_juicemonsters", 30, true]);
                    if (getCREATURES()._guardian) buttons.push(["btn_juiceguardian", 30, true]);
                } else if (props.id === 10) {
                    buttons.push(["btn_yardplanner", 30, true]);
                } else if (props.id === 11 || props.id === 5 || props.id === 51) {
                    buttons.push(["btn_viewmap", 30, isHighlight]);
                } else if (props.id === 12) {
                    buttons.push(["btn_openstore", 30, true]);
                } else if (props.id === 13) {
                    if (getGLOBAL()._bHatcheryCC) {
                        buttons.push(["btn_openhcc", 30, true]);
                    } else {
                        buttons.push([getBASE().isInfernoMainYardOrOutpost ? "btn_viewincubator" : "btn_viewhatchery", 30, true]);
                    }
                } else if (getHOUSING().isHousingBuilding(props.id)) {
                    buttons.push([getBASE().isInfernoMainYardOrOutpost ? "btn_viewcompound" : "btn_viewhousing", 30, true]);
                } else if (props.id === 19) {
                    buttons.push(["btn_openbaiter", 30, true]);
                } else if (props.id === 22) {
                    buttons.push(["btn_openbunker", 30, true]);
                } else if (props.id === 16) {
                    buttons.push(["btn_openhcc", 30, true]);
                } else if (props.id === 26) {
                    buttons.push(["btn_openacademy", 30, true]);
                } else if (props.id === 113) {
                    buttons.push(["btn_openradio", 30, true]);
                } else if (props.id === 114) {
                    buttons.push(["btn_opencage", 30, true]);
                } else if (props.id === 116) {
                    buttons.push(["btn_openlab", 30, true]);
                } else if (props.id === 119) {
                    buttons.push(["btn_openchamber", 30, true]);
                } else if (props.id === SiegeFactory.ID) {
                    buttons.push([SiegeFactory.SIEGE_BUTTON, 30, true]);
                } else if (props.id === SiegeLab.ID) {
                    buttons.push([SiegeLab.SIEGE_BUTTON, 30, true]);
                } else if (props.id === getBUILDING14().k_TYPE && getMapRoomManager().instance.isInMapRoom3 && !getBASE().isInfernoMainYardOrOutpost) {
                    buttons.push([MapRoom3RelocatePopup.k_RELOCATE_BUTTONINFO, 30, true]);
                }
            }

            // Standard action buttons
            if (canDoMore && props.type !== "mushroom") {
                if (props.type !== "decoration" && props.id !== MAPROOM.TYPE && !isMR3Outpost) {
                    buttons.push(["btn_upgrade", 30]);
                }
                if (props.type === "wall" && !isMR3Outpost) {
                    buttons.push(["btn_upgradeall", 30, 1]);
                }
                if (getTUTORIAL()._stage >= 200) {
                    if (props.can_fortify && !isMR3Outpost) buttons.push(["btn_fortify", 30]);
                    if (!props.isNoMoreInfoButton) buttons.push(["btn_more", 30]);
                    if (!building.isImmobile || getGLOBAL()._aiDesignMode) buttons.push(["btn_move", 30]);
                }
            }
            if (canDoMore && props.type === "taunt") {
                buttons.push(["btn_viewmessage", 30]);
            }
        } else {
            // Non-build mode
            if (getLOGIN()._playerID === building._senderid) {
                buttons.push(["btn_editmessage", 26]);
            } else if (props.type === "taunt") {
                buttons.push(["btn_viewmessage", 30]);
            } else {
                buttons.push(["btn_help", 30]);
            }
        }

        if (props.type === "mushroom") {
            buttons.push(["btn_pick", 30, true]);
        }

        // Position and render buttons
        let yPos = (BUILDINGINFO._mc as any).tName.y + (BUILDINGINFO._mc as any).tName.height + 5;
        if (!BUILDINGINFO._positionSet) {
            BUILDINGINFO._positionSet = true;
            BUILDINGINFO._clickPoint = new Point(getMAP()._GROUND!.mouseX, getMAP()._GROUND!.mouseY);
            BUILDINGINFO._mc!.x = Math.floor(BUILDINGINFO._clickPoint.x) - 60;
            BUILDINGINFO._mc!.y = Math.floor(BUILDINGINFO._clickPoint.y) - yPos - 15;
        }

        // Create button container
        if (BUILDINGINFO._buttonsMC) {
            BUILDINGINFO._mc!.removeChild(BUILDINGINFO._buttonsMC);
        }
        BUILDINGINFO._buttonsMC = BUILDINGINFO._mc!.addChild(new MovieClip()) as MovieClip;

        // Add buttons
        for (let i = 0; i < buttons.length; i++) {
            const btn: any = new (GLOBAL as any).Button_CLIP();
            BUILDINGINFO._buttonsMC.addChild(btn);
            if (buttons[i][0] === "btn_move") {
                btn.SetupKey(buttons[i][0], false, 52, buttons[i][1]);
                btn.x = 6;
                btn.y = yPos;
                yPos += btn.height + 2;
            } else if (buttons[i][0] === "btn_more") {
                btn.SetupKey(buttons[i][0], false, 55, buttons[i][1]);
                btn.x = 60;
                btn.y = yPos;
            } else if (buttons[i][0] === "btn_bank") {
                btn.labelKey = "btn_bank";
                btn.Setup(getKEYS().Get("btn_bank", { v1: buttons[i][3] }), false, 110, buttons[i][1]);
                btn.x = 6;
                btn.y = yPos;
                yPos += btn.height + 2;
            } else {
                btn.SetupKey(buttons[i][0], false, 110, buttons[i][1]);
                btn.x = 6;
                btn.y = yPos;
                yPos += btn.height + 2;
            }
            if (buttons[i][2]) btn.Highlight = true;
            btn.addEventListener(MouseEvent.MOUSE_DOWN, BUILDINGINFO.Special);
        }

        (BUILDINGINFO._mc as any).mcBG.height = yPos + 5;
    }

    public static Tick(event: Event): void {
        if (!BUILDINGINFO._mc) return;
        if (BUILDINGINFO._mc.mouseX > 150 || BUILDINGINFO._mc.mouseX < -30 || 
            BUILDINGINFO._mc.mouseY > (BUILDINGINFO._mc as any).mcBG.height + 20 || BUILDINGINFO._mc.mouseY < -50) {
            BUILDINGINFO.Hide();
        }
    }

    public static Hide(event: MouseEvent | null = null): void {
        if (BUILDINGINFO._mc) {
            BUILDINGINFO._mc.removeEventListener(Event.ENTER_FRAME, BUILDINGINFO.Tick);
            if (getMAP()._BUILDINGINFO) {
                getMAP()._BUILDINGINFO.removeChild(BUILDINGINFO._mc);
            }
            BUILDINGINFO._mc = null;
            BUILDINGINFO._buttonsMC = null;
            if (!getSTORE()._open && !HATCHERY._open && !HATCHERYCC._open && !getCREATURELOCKER()._open && 
                !ACADEMY._open && !getMONSTERBUNKER()._open && !getSTORE()._streamline) {
                getBASE().BuildingDeselect();
            }
        }
    }

    public static Special(event: MouseEvent): void {
        const target: any = event.target;
        const building = BUILDINGINFO._building!;
        const props = BUILDINGINFO._props;

        if (target.labelKey === "btn_bank") building.Bank();
        if (target.labelKey === "btn_bankall") {
            const resources = getInstanceManager().getInstancesByClass(getBRESOURCE());
            for (const res of resources) {
                const b = res as BFOUNDATION;
                if (b._class === "resource" && b._countdownUpgrade.Get() === 0 && 
                    b._countdownBuild.Get() === 0 && b._countdownFortify.Get() === 0 && 
                    b.health === b.maxHealth) {
                    b.Bank();
                }
            }
        }
        if (target.labelKey === "btn_openlocker" || target.labelKey === "btn_openstrongbox") getCREATURELOCKER().Show();
        if (target.labelKey === "btn_viewmap") getGLOBAL().ShowMap();
        if (target.labelKey === "btn_openlab") (getGLOBAL()._bLab as MONSTERLAB).Show();
        if (target.labelKey === "btn_joinnwm") MapRoom3ConfirmMigrationPopup.instance.Show();
        if (target.labelKey === "btn_viewhatchery" || target.labelKey === "btn_viewincubator") HATCHERY.Show(building as BUILDING13);
        if (target.labelKey === "btn_viewhousing" || target.labelKey === "btn_viewcompound" || target.labelKey === "btn_juicemonsters") getHOUSING().Show();
        if (target.labelKey === "btn_juiceguardian") getCHAMPIONCAGE().ShowJuice();
        if (target.labelKey === "btn_openstore") getSTORE().ShowB(1, 0);
        if (target.labelKey === "btn_yardplanner") getPLANNER().Show();
        if (target.labelKey === "btn_openbunker") getMONSTERBUNKER().Show();
        if (target.labelKey === "btn_stopbuild") building.Recycle();
        if (target.labelKey === "btn_stopupgrade") building.UpgradeCancel();
        if (target.labelKey === "btn_stopfortify") building.FortifyCancel();
        if (target.labelKey === "btn_openhcc") HATCHERYCC.Show();
        if (target.labelKey === "btn_openbaiter") MONSTERBAITER.Show();
        if (target.labelKey === "btn_openacademy") ACADEMY.Show(building);
        if (target.labelKey === "btn_repair") building.Repair();
        if (target.labelKey === "btn_repairall") getSTORE().ShowB(3, 1, ["FIX"], true);
        if (target.labelKey === "btn_help") building.Help();
        if (target.labelKey === "btn_openradio") RADIO.Show();
        if (target.labelKey === "btn_opencage") getCHAMPIONCAGE().Show();
        if (target.labelKey === "btn_openchamber") getCHAMPIONCHAMBER().Show();
        if (target.labelKey === getINFERNOPORTAL().ENTER_BUTTON || target.labelKey === getINFERNOPORTAL().EXIT_BUTTON) getINFERNOPORTAL().EnterPortal();
        if (target.labelKey === getINFERNOPORTAL().ASCENSION_BUTTON) getINFERNOPORTAL().AscendMonsters();
        if (target.labelKey === SiegeFactory.SIEGE_BUTTON) SiegeFactory.Show();
        if (target.labelKey === SiegeLab.SIEGE_BUTTON) SiegeLab.Show();
        if (target.labelKey === MapRoom3RelocatePopup.k_RELOCATE_BUTTONINFO) MapRoom3RelocatePopup.instance.Show();
        if (target.labelKey === "btn_move") building.StartMove();
        if (target.labelKey === "btn_upgrade") getBUILDINGOPTIONS().Show(building, "upgrade");
        if (target.labelKey === "btn_fortify") getBUILDINGOPTIONS().Show(building, "fortify");
        if (target.labelKey === "btn_upgradeall") {
            getSTORE().ShowB(1, 0, getBASE().isInfernoMainYardOrOutpost ? ["BLK2I", "BLK3I"] : ["BLK2", "BLK3", "BLK4", "BLK5"]);
        }
        if (target.labelKey === "btn_more") getBUILDINGOPTIONS().Show(building, "more");
        if (target.labelKey === "btn_pick") MUSHROOMS.PickWorker(building);
        if (target.labelKey === "btn_speedup") {
            BUILDINGINFO.Update();
            if (building._repairing || building._countdownBuild.Get() + building._countdownUpgrade.Get() + building._countdownFortify.Get() > 0) {
                getSTORE().SpeedUp("SP4");
            } else if (props.id === 8 || props.id === 26) {
                getSTORE().SpeedUp("SP4");
            } else if (props.id === 13 || props.id === 16) {
                getSTORE().ShowB(3, 1, getBASE().isInfernoMainYardOrOutpost ? ["HODI", "HOD2I", "HOD3I"] : ["HOD", "HOD2", "HOD3"]);
            } else if (props.type === "resource") {
                getSTORE().ShowB(3, 1, ["POD"]);
            }
        }
        if (target.labelKey === "btn_viewmessage") SIGNS.ShowMessage(building);
        if (target.labelKey === "btn_editmessage") SIGNS.EditForBuilding(building);
        BUILDINGINFO.Hide();
    }
}
