import { Solution } from "./Solution";
import { BFOUNDATION } from "../../../BFOUNDATION";

/**
 * Interface for AI attack processes/strategies.
 */
export interface IPROCESS {
    Trigger(intensity?: number): void;
    
    Process(solution: Solution, callback: Function): void;
    
    onProcess(data: any[], targetBuilding?: BFOUNDATION | null, value?: number, flag?: boolean, secondaryBuilding?: BFOUNDATION | null): void;
    
    beginProcessB(): void;
    
    ProcessB(solution: Solution): void;
    
    ProcessC(solution: Solution): void;
}
