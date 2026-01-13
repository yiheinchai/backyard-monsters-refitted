/**
 * Base buff - base class for all base buffs.
 */
export class BaseBuff {
    protected _value: number = 0;
    protected m_id: number = 0;
    protected m_name: string;
    protected m_imageURL: string;

    constructor(name: string = "", imageURL: string = "") {
        this.m_name = name;
        this.m_imageURL = imageURL;
    }

    public get value(): number {
        return this._value;
    }

    public set value(val: number) {
        this._value = val;
    }

    public get description(): string {
        return "";
    }

    public get id(): number {
        return this.m_id;
    }

    public set id(value: number) {
        this.m_id = value;
    }

    public get name(): string {
        return this.m_name;
    }

    public get imageURL(): string {
        return this.m_imageURL;
    }

    public apply(): void {
        // Override in subclasses
    }

    public clear(): void {
        // Override in subclasses
    }

    protected getValue(): number {
        return this._value;
    }
}
