import Event from "openfl/events/Event";

import { BaseTemplate } from "../BaseTemplate";

/**
 * Base planner service event - event for template list loading.
 */
export class BasePlannerServiceEvent extends Event {
    public static readonly LOADED_TEMPLATES_LIST: string = "loadedTemplateList";

    private _templatesList: Array<BaseTemplate | null>;

    constructor(type: string, templatesList: Array<BaseTemplate | null>) {
        super(type);
        this._templatesList = templatesList;
    }

    public get templatesList(): Array<BaseTemplate | null> {
        return this._templatesList;
    }
}
