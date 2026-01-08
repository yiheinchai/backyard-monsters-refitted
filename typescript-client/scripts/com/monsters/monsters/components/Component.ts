import { ITickable } from "../../interfaces/ITickable";
import { MonsterBase } from "../MonsterBase";

/**
 * Base component that can be attached to a MonsterBase.
 */
export class Component implements ITickable {
    public owner: MonsterBase | null = null;
    public name: string = "";
    public priority: number = 0;

    constructor() {}

    public register(owner: MonsterBase, name: string = ""): void {
        if (!name) {
            name = this.constructor.name;
        }
        this.name = name;
        this.owner = owner;
        this.onRegister();
    }

    public unregister(): void {
        if (!this.owner) return;
        this.onUnregister();
        this.owner = null;
        this.name = "";
    }

    protected onUnregister(): void {}
    protected onRegister(): void {}

    public tick(ticks: number = 1): void {}

    public destroy(): void {}

    public clone(): Component {
        const comp = new Component();
        comp.name = this.name;
        comp.priority = this.priority;
        comp.owner = this.owner;
        return comp;
    }
}
