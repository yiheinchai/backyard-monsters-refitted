import Event from "openfl/events/Event";

import { PlannerNode } from "../PlannerNode";

/**
 * Base planner node event - event with planner node data.
 */
export class BasePlannerNodeEvent extends Event {
    private _node: PlannerNode;

    constructor(type: string, node: PlannerNode) {
        super(type);
        this._node = node;
    }

    public get node(): PlannerNode {
        return this._node;
    }
}
