import { Boot } from './flash/Boot';

// Note: This file is an obfuscated/generated Haxe enum representation
export class Void {
    public static readonly __isenum: boolean = true;
    public static __constructs__: any[] = [];

    public tag: string;
    public index: number;
    public params: any[];
    public readonly __enum__: boolean = true;

    constructor(param1: string, param2: number, param3: any) {
        this.tag = param1;
        this.index = param2;
        this.params = param3;
    }

    public toString(): string {
        return Boot.enum_to_string(this);
    }
}
