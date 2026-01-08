import { BaseBuff } from "../BaseBuff";
import { IPropertyModifier } from "../../interfaces/IPropertyModifier";

/**
 * Resource capacity base buff - increases resource storage capacity.
 */
export class ResourceCapacityBaseBuff extends BaseBuff {
    public static readonly ID: number = 10;
    public static readonly k_NAME: string = "Resource Capacity";

    private m_capacityModifier: IPropertyModifier | null = null;

    constructor() {
        super(ResourceCapacityBaseBuff.k_NAME, "bufficons/resourcebuff.png");
    }

    public override get description(): string {
        return "";
    }

    public get value(): number {
        return this.getValue();
    }

    public override apply(): void {
        // Empty implementation
    }

    public override clear(): void {
        // Empty implementation
    }
}
