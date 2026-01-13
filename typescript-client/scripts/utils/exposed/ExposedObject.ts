import { ExposedStructure } from "./ExposedStructure";
import { Warning } from "../debug/Warning";

/**
 * ExposedObject - An ExposedStructure with an ID for reference resolution.
 */
export class ExposedObject extends ExposedStructure {
    protected m_Id: string = "";

    constructor() {
        super();
    }

    public get id(): string {
        return this.m_Id;
    }

    public set id(value: string) {
        this.m_Id = value;
    }

    public override LoadState(state: any, exposedFor: string): void {
        const stateId = state?.id || "";
        if (this.m_Id && this.m_Id !== stateId) {
            Warning.Show("Trying to load object with id '" + this.m_Id + "' from state with id '" + stateId + "'", ExposedObject);
            return;
        }
        super.LoadState(state, exposedFor);
    }

    public override SaveState(exposedFor: string): any {
        const state = super.SaveState(exposedFor);
        state.nodeName = "object";
        state.id = this.m_Id;
        return state;
    }
}
