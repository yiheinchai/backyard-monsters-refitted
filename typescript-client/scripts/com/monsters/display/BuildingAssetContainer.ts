import { MovieClip } from "openfl/display/MovieClip";

/**
 * Container for building assets that can be cleared.
 */
export class BuildingAssetContainer extends MovieClip {
    constructor() {
        super();
        this.Clear();
    }

    public Clear(): void {
        while (this.numChildren > 0) {
            this.removeChildAt(0);
        }
    }
}
