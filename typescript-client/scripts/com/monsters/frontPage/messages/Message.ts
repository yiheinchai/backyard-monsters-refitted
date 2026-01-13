import MovieClip from "openfl/display/MovieClip";
import MouseEvent from "openfl/events/MouseEvent";

import { FrontPageHandler } from "../FrontPageHandler";
import { Category } from "../categories/Category";
import { Button } from "../../../../Button";

import { BASE } from "../../../../BASE";
import { BFOUNDATION } from "../../../../BFOUNDATION";
import { BUILDINGS } from "../../../../BUILDINGS";
import { BUILDINGOPTIONS } from "../../../../BUILDINGOPTIONS";
import { GLOBAL } from "../../../../GLOBAL";
import { KEYS } from "../../../../KEYS";
import { LOGGER } from "../../../../LOGGER";
import { POPUPS } from "../../../../POPUPS";

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
        this.title = KEYS.Get(titleKey);
        this.body = KEYS.Get(bodyKey, this._bodyArguments);
        if (imageName) {
            this.imageURL = Message._IMAGE_DIRECTORY + imageName;
        }
        this.videoURL = videoUrl || "";
        if (buttonKey) {
            this._buttonCopy = KEYS.Get(buttonKey);
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
        this.timeLastSeen = GLOBAL.Timestamp();
        this.onView();
    }

    protected clickedButton(event: MouseEvent): void {
        const mc = event.currentTarget as MovieClip;
        LOGGER.StatB({
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
            this.timeLastSeen = GLOBAL.Timestamp();
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
            FrontPageHandler.closeAll();
        }
        BUILDINGS._buildingID = buildingType;
        BUILDINGS.Show();
    }

    public buyMenu(tab1: number = 1, tab2: number = 1, tab3: number = 0): void {
        BUILDINGS.Show();
        BUILDINGS._mc.SwitchB(tab1, tab2, tab3);
        POPUPS.Next();
    }

    public upgradeBuilding(buildingType: number): void {
        FrontPageHandler.closeAll();
        const building = BASE.findBuilding(buildingType);
        if (building) {
            BUILDINGOPTIONS.Show(building, "upgrade");
        } else {
            this.buyBuilding(buildingType);
        }
    }

    public markAsUnseenIfOlderThan(ageSeconds: number): void {
        if (GLOBAL.Timestamp() - this.timeLastSeen >= ageSeconds) {
            this.timeLastSeen = 0;
        }
    }
}
