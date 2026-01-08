import { Point } from "openfl/geom/Point";
import { Rectangle } from "openfl/geom/Rectangle";

import { InstanceManager } from "../managers/InstanceManager";
import { PATHING } from "../pathing/PATHING";
import { IPROCESS } from "./IPROCESS";
import { Solution } from "./Solution";

import { BASE } from "../../../BASE";
import { BFOUNDATION } from "../../../BFOUNDATION";
import { BTOWER } from "../../../BTOWER";
import { BTRAP } from "../../../BTRAP";
import { CREATURELOCKER } from "../../../CREATURELOCKER";
import { GLOBAL } from "../../../GLOBAL";
import { GRID } from "../../../GRID";
import { WMATTACK } from "../../../WMATTACK";

/**
 * PROCESS_INFERNO1 - AI attack strategy for Inferno world.
 * Targets non-defensive buildings with Inferno-specific creatures.
 */
export class PROCESS_INFERNO1 implements IPROCESS {
    public _solutions: Solution[] = [];
    private solsProcessed: number = 0;
    public _inProgress: boolean = false;
    public _intelligence: number = 1;
    private processStepResolution: number = 3;

    constructor() {}

    public Trigger(intelligence: number = 1): void {
        this._intelligence = intelligence;
        this._inProgress = true;
        this._solutions = [];
        const mapWidth = GLOBAL._mapWidth;
        const mapHeight = GLOBAL._mapHeight;
        
        for (let i = 0; i < WMATTACK._attackResolution; i++) {
            this._solutions.push(new Solution(360 / WMATTACK._attackResolution * i, mapWidth, mapHeight));
        }
        
        this.solsProcessed = 0;
        this.Process(this._solutions[0], this.onProcess.bind(this));
    }

    public Process(solution: Solution, callback: Function): void {
        const buildings: { building: BFOUNDATION; distance: number }[] = [];
        const allBuildings = InstanceManager.getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        
        for (const building of allBuildings) {
            // Target non-tower, non-trap buildings
            if (building.health > 0 && !(building as any)._looted && 
                !(building instanceof BTOWER) && !(building instanceof BTRAP)) {
                const pos = GRID.FromISO(building.x, building.y);
                const distance = Point.distance(solution.entryPoint, pos);
                buildings.push({
                    building: building,
                    distance: distance
                });
            }
        }
        
        if (buildings.length > 0) {
            buildings.sort((a, b) => a.distance - b.distance);
            solution.targetBuilding = buildings[0].building;
            solution.targetHP += solution.targetBuilding._hp.Get();
            if (solution.targetHP > 50000) {
                solution.targetHP = 50000;
            }
            solution.wayPoints = PATHING.GetPath(
                GRID.ToISO(solution.entryPoint.x, solution.entryPoint.y, 0),
                new Rectangle(
                    solution.targetBuilding.x,
                    solution.targetBuilding.y,
                    solution.targetBuilding._footprint[0].width,
                    solution.targetBuilding._footprint[0].height
                ),
                callback
            );
        }
    }

    public onProcess(wayPoints: any[], targetBuilding: BFOUNDATION | null = null, value: number = 0, flag: boolean = false, secondaryBuilding: BFOUNDATION | null = null): void {
        this._solutions[this.solsProcessed].wayPoints = wayPoints;
        this._solutions[this.solsProcessed].distanceToTarget = wayPoints.length;
        this.solsProcessed++;
        
        if (this.solsProcessed < WMATTACK._attackResolution) {
            this.Process(this._solutions[this.solsProcessed], this.onProcess.bind(this));
        } else {
            this.beginProcessB();
        }
    }

    public beginProcessB(): void {
        const sortedSolutions: Solution[] = [];
        
        for (const solution of this._solutions) {
            this.ProcessB(solution);
            sortedSolutions.push(solution);
        }
        
        // Sort by damageTaken (desc), distanceToTarget (desc), targetHP (asc)
        sortedSolutions.sort((a, b) => {
            if (b.damageTaken !== a.damageTaken) return b.damageTaken - a.damageTaken;
            if (b.distanceToTarget !== a.distanceToTarget) return b.distanceToTarget - a.distanceToTarget;
            return a.targetHP - b.targetHP;
        });
        
        const chosenIndex = Math.floor((sortedSolutions.length - 1) * this._intelligence);
        this.ProcessC(sortedSolutions[chosenIndex]);
        this._inProgress = false;
        WMATTACK.Queue(sortedSolutions[chosenIndex]);
    }

    public ProcessB(solution: Solution): void {
        if (solution.wayPoints) {
            for (let i = 0; i < solution.wayPoints.length; i += this.processStepResolution) {
                solution.damageTaken += WMATTACK._damageBias * this.processStepResolution * WMATTACK.dpsAtPoint(solution, solution.wayPoints[i]);
            }
        }
    }

    public ProcessC(solution: Solution): void {
        const attack: { [key: string]: number } = {};
        
        for (let i = 0; i < WMATTACK._monsterKeys.length; i++) {
            attack[WMATTACK._monsterKeys[i]] = 0;
        }
        
        const allBuildings = InstanceManager.getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        let volume = 0;
        
        for (const building of allBuildings) {
            const buildingClass = (building as any)._class;
            const multiplier = (buildingClass === "trap" || buildingClass === "wall") ? 0.15 : 1;
            volume += multiplier * WMATTACK._attackVolumeAmplifier;
        }
        
        const intelligenceModifier = this._intelligence * 0.5 + 0.5;
        volume = Math.floor(volume * intelligenceModifier);
        
        const ratio = 2;
        const tankRatio = 0.25;
        const tankCount = volume * tankRatio;
        const dpsCount = tankCount / ratio;
        const hunterCount = volume - (tankCount + dpsCount);
        
        let levelRatio = BASE.BaseLevel().level / 40;
        if (levelRatio < 0) levelRatio = 0;
        if (levelRatio > 1) levelRatio = 1;
        
        const anythingType = String(WMATTACK._infernoAnything[Math.floor((WMATTACK._infernoAnything.length - 1) * levelRatio)]);
        const tankType = String(WMATTACK._infernoTanks[Math.floor((WMATTACK._tanks.length - 1) * levelRatio)]);
        const dpsType = String(WMATTACK._infernoDps[Math.floor((WMATTACK._dps.length - 1) * levelRatio)]);
        const hunterType = String(WMATTACK._infernoHunters[Math.floor((WMATTACK._infernoHunters.length - 1) * levelRatio)]);
        
        let travelTime = 0;
        const distances: { [key: string]: number } = {};
        const baseDistance = GLOBAL._mapWidth * 0.25;
        const minDistance = 100;
        const targetDistance = Point.distance(solution.entryPoint, new Point(solution.targetBuilding.x, solution.targetBuilding.y));
        const adjustedDistance = targetDistance < minDistance ? baseDistance + (minDistance - targetDistance) : baseDistance;
        
        if (tankCount >= 1) {
            if (travelTime === 0) {
                travelTime = adjustedDistance / CREATURELOCKER._creatures[tankType].props.speed[0];
            }
            distances[tankType] = travelTime * CREATURELOCKER._creatures[tankType].props.speed[0];
        }
        
        if (dpsCount >= 1) {
            if (travelTime === 0) {
                travelTime = adjustedDistance / CREATURELOCKER._creatures[dpsType].props.speed[0];
            }
            distances[dpsType] = travelTime * CREATURELOCKER._creatures[dpsType].props.speed[0];
        }
        
        if (hunterCount >= 1) {
            if (travelTime === 0) {
                travelTime = adjustedDistance / CREATURELOCKER._creatures[hunterType].props.speed[0];
            }
            distances[hunterType] = travelTime * CREATURELOCKER._creatures[hunterType].props.speed[0];
        }
        
        attack[tankType] = Math.floor(tankCount);
        if (tankType === dpsType) {
            attack[tankType] += Math.floor(dpsCount);
        } else {
            attack[dpsType] = Math.floor(dpsCount);
        }
        if (tankType === hunterType) {
            attack[tankType] += Math.floor(hunterCount);
        } else {
            attack[hunterType] = Math.floor(hunterCount);
        }
        
        const tanks: { [key: string]: number } = {};
        tanks[tankType] = Math.floor(tankCount);
        
        const dps: { [key: string]: number } = {};
        dps[dpsType] = Math.floor(dpsCount);
        
        const anything: { [key: string]: number } = {};
        anything[hunterType] = Math.floor(hunterCount);
        
        // Remove zero counts
        for (const key in attack) {
            if (attack[key] === 0) {
                delete attack[key];
            }
        }
        
        solution.attack = attack;
        solution.tanks = tanks;
        solution.dps = dps;
        solution.anything = anything;
        solution.distances = distances;
    }
}
