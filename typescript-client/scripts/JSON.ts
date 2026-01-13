import { decodeJson } from './com/brokenfunction/json/decodeJson';
import { encodeJson } from './com/brokenfunction/json/encodeJson';

export class JSON {
    constructor() {
    }

    public static decode(param1: string): any {
        return decodeJson(param1);
    }

    public static encode(param1: any): string {
        return encodeJson(param1, null, true);
    }
}
