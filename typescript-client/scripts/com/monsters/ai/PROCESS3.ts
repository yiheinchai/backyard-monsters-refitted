import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

import { IPROCESS } from "./IPROCESS";
import { Solution } from "./Solution";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../managers/InstanceManager").InstanceManager; }
function getPATHING(): any { return require("../pathing/PATHING").PATHING; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getBFOUNDATION(): any { return require("../../../BFOUNDATION").BFOUNDATION; }
function getBRESOURCE(): any { return require("../../../BRESOURCE").BRESOURCE; }
function getBTOWER(): any { return require("../../../BTOWER").BTOWER; }
function getBTRAP(): any { return require("../../../BTRAP").BTRAP; }
function getBWALL(): any { return require("../../../BWALL").BWALL; }
function getCREATURELOCKER(): any { return require("../../../CREATURELOCKER").CREATURELOCKER; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getGRID(): any { return require("../../../GRID").GRID; }
function getWMATTACK(): any { return require("../../../WMATTACK").WMATTACK; }



/**
 * PROCESS3 - AI attack strategy targeting towers (Legionnaire tribe).
 * Calculates optimal attack solutions by analyzing tower positions.
 */
export class PROCESS3 implements IPROCESS {
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
        const mapWidth = getGLOBAL()._mapWidth;
        const mapHeight = getGLOBAL()._mapHeight;
        
        for (let i = 0; i < getWMATTACK()._attackResolution; i++) {
            const solution = new Solution(360 / getWMATTACK()._attackResolution * i, mapWidth, mapHeight);
            this._solutions.push(solution);
        }
        
        this.solsProcessed = 0;
        this.Process(this._solutions[0], this.onProcess.bind(this));
    }

    public Process(solution: Solution, callback: Function): void {
        const towers: { building: BFOUNDATION; distance: number }[] = [];
        const towerInstances = getInstanceManager().getInstancesByClass(BTOWER) as BFOUNDATION[];
        
        for (const tower of towerInstances) {
            if (tower.health > 0) {
                const pos = getGRID().FromISO(tower.x, tower.y);
                const distance = Point.distance(solution.entryPoint, pos);
                towers.push({
                    building: tower,
                    distance: distance
                });
            }
        }
        
        if (towers.length > 0) {
            towers.sort((a, b) => a.distance - b.distance);
            solution.targetBuilding = towers[0].building;
            solution.wayPoints = getPATHING().GetPath(
                getGRID().ToISO(solution.entryPoint.x, solution.entryPoint.y, 0),
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
        
        if (this.solsProcessed < getWMATTACK()._attackResolution) {
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
        
        // Sort by damageTaken (descending), then distanceToTarget (descending)
        sortedSolutions.sort((a, b) => {
            if (b.damageTaken !== a.damageTaken) {
                return b.damageTaken - a.damageTaken;
            }
            return b.distanceToTarget - a.distanceToTarget;
        });
        
        const chosenIndex = Math.floor((sortedSolutions.length - 1) * this._intelligence);
        this.ProcessC(sortedSolutions[chosenIndex]);
        this._inProgress = false;
        getWMATTACK().Queue(sortedSolutions[chosenIndex]);
    }

    public ProcessB(solution: Solution): void {
        if (!solution.wayPoints) return;
        
        for (let i = 0; i < solution.wayPoints.length; i += this.processStepResolution) {
            solution.damageTaken += getWMATTACK()._damageBias * this.processStepResolution * getWMATTACK().dpsAtPoint(solution, solution.wayPoints[i]);
        }
    }

    public ProcessC(solution: Solution): void {
        const attack: { [key: string]: number } = {};
        
        for (let i = 0; i < getWMATTACK()._monsterKeys.length; i++) {
            attack[getWMATTACK()._monsterKeys[i]] = 0;
        }
        
        const buildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        let volume = 0;
        
        for (const building of buildings) {
            if ((building as any)._class === "special" || 
                building instanceof getBTOWER() || 
                building instanceof getBTRAP() || 
                building instanceof getBWALL() || 
                building instanceof getBRESOURCE()) {
                const multiplier = (building instanceof getBTRAP() || building instanceof getBWALL()) ? 0.13 : 1;
                volume += multiplier * getWMATTACK()._attackVolumeAmplifier;
            }
        }
        
        const intelligenceModifier = this._intelligence * 0.5 + 0.5;
        volume = Math.floor(volume * intelligenceModifier);
        const ratio = 2;
        const tankCount = volume / (ratio + 1);
        const dpsCount = tankCount / ratio;
        
        let levelRatio = getBASE().BaseLevel().level / 40;
        if (levelRatio < 0) levelRatio = 0;
        if (levelRatio > 1) levelRatio = 1;
        
        const tankType = String(getWMATTACK()._tanks[Math.floor((getWMATTACK()._tanks.length - 1) * levelRatio)]);
        const dpsType = String(getWMATTACK()._dps[Math.floor((getWMATTACK()._dps.length - 1) * levelRatio)]);
        
        let travelTime = 0;
        const distances: { [key: string]: number } = {};
        const baseDistance = getGLOBAL()._mapWidth * 0.25;
        const minDistance = 100;
        const targetDistance = Point.distance(solution.entryPoint, new Point(solution.targetBuilding.x, solution.targetBuilding.y));
        const adjustedDistance = targetDistance < minDistance ? baseDistance + (minDistance - targetDistance) : baseDistance;
        
        if (tankCount >= 1) {
            if (travelTime === 0) {
                travelTime = adjustedDistance / getCREATURELOCKER()._creatures[tankType].props.speed[0];
            }
            distances[tankType] = travelTime * getCREATURELOCKER()._creatures[tankType].props.speed[0];
        }
        
        if (dpsCount >= 1) {
            if (travelTime === 0) {
                travelTime = adjustedDistance / getCREATURELOCKER()._creatures[dpsType].props.speed[0];
            }
            distances[dpsType] = 25 + travelTime * getCREATURELOCKER()._creatures[dpsType].props.speed[0];
        }
        
        let finalTankCount = tankCount;
        if (tankType === "C12") {
            finalTankCount = Math.ceil(tankCount / 2);
        }
        
        attack[tankType] = Math.floor(finalTankCount);
        attack[dpsType] = Math.floor(dpsCount);
        
        const tanks: { [key: string]: number } = {};
        tanks[tankType] = Math.floor(finalTankCount);
        
        const dps: { [key: string]: number } = {};
        dps[dpsType] = Math.floor(dpsCount);
        
        // Remove zero counts
        for (const key in attack) {
            if (attack[key] === 0) {
                delete attack[key];
            }
        }
        
        solution.attack = attack;
        solution.tanks = tanks;
        solution.dps = dps;
        solution.distances = distances;
    }
}
