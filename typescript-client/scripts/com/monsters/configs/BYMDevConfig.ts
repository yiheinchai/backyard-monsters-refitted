import { BYMConfig } from "./BYMConfig";

/**
 * Development configuration extending BYMConfig.
 */
export class BYMDevConfig extends BYMConfig {
    public static get instance(): BYMConfig {
        if (!(BYMConfig as any)._instance) {
            (BYMConfig as any)._instance = new BYMDevConfig();
        }
        return (BYMConfig as any)._instance;
    }
}
