import Point from "openfl/geom/Point";

import { Component } from "../Component";

// Lazy imports to break circular dependency chains
function getTargeting(): any { return require("../../../../../Targeting").Targeting; }
function getBTOWER(): any { return require("../../../../../BTOWER").BTOWER; }



/**
 * Tower taunt - ability that forces nearby towers to target this creature.
 */
export class TowerTaunt extends Component {
    protected m_radius: number;

    constructor(radius: number = 500) {
        super();
        this.m_radius = radius;
    }

    public override tick(delta: number = 1): void {
        const buildings: Array<any> = getTargeting().getBuildingsInRange(this.m_radius, new Point(this.owner.x, this.owner.y));
        for (let i = 0; i < buildings.length; i++) {
            if (buildings[i] instanceof getBTOWER()) {
                const tower = buildings[i].creep as BTOWER;
                tower.setTarget(this.owner);
            }
        }
    }
}
