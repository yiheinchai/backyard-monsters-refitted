import { SpurtzCannon } from './SpurtzCannon';

/**
 * BlackSpurtzCannon - Black Spurtz Cannon building class
 * Extends SpurtzCannon with a specific type
 * Converted from ActionScript to TypeScript
 */
export class BlackSpurtzCannon extends SpurtzCannon {
    public static readonly TYPE: number = 137;

    constructor() {
        super(BlackSpurtzCannon.TYPE);
    }
}
