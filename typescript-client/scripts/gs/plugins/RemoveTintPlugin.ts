import { TintPlugin } from "./TintPlugin";

/**
 * RemoveTintPlugin - Removes a tint from a DisplayObject.
 */
export class RemoveTintPlugin extends TintPlugin {
    public static readonly VERSION: number = 1.01;
    public static readonly API: number = 1;

    constructor() {
        super();
        this.propName = "removeTint";
    }
}
