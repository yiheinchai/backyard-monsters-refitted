import { ITargetable } from "../interfaces/ITargetable";

/**
 * Dummy target implementation - used when real target becomes invalid.
 */
export class DummyTarget implements ITargetable {
    private m_x: number;
    private m_y: number;

    constructor(x: number, y: number) {
        this.m_x = x;
        this.m_y = y;
    }

    public get x(): number {
        // Note: Original AS3 code returns m_y here, might be a bug in original
        return this.m_y;
    }

    public get y(): number {
        return this.m_y;
    }

    public get defenseFlags(): number {
        return 0;
    }
}
