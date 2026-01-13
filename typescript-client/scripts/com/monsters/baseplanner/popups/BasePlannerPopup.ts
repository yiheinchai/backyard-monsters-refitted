import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";
import TextFieldAutoSize from "openfl/text/TextFieldAutoSize";

import { ScrollSetV } from "../../display/ScrollSetV";
import { BasePlanner } from "../BasePlanner";
import { PlannerDesignView } from "../PlannerDesignView";
import { PlannerExplorer } from "../PlannerExplorer";
import { PlannerNode } from "../PlannerNode";
import { PlannerTemplate } from "../PlannerTemplate";
import { BasePlannerEvent } from "../events/BasePlannerEvent";
import { BasePlannerNodeEvent } from "../events/BasePlannerNodeEvent";
import { BasePlannerTransferConfirmation } from "./transfer/BasePlannerTransferConfirmation";
import { BasePlannerPopup_BottomLayout } from "../../../../BasePlannerPopup_BottomLayout";
import { BasePlannerPopup_CLIP } from "../../../../BasePlannerPopup_CLIP";
import { BasePlannerPopup_DisplayViewContainer } from "../../../../BasePlannerPopup_DisplayViewContainer";
import { BasePlannerPopup_ExplorerContainer } from "../../../../BasePlannerPopup_ExplorerContainer";
import { BasePlannerPopup_ExplorerHeader } from "../../../../BasePlannerPopup_ExplorerHeader";
import { BasePlannerPopup_ToolsLayout } from "../../../../BasePlannerPopup_ToolsLayout";
import { BasePlannerPopup_ToolTip } from "../../../../BasePlannerPopup_ToolTip";
import { BasePlannerPopup_ZoomLayout } from "../../../../BasePlannerPopup_ZoomLayout";
import { frame } from "../../../../frame";
import { buttonFullscreenFrame_CLIP } from "../../../../buttonFullscreenFrame_CLIP";
import { Button_CLIP } from "../../../../Button_CLIP";
import { Checkbox } from "../../../../Checkbox";

import { BASE } from "../../../../BASE";
import { GLOBAL } from "../../../../GLOBAL";
import { KEYS } from "../../../../KEYS";
import { PLANNER } from "../../../../PLANNER";
import { POPUPS } from "../../../../POPUPS";
import { POPUPSETTINGS } from "../../../../POPUPSETTINGS";
import { STORE } from "../../../../STORE";

/**
 * BasePlannerPopup - Base planner popup UI.
 */
export class BasePlannerPopup extends Sprite {
    private static _layoutSpacing: Point = new Point(10, 10);
    private static _layoutOffset: Point = new Point(0, 0);
    public static readonly EXPLORER_BUILDING_CLICK: string = "explorer_click";
    public static readonly EXPLORER_UPDATE: string = "explorer_update";
    public static readonly DESIGN_CLEAR_EXPLORER: string = "design_explorer_clear";
    public static readonly DESIGN_BUILDING_STORE: string = "design_building_store";
    public static readonly DESIGN_BUILDING_PLACE: string = "design_building_place";
    public static readonly DESIGN_BUILDING_INVALID: string = "design_building_invalid";
    public static readonly DESIGN_TOOL_UPDATE: string = "design_tool_update";
    public static readonly PLANNER_HINT: string = "planner_hint";
    public static readonly PLANNER_HINT_HIDE: string = "planner_hide";

    public mcFrame: frame | null = null;
    public displayCanvas: BasePlannerPopup_DisplayViewContainer | null = null;
    public sideBar: BasePlannerPopup_ExplorerContainer | null = null;
    private sideBarScrollBar: ScrollSetV | null = null;
    public sideBarHeader: BasePlannerPopup_ExplorerHeader | null = null;
    public bottomMenu: BasePlannerPopup_BottomLayout | null = null;
    public toolMenu: BasePlannerPopup_ToolsLayout | null = null;
    public storeMenu: Sprite | null = null;
    public inventoryMenu: Sprite | null = null;
    public zoomMenu: BasePlannerPopup_ZoomLayout | null = null;
    public toolTipMenu: BasePlannerPopup_ToolTip | null = null;
    public buildingExplorer: PlannerExplorer | null = null;
    public designView: PlannerDesignView | null = null;
    public fullscreenButton: Sprite | null = null;
    private _guideMC: BasePlannerPopup_CLIP | null = null;
    private _mcFrame: Sprite | null = null;
    private _plannerTemplate: PlannerTemplate;
    private _hasBeenSaved: boolean = false;
    private _currentTool: string | null = null;
    private readonly _PLANNER_SIDEBAR_WIDTH: number = 190;
    private readonly _PLANNER_BOTTOMBAR_SPACING: number = 60;
    private readonly _PLANNER_TOP_MARGIN: number = 10;
    private readonly _PLANNER_BOTTOM_MARGIN: number = 5;
    private readonly _PLANNER_RIGHT_MARGIN: number = 10;
    private readonly _PLANNER_LEFT_MARGIN: number = 10;
    private readonly _PLANNER_HEADER_MARGIN: number = 32;
    private _bSave: any = null;
    private _bApply: any = null;
    private _bLoad: any = null;
    private _bClear: any = null;
    private _isTemplateApplicable: boolean = true;
    private _confirmationPopup: BasePlannerTransferConfirmation | null = null;
    private _clearConfirmationPopup: BasePlannerTransferConfirmation | null = null;

    constructor(template: PlannerTemplate) {
        super();
        this._plannerTemplate = template;
        this.setup();
        this.Resize();
    }

    public setup(): void {
        this.configPopupTemplate();
        this.buildingExplorer!.addEventListener(PlannerExplorer.EXPLORER_ITEM_CLICK, this.onExplorerItemClick.bind(this));
        if (!BasePlanner.canSave) {
            this._bLoad.Enabled = false;
            this._bLoad.mouseEnabled = false;
            this._bSave.Enabled = false;
            this._bSave.mouseEnabled = false;
            this._bSave.mouseChildren = false;
            this._bSave.enabled = false;
        }
    }

    private set canApply(value: boolean) {
        this._bApply.Enabled = value;
        this._isTemplateApplicable = value;
    }

    private checkIfApplicable(): boolean {
        for (let i = 0; i < this._plannerTemplate.inventoryData.length; i++) {
            const category = this._plannerTemplate.inventoryData[i].category;
            if (category !== PlannerNode.TYPE_DECORATION && category !== PlannerNode.TYPE_MISC) {
                return false;
            }
        }
        return true;
    }

    public redraw(): void {
        this.buildingExplorer!.redraw();
        this.designView!.redraw();
        this.sideBarScrollBar!.checkResize();
    }

    public configPopupTemplate(width: number = 0, height: number = 0): void {
        const startPoint = new Point(this._PLANNER_LEFT_MARGIN, this._PLANNER_TOP_MARGIN);
        if (!this._guideMC) {
            this._guideMC = new BasePlannerPopup_CLIP();
        }
        if (!this._mcFrame) {
            this._mcFrame = new Sprite();
            this.addChild(this._mcFrame);
        }
        if (!this.mcFrame) {
            this.mcFrame = new frame(false);
            this.mcFrame.addChild(this._guideMC.guideBG);
            this._mcFrame.addChild(this.mcFrame);
        }
        if (width !== 0) {
            this._guideMC.guideBG.width = width;
        }
        if (height !== 0) {
            this._guideMC.guideBG.height = height;
        }
        this.mcFrame.width = this._guideMC.guideBG.width;
        this.mcFrame.height = this._guideMC.guideBG.height;
        (this.mcFrame as frame).Setup(true, this.Hide.bind(this));
        if (!this.sideBar) {
            this.sideBar = new BasePlannerPopup_ExplorerContainer();
        }
        this.sideBar.x = BasePlannerPopup._layoutSpacing.x + startPoint.x;
        this.sideBar.y = BasePlannerPopup._layoutSpacing.y + startPoint.y + this._PLANNER_HEADER_MARGIN;
        this.sideBar.mcScroller.visible = false;
        this.sideBar.mcframe.width = this._PLANNER_SIDEBAR_WIDTH;
        this.sideBar.mcframe.height = height - (this.sideBar.y + BasePlannerPopup._layoutSpacing.y + this._PLANNER_BOTTOM_MARGIN);
        this.sideBar.canvasmask.width = this._PLANNER_SIDEBAR_WIDTH;
        this.sideBar.canvasmask.height = height - (this.sideBar.y + BasePlannerPopup._layoutSpacing.y + this._PLANNER_BOTTOM_MARGIN);
        this.sideBar.bg.width = this._PLANNER_SIDEBAR_WIDTH;
        this.sideBar.bg.height = height - (this.sideBar.y + BasePlannerPopup._layoutSpacing.y + this._PLANNER_BOTTOM_MARGIN);
        if (!this.sideBarHeader) {
            this.sideBarHeader = new BasePlannerPopup_ExplorerHeader();
        }
        this.sideBarHeader.tLabel.htmlText = KEYS.Get("basePlanner_explorerHeader");
        this.sideBarHeader.x = BasePlannerPopup._layoutSpacing.x + startPoint.x;
        this.sideBarHeader.y = BasePlannerPopup._layoutSpacing.y + startPoint.y;
        this.addChild(this.sideBarHeader);
        if (!this.buildingExplorer) {
            this.buildingExplorer = new PlannerExplorer(this._plannerTemplate.inventoryData);
            this.buildingExplorer.setup();
            this.buildingExplorer.addEventListener(BasePlannerPopup.EXPLORER_BUILDING_CLICK, this.onExplorerItemClick.bind(this));
            this.buildingExplorer.addEventListener(BasePlannerPopup.PLANNER_HINT, this.onToolTipNodeHint.bind(this));
            this.buildingExplorer.addEventListener(BasePlannerPopup.PLANNER_HINT_HIDE, this.onToolTipNodeHide.bind(this));
            this.buildingExplorer.addEventListener(BasePlannerPopup.EXPLORER_UPDATE, this.onExplorerChange.bind(this));
            this.buildingExplorer.x = 0;
            this.buildingExplorer.y = 0;
            this.sideBar.canvas.getChildAt(0).height = 0;
            this.sideBar.canvas.addChild(this.buildingExplorer);
        }
        BasePlannerPopup._layoutOffset.x = this.sideBar.x + this.sideBar.canvasmask.width;
        BasePlannerPopup._layoutOffset.y = this.sideBar.y + this.sideBar.canvasmask.height;
        this.addChild(this.sideBar);
        if (!this.sideBarScrollBar) {
            this.createExplorerScrollBar(this.sideBar.canvas);
        } else {
            this.sideBarScrollBar.checkResize();
            this.sideBarScrollBar.x = this.sideBar.canvas.x + this.sideBar.canvas.width - this.sideBarScrollBar.width + this._PLANNER_LEFT_MARGIN;
            this.sideBarScrollBar.y = this.sideBar.canvas.y + BasePlannerPopup._layoutSpacing.y + this._PLANNER_TOP_MARGIN + this._PLANNER_HEADER_MARGIN;
            this.addChildAt(this.sideBarScrollBar, this.numChildren);
        }
        if (!this.displayCanvas) {
            this.displayCanvas = new BasePlannerPopup_DisplayViewContainer();
            this.addChild(this.displayCanvas);
        }
        if (width === 0) {
            width = this.mcFrame.width;
        }
        if (height === 0) {
            height = this.mcFrame.height;
        }
        this.displayCanvas.x = BasePlannerPopup._layoutOffset.x;
        this.displayCanvas.y = BasePlannerPopup._layoutSpacing.y + startPoint.y;
        this.displayCanvas.mcframemask.width = width - (this.displayCanvas.x + BasePlannerPopup._layoutSpacing.x + this._PLANNER_RIGHT_MARGIN);
        this.displayCanvas.mcframemask.height = height - (this.displayCanvas.y + BasePlannerPopup._layoutSpacing.y - 1 + this._PLANNER_BOTTOM_MARGIN) - this._PLANNER_BOTTOMBAR_SPACING;
        this.displayCanvas.mcframe.width = width - (this.displayCanvas.x + BasePlannerPopup._layoutSpacing.x + this._PLANNER_RIGHT_MARGIN);
        this.displayCanvas.mcframe.height = height - (this.displayCanvas.y + BasePlannerPopup._layoutSpacing.y - 1 + this._PLANNER_BOTTOM_MARGIN) - this._PLANNER_BOTTOMBAR_SPACING;
        this.displayCanvas.canvasmask.width = width - (this.displayCanvas.x + BasePlannerPopup._layoutSpacing.x + this._PLANNER_RIGHT_MARGIN);
        this.displayCanvas.canvasmask.height = height - (this.displayCanvas.y + BasePlannerPopup._layoutSpacing.y + this._PLANNER_BOTTOM_MARGIN) - this._PLANNER_BOTTOMBAR_SPACING;
        if (!this.designView) {
            this.designView = new PlannerDesignView(this._plannerTemplate.displayData);
            this.designView.setup();
            this.designView.addEventListener(BasePlannerPopup.DESIGN_BUILDING_PLACE, this.onDesignItemPlace.bind(this));
            this.designView.addEventListener(BasePlannerPopup.DESIGN_BUILDING_STORE, this.onDesignItemStore.bind(this));
            this.designView.addEventListener(BasePlannerPopup.DESIGN_BUILDING_INVALID, this.onDesignItemInvalid.bind(this));
            this.designView.addEventListener(BasePlannerPopup.DESIGN_CLEAR_EXPLORER, this.onClearExplorerSelections.bind(this));
            this.designView.addEventListener(BasePlannerPopup.PLANNER_HINT, this.onToolTipNodeHint.bind(this));
            this.designView.addEventListener(BasePlannerPopup.PLANNER_HINT_HIDE, this.onToolTipNodeHide.bind(this));
            this.designView.addEventListener(BasePlannerPopup.DESIGN_TOOL_UPDATE, this.onToolUpdate.bind(this));
            this.designView.addEventListener(PlannerDesignView.STATE_CHANGE, this.onDesignStateChange.bind(this));
        }
        this.displayCanvas.canvas.addChild(this.designView);
        this.designView.recenter();
        if (!this.bottomMenu) {
            this.bottomMenu = new BasePlannerPopup_BottomLayout();
            this.addChild(this.bottomMenu);
            this._bSave = new Button_CLIP();
            this._bSave.x = this.bottomMenu.btnSave.x;
            this._bSave.y = this.bottomMenu.btnSave.y;
            this._bSave.width = this.bottomMenu.btnSave.width;
            this._bSave.height = this.bottomMenu.btnSave.height;
            this._bSave.SetupKey("basePlanner_btnSave");
            this._bSave.addEventListener(MouseEvent.CLICK, this.onSaveClick.bind(this));
            this._bSave.addEventListener(MouseEvent.ROLL_OVER, this.onToolTipMouseHint(this.onToolTipHint.bind(this), [KEYS.Get("basePlanner_saveTool")]));
            this._bSave.addEventListener(MouseEvent.ROLL_OUT, this.onToolTipHide.bind(this));
            this.bottomMenu.addChild(this._bSave);
            this.bottomMenu.removeChild(this.bottomMenu.btnSave);
            if (!BasePlanner.canSave) {
                this._bSave.mouseEnabled = this._bSave.enabled = this._bSave.Enabled = false;
            }
            this._bLoad = new Button_CLIP();
            this._bLoad.x = this.bottomMenu.btnLoad.x;
            this._bLoad.y = this.bottomMenu.btnLoad.y;
            this._bLoad.width = this.bottomMenu.btnLoad.width;
            this._bLoad.height = this.bottomMenu.btnLoad.height;
            this._bLoad.SetupKey("basePlanner_btnLoad");
            this._bLoad.addEventListener(MouseEvent.CLICK, this.onLoadClick.bind(this));
            this._bLoad.addEventListener(MouseEvent.ROLL_OVER, this.onToolTipMouseHint(this.onToolTipHint.bind(this), [KEYS.Get("basePlanner_loadTool")]));
            this._bLoad.addEventListener(MouseEvent.ROLL_OUT, this.onToolTipHide.bind(this));
            this.bottomMenu.addChild(this._bLoad);
            this.bottomMenu.removeChild(this.bottomMenu.btnLoad);
            if (!BasePlanner.canSave) {
                this._bLoad.mouseEnabled = this._bLoad.enabled = false;
            }
            this._bApply = new Button_CLIP();
            this._bApply.x = this.bottomMenu.btnApply.x;
            this._bApply.y = this.bottomMenu.btnApply.y;
            this._bApply.width = this.bottomMenu.btnApply.width;
            this._bApply.height = this.bottomMenu.btnApply.height;
            this._bApply.SetupKey("basePlanner_btnApply");
            this._bApply.addEventListener(MouseEvent.CLICK, this.onApplyClick.bind(this));
            this._bApply.addEventListener(MouseEvent.ROLL_OVER, this.onToolTipMouseHint(this.onToolTipHint.bind(this), [KEYS.Get("basePlanner_applyTool")]));
            this._bApply.addEventListener(MouseEvent.ROLL_OUT, this.onToolTipHide.bind(this));
            this.bottomMenu.addChild(this._bApply);
            this.bottomMenu.removeChild(this.bottomMenu.btnApply);
            this._bClear = new Button_CLIP();
            this._bClear.x = this.bottomMenu.btnClear.x;
            this._bClear.y = this.bottomMenu.btnClear.y;
            this._bClear.width = this.bottomMenu.btnClear.width;
            this._bClear.height = this.bottomMenu.btnClear.height;
            this._bClear.SetupKey("basePlanner_btnClear");
            this._bClear.addEventListener(MouseEvent.CLICK, this.onClearClick.bind(this));
            this._bClear.addEventListener(MouseEvent.ROLL_OVER, this.onToolTipMouseHint(this.onToolTipHint.bind(this), [KEYS.Get("basePlanner_clearTool")]));
            this._bClear.addEventListener(MouseEvent.ROLL_OUT, this.onToolTipHide.bind(this));
            this.bottomMenu.addChild(this._bClear);
            this.bottomMenu.removeChild(this.bottomMenu.btnClear);
            const check1 = Checkbox.Replace(this.bottomMenu.check1);
            this.bottomMenu.addChild(check1);
            check1.addEventListener(Checkbox.CHECK_EVENT, this.onCheckboxClick.bind(this));
            const check2 = Checkbox.Replace(this.bottomMenu.check2);
            check2.addEventListener(Checkbox.CHECK_EVENT, this.onCheckboxClick.bind(this));
            this.bottomMenu.addChild(check2);
            const check3 = Checkbox.Replace(this.bottomMenu.check3);
            check3.addEventListener(Checkbox.CHECK_EVENT, this.onCheckboxClick.bind(this));
            this.bottomMenu.addChild(check3);
            if (this.bottomMenu.check4) {
                const check4 = Checkbox.Replace(this.bottomMenu.check4);
                check4.addEventListener(Checkbox.CHECK_EVENT, this.onCheckboxClick.bind(this));
                this.bottomMenu.addChild(check4);
            }
            this.bottomMenu.check1_txt.htmlText = KEYS.Get("basePlanner_groundrange");
            this.bottomMenu.check2_txt.htmlText = KEYS.Get("basePlanner_aerialrange");
            this.bottomMenu.check3_txt.htmlText = KEYS.Get("basePlanner_minerange");
            if (this.bottomMenu.check4_txt) {
                this.bottomMenu.check4_txt.htmlText = KEYS.Get("basePlanner_moreinfo");
            }
        }
        const bottomMenuWidth = 520;
        this.bottomMenu.x = width - (BasePlannerPopup._layoutSpacing.x + bottomMenuWidth) + startPoint.x;
        this.bottomMenu.y = this.displayCanvas.y + this.displayCanvas.canvasmask.height;
        if (!this.toolMenu) {
            this.toolMenu = new BasePlannerPopup_ToolsLayout();
            this.addChild(this.toolMenu);
            this.toolMenu.mcSelectMove.gotoAndStop(1);
            this.toolMenu.mcSelectMove.buttonMode = true;
            this.toolMenu.mcSelectMove.addEventListener(MouseEvent.CLICK, this.onToolClick.bind(this));
            this.toolMenu.mcSelectMove.addEventListener(MouseEvent.ROLL_OVER, this.onToolOver.bind(this));
            this.toolMenu.mcSelectMove.addEventListener(MouseEvent.ROLL_OUT, this.onToolOut.bind(this));
            this.toolMenu.mcStore.gotoAndStop(1);
            this.toolMenu.mcStore.buttonMode = true;
            this.toolMenu.mcStore.addEventListener(MouseEvent.CLICK, this.onToolClick.bind(this));
            this.toolMenu.mcStore.addEventListener(MouseEvent.ROLL_OVER, this.onToolOver.bind(this));
            this.toolMenu.mcStore.addEventListener(MouseEvent.ROLL_OUT, this.onToolOut.bind(this));
            if (Boolean(STORE._storeData.ENL) && STORE._storeData.ENL.q === 6) {
                this.toolMenu.mcExpand.enabled = false;
                this.toolMenu.mcExpand.mouseEnabled = false;
                this.toolMenu.mcExpand.gotoAndStop("off");
            } else if (BASE.isMainYardOrInfernoMainYard) {
                this.toolMenu.mcExpand.gotoAndStop(1);
                this.toolMenu.mcExpand.buttonMode = true;
                this.toolMenu.mcExpand.addEventListener(MouseEvent.CLICK, this.onStoreOpen.bind(this));
                this.toolMenu.mcExpand.addEventListener(MouseEvent.ROLL_OVER, this.onToolOver.bind(this));
                this.toolMenu.mcExpand.addEventListener(MouseEvent.ROLL_OUT, this.onToolOut.bind(this));
                this.toolMenu.mcExpand.visible = true;
            } else {
                this.toolMenu.mcExpand.visible = false;
            }
        }
        this.toolMenu.x = BasePlannerPopup._layoutOffset.x + 50;
        this.toolMenu.y = BasePlannerPopup._layoutSpacing.y + startPoint.y;
        if (!this.zoomMenu) {
            this.zoomMenu = new BasePlannerPopup_ZoomLayout();
            this.addChild(this.zoomMenu);
            if (GLOBAL.DOES_USE_SCROLL) {
                this.displayCanvas.addEventListener(MouseEvent.MOUSE_WHEEL, this.onScroll.bind(this));
            }
            this.zoomMenu.btnUp.addEventListener(MouseEvent.CLICK, this.onZoomUp.bind(this));
            this.zoomMenu.btnDown.addEventListener(MouseEvent.CLICK, this.onZoomDown.bind(this));
            this.zoomMenu.scrollbar.addEventListener(MouseEvent.CLICK, this.onZoomScroll.bind(this));
        }
        this.zoomMenu.x = BasePlannerPopup._layoutOffset.x + 25;
        this.zoomMenu.y = BasePlannerPopup._layoutSpacing.y + 10;
        this.zoomScrollerUpdate();
        if (!this.fullscreenButton) {
            this.fullscreenButton = new Sprite();
            this.fullscreenButton.addChild(new buttonFullscreenFrame_CLIP());
            this.fullscreenButton.addEventListener(MouseEvent.CLICK, GLOBAL.goFullScreen);
        }
        this._mcFrame.addChild(this.fullscreenButton);
        this.fullscreenButton.x = width - (BasePlannerPopup._layoutSpacing.x + 50) + startPoint.x;
        this.fullscreenButton.y = -10;
        if (!this.toolTipMenu) {
            this.toolTipMenu = new BasePlannerPopup_ToolTip();
            this.toolTipMenu.mouseEnabled = false;
            this.addChild(this.toolTipMenu);
        }
        this.toolTipMenu.x = this.displayCanvas.x + this.displayCanvas.canvasmask.width / 2;
        this.toolTipMenu.y = this.displayCanvas.y + this.displayCanvas.canvasmask.height - 40;
        this.onToolTipHide();
        this.onToolUpdate();
        this.x = -(this.width / 2);
        this.y = -(this.height / 2);
    }

    public onToolTipNodeHint(event: BasePlannerNodeEvent): void {
        if (!this.toolTipMenu!.hitTestPoint(this.stage.mouseX, this.mouseY)) {
            this.onToolTipHint(null, event.node.displayNameFull);
        }
    }

    public onToolTipMouseHint(method: Function, additionalArguments: Array<any>): Function {
        return (event: MouseEvent): void => {
            method.apply(null, [event].concat(additionalArguments));
        };
    }

    public onToolTipHint(event: Event | null, text: string): void {
        this.toolTipMenu!.tLabel.htmlText = text;
        this.toolTipMenu!.tLabel.autoSize = TextFieldAutoSize.CENTER;
        this.toolTipMenu!.tLabel.width = 140;
        while (this.toolTipMenu!.tLabel.height > 20) {
            this.toolTipMenu!.tLabel.width += 2;
        }
        this.toolTipMenu!.tLabel.x = -(this.toolTipMenu!.tLabel.width / 2);
        this.toolTipMenu!.mcBG.width = this.toolTipMenu!.tLabel.width + 20;
        this.toolTipMenu!.visible = true;
    }

    public onToolTipNodeHide(event: BasePlannerNodeEvent): void {
        this.onToolTipHide();
    }

    public onToolTipHide(event: MouseEvent | null = null): void {
        this.toolTipMenu!.visible = false;
    }

    public onToolUpdate(event: Event | null = null): void {
        this.onToolReset();
        if (this.designView!.currentTool === PlannerDesignView.TOOL_SELECTMOVE) {
            this.toolMenu!.mcSelectMove.gotoAndStop("over");
        } else if (this.designView!.currentTool === PlannerDesignView.TOOL_STORE) {
            this.toolMenu!.mcStore.gotoAndStop("over");
        }
        if (Boolean(STORE._storeData.ENL) && STORE._storeData.ENL.q === 6) {
            this.toolMenu!.mcExpand.enabled = false;
            this.toolMenu!.mcExpand.mouseEnabled = false;
            this.toolMenu!.mcExpand.gotoAndStop("off");
        } else if (BASE.isMainYardOrInfernoMainYard) {
            this.toolMenu!.mcExpand.visible = true;
        } else {
            this.toolMenu!.mcExpand.visible = false;
        }
    }

    public onToolReset(event: Event | null = null): void {
        this.toolMenu!.mcSelectMove.gotoAndStop("out");
        this.toolMenu!.mcStore.gotoAndStop("out");
        this.toolMenu!.mcExpand.gotoAndStop("out");
    }

    public onToolClick(event: MouseEvent): void {
        if (event.target === this.toolMenu!.mcSelectMove) {
            this.designView!.setTool(PlannerDesignView.TOOL_SELECTMOVE);
        }
        if (event.target === this.toolMenu!.mcStore) {
            this.designView!.setTool(PlannerDesignView.TOOL_STORE);
        }
        this.onToolUpdate();
    }

    public onToolOver(event: MouseEvent): void {
        (event.target as any).gotoAndStop("over");
        if (event.target === this.toolMenu!.mcSelectMove) {
            this.onToolTipHint(null, KEYS.Get("basePlanner_moveTool"));
        } else if (event.target === this.toolMenu!.mcStore) {
            this.onToolTipHint(null, KEYS.Get("basePlanner_storageTool"));
        } else if (event.target === this.toolMenu!.mcExpand) {
            this.onToolTipHint(null, KEYS.Get("basePlanner_expandTool"));
        }
    }

    public onToolOut(event: MouseEvent): void {
        this.onToolUpdate();
        this.onToolTipHide();
    }

    public onStoreOpen(event: MouseEvent | null = null): void {
        if (BASE.isMainYardOrInfernoMainYard) {
            STORE.ShowB(1, 1, ["ENL"]);
            if (STORE._mc) {
                STORE._mc.addEventListener(Event.REMOVED_FROM_STAGE, this.onStoreClosed.bind(this));
            }
        }
    }

    public onStoreClosed(event: Event | null = null): void {
        this.designView!.redraw();
        this.onToolUpdate();
    }

    public onCheckboxClick(event: Event | null = null): void {
        if (event!.target instanceof Checkbox) {
            const checkbox = event!.target as Checkbox;
            this.designView!.toggleView(checkbox);
        }
    }

    public removeSelection(): void {
        this.designView!.removeSelection();
    }

    protected onScroll(event: MouseEvent): void {
        if (event.delta < 0) {
            this.onZoomDown(null);
        } else {
            this.onZoomUp(null);
        }
    }

    public onZoomUp(event: MouseEvent | null = null): void {
        let zoom = PlannerDesignView.zoomValue;
        if (zoom < this.designView!.zoomMax) {
            zoom = Math.min(zoom + this.designView!.zoomStep, this.designView!.zoomMax);
            this.designView!.setZoom(zoom);
        }
        this.zoomScrollerUpdate();
    }

    public onZoomDown(event: MouseEvent | null = null): void {
        let zoom = PlannerDesignView.zoomValue;
        if (zoom > this.designView!.zoomMin) {
            zoom = Math.max(zoom - this.designView!.zoomStep, this.designView!.zoomMin);
            this.designView!.setZoom(zoom);
        }
        this.zoomScrollerUpdate();
    }

    public onZoomScroll(event: MouseEvent | null = null): void {
    }

    public zoomScrollerUpdate(): void {
        const minY = 42;
        const maxY = 107;
        const rangeY = maxY - minY;
        const zoomRange = this.designView!.zoomMax - this.designView!.zoomMin;
        const scrollY = maxY - rangeY / zoomRange * PlannerDesignView.zoomValue;
        this.zoomMenu!.scrollbar.y = scrollY;
    }

    private createExplorerScrollBar(canvas: Sprite): void {
        canvas.mask = this.sideBar!.canvasmask;
        this.sideBarScrollBar = new ScrollSetV(canvas, this.sideBar!.canvasmask);
        this.sideBarScrollBar.x = canvas.x + canvas.width - this.sideBarScrollBar.width + this._PLANNER_LEFT_MARGIN;
        this.sideBarScrollBar.y = canvas.y + BasePlannerPopup._layoutSpacing.y + this._PLANNER_TOP_MARGIN;
        this.addChildAt(this.sideBarScrollBar, this.numChildren);
    }

    protected onApplyClick(event: MouseEvent): void {
        if (this._isTemplateApplicable) {
            this.dispatchEvent(new BasePlannerEvent(BasePlannerEvent.APPLY));
        } else {
            GLOBAL.Message(KEYS.Get("basePlanner_cantApply"));
        }
    }

    protected onLoadClick(event: MouseEvent): void {
        this.dispatchEvent(new BasePlannerEvent(BasePlannerEvent.LOAD));
    }

    protected onSaveClick(event: MouseEvent): void {
        this.dispatchEvent(new BasePlannerEvent(BasePlannerEvent.SAVE));
    }

    protected onClearClick(event: MouseEvent): void {
        if (this._clearConfirmationPopup) {
            return;
        }
        this._clearConfirmationPopup = new BasePlannerTransferConfirmation();
        this._clearConfirmationPopup.tBody.htmlText = KEYS.Get("basePlanner_unsaved");
        this._clearConfirmationPopup.bCancel.SetupKey("basePlanner_btnClear");
        this._clearConfirmationPopup.bCancel.addEventListener(MouseEvent.CLICK, this.clickedClearInConfirmationClear.bind(this), false, 0, true);
        if (BasePlanner.canSave === false) {
            this._clearConfirmationPopup.bConfirm.Enabled = false;
        } else {
            this._clearConfirmationPopup.bConfirm.Enabled = true;
            this._clearConfirmationPopup.bConfirm.addEventListener(MouseEvent.CLICK, this.clickedSaveInConfirmationClear.bind(this), false, 0, true);
        }
        this._clearConfirmationPopup.addEventListener(Event.CLOSE, this.clickedCloseInConfirmationClear.bind(this), false, 0, true);
        POPUPS.Add(this._clearConfirmationPopup);
        POPUPSETTINGS.AlignToCenter(this._clearConfirmationPopup);
    }

    protected clickedCloseInConfirmationClear(event: Event): void {
        this.removeClearConfirmationPopup();
    }

    protected clickedSaveInConfirmationClear(event: MouseEvent): void {
        this.removeClearConfirmationPopup();
        this.onSaveClick(null!);
    }

    protected clickedClearInConfirmationClear(event: MouseEvent): void {
        this.removeClearConfirmationPopup();
        this.clear();
    }

    private removeClearConfirmationPopup(): void {
        if (this._clearConfirmationPopup) {
            POPUPS.Remove(this._clearConfirmationPopup);
            this._clearConfirmationPopup = null;
        }
    }

    private clear(): void {
        const len = this._plannerTemplate.displayData.length;
        for (let i = len - 1; i >= 0; i--) {
            const category = this._plannerTemplate.displayData[i].category;
            if (category !== PlannerNode.TYPE_MISC) {
                this._plannerTemplate.inventoryData.push(this._plannerTemplate.displayData[i]);
                this._plannerTemplate.displayData.splice(i, 1);
            }
        }
        this.redraw();
        this.sideBarScrollBar!.checkResize();
        this.changedPlannerData();
        this.zoomScrollerUpdate();
        this.designView!.redrawRanges();
        this.onDesignStateChange();
    }

    public onExplorerChange(event: Event | null = null): void {
        this.sideBarScrollBar!.checkResize();
        this.changedPlannerData();
        this.onToolUpdate();
    }

    public onClearExplorerSelections(event: Event | null = null): void {
        this.buildingExplorer!.clearSelections();
    }

    public onExplorerItemClick(event: BasePlannerNodeEvent | null = null): void {
        this.removeSelection();
        this.designView!.addInventoryItem(event!.node);
        this.changedPlannerData();
        this.onToolUpdate();
    }

    public onDesignItemPlace(event: BasePlannerNodeEvent | null = null): void {
        this.buildingExplorer!.removeBuilding(event!);
        this.changedPlannerData();
    }

    public onDesignItemStore(event: BasePlannerNodeEvent | null = null): void {
        this.buildingExplorer!.addElement(event!.node);
        this.designView!.spliceDisplayData(event!.node);
        this.changedPlannerData();
    }

    public onDesignItemInvalid(event: BasePlannerNodeEvent | null = null): void {
        this.buildingExplorer!.clearSelections();
    }

    public changedPlannerData(): void {
        this.canApply = this.checkIfApplicable();
    }

    public onDesignStateChange(event: Event | null = null): void {
        this.hasBeenSaved = false;
    }

    public Remove(): void {
        if (this.designView) {
            this.designView.remove();
            this.displayCanvas!.canvas.removeChild(this.designView);
            this.designView = null;
        }
        if (this.displayCanvas) {
            this.removeChild(this.displayCanvas);
            this.displayCanvas = null;
        }
        if (this.buildingExplorer) {
            this.buildingExplorer.clear();
            this.sideBar!.canvas.removeChild(this.buildingExplorer);
            this.buildingExplorer = null;
        }
        if (this.sideBar) {
            this.removeChild(this.sideBar);
            this.sideBar = null;
        }
        if (this.mcFrame) {
            (this.mcFrame as frame).Clear();
            this.mcFrame = null;
        }
    }

    public Hide(event: MouseEvent | null = null): void {
        if (!this.hasBeenSaved && BasePlanner.canSave) {
            if (this._confirmationPopup) {
                return;
            }
            this._confirmationPopup = new BasePlannerTransferConfirmation();
            this._confirmationPopup.tBody.htmlText = KEYS.Get("basePlanner_unsaved");
            this._confirmationPopup.bCancel.SetupKey("basePlanner_btnDiscard");
            this._confirmationPopup.bCancel.addEventListener(MouseEvent.CLICK, this.clickedDiscardInConfirmation.bind(this), false, 0, true);
            this._confirmationPopup.bConfirm.addEventListener(MouseEvent.CLICK, this.clickedSaveInConfirmation.bind(this), false, 0, true);
            this._confirmationPopup.addEventListener(Event.CLOSE, this.clickedCloseInConfirmation.bind(this), false, 0, true);
            POPUPS.Add(this._confirmationPopup);
            POPUPSETTINGS.AlignToCenter(this._confirmationPopup);
        } else {
            PLANNER.Hide();
        }
    }

    protected clickedCloseInConfirmation(event: Event): void {
        this.removeConfirmationPopup();
    }

    private removeConfirmationPopup(): void {
        POPUPS.Remove(this._confirmationPopup);
        this._confirmationPopup = null;
    }

    protected clickedDiscardInConfirmation(event: Event): void {
        PLANNER.Hide();
        this.removeConfirmationPopup();
    }

    protected clickedSaveInConfirmation(event: Event): void {
        this.removeConfirmationPopup();
        this.dispatchEvent(new BasePlannerEvent(BasePlannerEvent.SAVE));
    }

    public Resize(): void {
        this.configPopupTemplate(GLOBAL._SCREEN.width - 30, GLOBAL._SCREEN.height - 30);
        this.x = GLOBAL._SCREENCENTER.x + -(this._mcFrame!.width / 2) + 10;
        this.y = GLOBAL._SCREENCENTER.y + -(this._mcFrame!.height / 2) + 10;
    }

    public debugBreakTrace(): void {
    }

    public get hasBeenSaved(): boolean {
        return this._hasBeenSaved;
    }

    public set hasBeenSaved(value: boolean) {
        this._hasBeenSaved = value;
        if (value) {
            this._bSave.Enabled = !BASE.isOutpost;
            this._bSave.enabled = !BASE.isOutpost;
            this._bSave.mouseEnabled = !BASE.isOutpost;
        } else {
            this._bSave.Enabled = BasePlanner.canSave;
            this._bSave.enabled = BasePlanner.canSave;
            this._bSave.mouseEnabled = BasePlanner.canSave;
        }
    }
}
