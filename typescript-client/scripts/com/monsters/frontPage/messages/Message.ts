import MovieClip from "openfl/display/MovieClip";
import MouseEvent from "openfl/events/MouseEvent";

import { Category } from "../categories/Category";
import { Button } from "../../../../Button";

// Lazy imports to break circular dependency chains
function getFrontPageHandler(): any { return require("../FrontPageHandler").FrontPageHandler; }
function getBASE(): any { return require("../../../../BASE").BASE; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }
function getBUILDINGS(): any { return require("../../../../BUILDINGS").BUILDINGS; }
function getBUILDINGOPTIONS(): any { return require("../../../../BUILDINGOPTIONS").BUILDINGOPTIONS; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getLOGGER(): any { return require("../../../../LOGGER").LOGGER; }
function getPOPUPS(): any { return require("../../../../POPUPS").POPUPS; }



/**
 * Message - base class for front page messages/notifications.
 */
export class Message {
    protected static readonly _IMAGE_DIRECTORY: string = "popups/front_page/";

    public name: string = "";
    public title: string = "";
    public body: string = "";
    public imageURL: string = "";
    public videoURL: string = "";
    public timeLastSeen: number = 0;
    public category: Category | null = null;
    protected _doesSave: boolean = true;
    protected _buttonCopy: string = "";
    protected _bodyArguments: Record<string, any> | null = null;

    constructor(titleKey: string, bodyKey: string, imageName: string | null = null, buttonKey: string | null = null, videoUrl: string | null = null) {
        this.title = getKEYS().Get(titleKey);
        this.body = getKEYS().Get(bodyKey, this._bodyArguments);
        if (imageName) {
            this.imageURL = Message._IMAGE_DIRECTORY + imageName;
        }
        this.videoURL = videoUrl || "";
        if (buttonKey) {
            this._buttonCopy = getKEYS().Get(buttonKey);
        }
        this.name = titleKey;
    }

    public get hasBeenSeen(): boolean {
        return Boolean(this.timeLastSeen);
    }

    public get areRequirementsMet(): boolean {
        return true;
    }

    public setupButton(button: Button): Button {
        if (!this._buttonCopy) {
            button.visible = false;
            return button;
        }
        button.Highlight = true;
        button.Setup(this._buttonCopy);
        button.removeEventListener(MouseEvent.CLICK, this.clickedButton.bind(this));
        button.addEventListener(MouseEvent.CLICK, this.clickedButton.bind(this), false, 0, false);
        return button;
    }

    public viewed(): void {
        this.timeLastSeen = getGLOBAL().Timestamp();
        this.onView();
    }

    protected clickedButton(event: MouseEvent): void {
        const mc = event.currentTarget as MovieClip;
        getLOGGER().StatB({
            "st1": "GTP",
            "st2": "CTA",
            "value": 1
        }, this._buttonCopy);
        mc.removeEventListener(MouseEvent.CLICK, this.clickedButton.bind(this));
        this.onButtonClick();
    }

    public refresh(): void {
    }

    protected onButtonClick(): void {
    }

    protected onView(): void {
    }

    public setup(data: Record<string, any>): void {
        if (!data) {
            return;
        }
        if (data.seen === 1) {
            this.timeLastSeen = getGLOBAL().Timestamp();
        } else {
            this.timeLastSeen = data.seen;
        }
    }

    public export(): Record<string, any> | null {
        if (!this.timeLastSeen || !this._doesSave) {
            return null;
        }
        return {
            "name": this.name,
            "seen": this.timeLastSeen
        };
    }

    public buyBuilding(buildingType: number, closeFrontPage: boolean = true): void {
        if (closeFrontPage) {
            getFrontPageHandler().closeAll();
        }
        getBUILDINGS()._buildingID = buildingType;
        getBUILDINGS().Show();
    }

    public buyMenu(tab1: number = 1, tab2: number = 1, tab3: number = 0): void {
        getBUILDINGS().Show();
        getBUILDINGS()._mc.SwitchB(tab1, tab2, tab3);
        getPOPUPS().Next();
    }

    public upgradeBuilding(buildingType: number): void {
        getFrontPageHandler().closeAll();
        const building = getBASE().findBuilding(buildingType);
        if (building) {
            getBUILDINGOPTIONS().Show(building, "upgrade");
        } else {
            this.buyBuilding(buildingType);
        }
    }

    public markAsUnseenIfOlderThan(ageSeconds: number): void {
        if (getGLOBAL().Timestamp() - this.timeLastSeen >= ageSeconds) {
            this.timeLastSeen = 0;
        }
    }
}
