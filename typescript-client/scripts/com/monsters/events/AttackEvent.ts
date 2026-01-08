 import { Event } from "openfl/events/Event";

/**
 * Event dispatched when an attack ends.
 */
export class AttackEvent extends Event {
    public static readonly ATTACK_OVER: string = "attackOver";

    private _attackType: number;
    private _loot: { [key: string]: any };
    private _wasBaseDestroyed: boolean;

    constructor(type: string, wasBaseDestroyed: boolean, attackType: number, loot: { [key: string]: any }) {
        super(type);
        this._attackType = attackType;
        this._wasBaseDestroyed = wasBaseDestroyed;
        this._loot = loot;
    }

    public get wasBaseDestroyed(): boolean {
        return this._wasBaseDestroyed;
    }

    public get attackType(): number {
        return this._attackType;
    }

    public get loot(): { [key: string]: any } {
        return this._loot;
    }
}
