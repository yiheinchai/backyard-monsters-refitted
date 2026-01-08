import { BaseBuff } from "../BaseBuff";

/**
 * Auto bank base buff - enables automatic resource banking.
 */
export class AutoBankBaseBuff extends BaseBuff {
    public static readonly ID: number = 2;
    public static readonly k_NAME: string = "AutoBank";

    constructor() {
        super(AutoBankBaseBuff.k_NAME, "bufficons/resourcebuff.png");
    }

    public override get description(): string {
        return "";
    }

    public get value(): number {
        return this.getValue();
    }
}
