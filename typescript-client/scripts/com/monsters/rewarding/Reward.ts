import { IExportable } from "../interfaces/IExportable";

/**
 * Base reward class - represents a reward that can be applied to the player.
 */
export class Reward implements IExportable {
    public id: string = "";
    protected _hasBeenApplied: boolean = false;
    protected _name: string = "";
    protected _description: string = "";
    protected _value: number = 0;

    constructor() {}

    /**
     * Apply the reward to the player.
     * @internal
     */
    public applyReward(): boolean {
        if (!this.canBeApplied()) {
            return false;
        }
        this._hasBeenApplied = true;
        this.onApplication();
        return true;
    }

    /**
     * Check if the reward can be applied.
     */
    public canBeApplied(): boolean {
        return true;
    }

    /**
     * Called when the reward is applied.
     */
    protected onApplication(): void {
        // Override in subclasses
    }

    public set value(val: number) {
        this._value = val;
    }

    public get value(): any {
        return this._value;
    }

    public get description(): string {
        return this._description;
    }

    public get name(): string {
        return this._name;
    }

    public exportData(): any {
        const data: any = {};
        data["id"] = this.id;
        if (this.value) {
            data["value"] = this.value;
        }
        return data;
    }

    public importData(data: any): void {
        this.id = data["id"];
        if (data["value"]) {
            this._value = data["value"];
        }
    }

    public removed(): void {
        // Override in subclasses
    }

    public reset(): void {
        // Override in subclasses
    }

    public get hasBeenApplied(): boolean {
        return this._hasBeenApplied;
    }
}
