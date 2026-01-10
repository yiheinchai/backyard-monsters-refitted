import BitmapData from "openfl/display/BitmapData";
import DisplayObject from "openfl/display/DisplayObject";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

import { InstanceManager } from "../managers/InstanceManager";
import { PATHINGobject } from "./PATHINGobject";
import { PATHINGfloodobject } from "./PATHINGfloodobject";

import { BFOUNDATION } from "../../../BFOUNDATION";
import { BMUSHROOM } from "../../../BMUSHROOM";
import { GLOBAL } from "../../../GLOBAL";
import { GRID } from "../../../GRID";

/**
 * Pathfinding system using flood fill algorithm.
 * Manages grid-based pathfinding for monsters and creeps.
 */
export class PATHING {
    private static _poolPathing: PATHINGobject[] = [];
    private static _poolPathingB: PATHINGobject[] = [];
    private static _poolPathingLength: number = 0;

    public static floodDisplay: DisplayObject;
    public static floodBMD: BitmapData;
    public static costDisplay: DisplayObject;
    public static costBMD: BitmapData;
    public static pathmc: DisplayObject;

    private static readonly PI: number = Math.PI;
    private static readonly c180PI: number = 180 / Math.PI;
    private static readonly cPI180: number = Math.PI / 180;

    private static _gridWidth: number = 164;
    private static _gridHeight: number = 132;
    private static _floods: { [key: number]: PATHINGfloodobject } = {};
    private static _costs: { [key: number]: PATHINGobject } = {};
    private static _framenumber: number = 0;
    private static _clicked: boolean = false;
    private static _resetRequested: boolean = false;

    constructor() {
        super();
    }

    public static Setup(): void {
        const startTime = Date.now();
        for (let x = 0; x < PATHING._gridWidth; x++) {
            for (let y = 0; y < PATHING._gridHeight; y++) {
                const key = x * 1000 + y;
                const obj = new PATHINGobject();
                obj.pointX = x;
                obj.pointY = y;
                obj.cost = 10;
                PATHING._costs[key] = obj;
            }
        }
        PATHING._poolPathing = [];
        PATHING._poolPathingB = [];
        PATHING._poolPathingLength = 0;
    }

    public static Cost(pos: Point, rect: Rectangle, costChange: number): Rectangle {
        let loc4 = PATHING.FromISO(pos);
        loc4.x += rect.x;
        loc4.y += rect.y;
        const loc5 = PATHING.GlobalLocal(loc4);
        const result = new Rectangle(loc5.x, loc5.y, rect.width * 0.1, rect.height * 0.1);
        
        for (let x = result.x; x < result.x + result.width; x++) {
            for (let y = result.y; y < result.y + result.height; y++) {
                const key = x * 1000 + y;
                if (PATHING._costs[key]) {
                    PATHING._costs[key].cost += costChange;
                    if (PATHING._costs[key].cost < 2) {
                        PATHING._costs[key].cost = 2;
                    }
                }
            }
        }
        return result;
    }

    public static RegisterBuilding(rect: Rectangle, building: BFOUNDATION, register: boolean): void {
        const loc4 = PATHING.GlobalLocal(PATHING.FromISO(new Point(rect.x, rect.y)));
        rect.width *= 0.1;
        rect.height *= 0.1;
        
        for (let x = loc4.x; x < loc4.x + rect.width; x++) {
            for (let y = loc4.y; y < loc4.y + rect.height; y++) {
                const key = x * 1000 + y;
                if (PATHING._costs[key]) {
                    if (register) {
                        PATHING._costs[key].building = building;
                    } else {
                        delete PATHING._costs[key].building;
                    }
                }
            }
        }
    }

    public static Tick(): void {
        if (PATHING._resetRequested) {
            PATHING._resetRequested = false;
            PATHING.Clear();
            
            // Reset all costs
            for (let x = 0; x < PATHING._gridWidth; x++) {
                for (let y = 0; y < PATHING._gridHeight; y++) {
                    PATHING._costs[x * 1000 + y].cost = 10;
                }
            }
            
            // Recalculate costs for all buildings
            const buildings = InstanceManager.getInstancesByClass(BFOUNDATION);
            for (const building of buildings) {
                if (building._gridCost && (building.health > 0 || building instanceof BMUSHROOM)) {
                    for (const gridCost of building._gridCost) {
                        const pos = new Point(building.x, building.y);
                        PATHING.Cost(pos, gridCost[0], gridCost[1]);
                    }
                }
            }
        }
        PATHING.ProcessFlood();
    }

    public static GetPath(
        startPoint: Point,
        targetRect: Rectangle,
        callback: Function | null = null,
        ignoreWalls: boolean = false,
        building: BFOUNDATION | null = null
    ): any[] {
        const loc6 = PATHING.FromISO(startPoint);
        const loc8 = PATHING.FromISO(new Point(targetRect.x, targetRect.y));
        
        const newRect = targetRect;
        newRect.x = loc8.x;
        newRect.y = loc8.y;
        
        const loc6Global = PATHING.GlobalLocal(loc6);
        const loc8Global = PATHING.GlobalLocal(new Point(newRect.x, newRect.y));
        
        newRect.x = Math.floor(loc8Global.x);
        newRect.y = Math.floor(loc8Global.y);
        newRect.width *= 0.1;
        newRect.height *= 0.1;
        
        PATHING.GetPathB(loc6Global, newRect, startPoint, new Point(targetRect.x, targetRect.y), callback, ignoreWalls, building);
        return [];
    }

    public static GetPathB(
        startGrid: Point,
        targetRect: Rectangle,
        startISO: Point,
        targetISO: Point,
        callback: Function | null = null,
        ignoreWalls: boolean = false,
        building: BFOUNDATION | null = null
    ): void {
        PATHING.RenderCosts();
        
        startGrid.x = Math.floor(startGrid.x);
        startGrid.y = Math.floor(startGrid.y);
        targetRect.x = Math.floor(targetRect.x);
        targetRect.y = Math.floor(targetRect.y);
        
        const startKey = startGrid.x * 1000 + startGrid.y;
        let targetKey = targetRect.x * 1000 + targetRect.y;
        
        // If neither start nor target exist, use direct path
        if (!PATHING._costs[startKey] && !PATHING._costs[targetKey]) {
            if (callback) callback([startISO, targetISO], building);
            PATHING.RenderPath([startISO, targetISO]);
            return;
        }
        
        // Move start point towards target if invalid
        if (!PATHING._costs[startKey]) {
            const angle = 90 - Math.atan2(targetRect.y - startGrid.y, targetRect.x - startGrid.x) * 57.2957795;
            const dx = Math.sin(angle * 0.0174532925) * 5;
            const dy = Math.cos(angle * 0.0174532925) * 5;
            let iterations = 0;
            let key = startKey;
            
            while (!PATHING._costs[key] && iterations < 2000) {
                iterations++;
                startGrid.x += dx;
                startGrid.y += dy;
                key = Math.floor(startGrid.x) * 1000 + Math.floor(startGrid.y);
            }
            startGrid.x = Math.floor(startGrid.x);
            startGrid.y = Math.floor(startGrid.y);
        }
        
        if (!PATHING._costs[targetKey]) {
            if (callback) callback([startISO, targetISO], building);
            PATHING.RenderPath([startISO, targetISO]);
            return;
        }
        
        if (ignoreWalls) {
            targetKey += 1000000;
        }
        
        // Create flood object if doesn't exist
        if (!PATHING._floods[targetKey]) {
            const flood: { [key: number]: PATHINGobject } = {};
            const edge: { [key: number]: PATHINGobject } = {};
            const start: { [key: number]: PATHINGobject } = {};
            
            for (let tx = 0; tx < targetRect.width; tx++) {
                for (let ty = 0; ty < targetRect.height; ty++) {
                    const key = (targetRect.x + tx) * 1000 + (targetRect.y + ty);
                    
                    const floodObj = new PATHINGobject();
                    floodObj.pointX = targetRect.x + tx;
                    floodObj.pointY = targetRect.y + ty;
                    floodObj.depth = 0;
                    flood[key] = floodObj;
                    
                    const edgeObj = new PATHINGobject();
                    edgeObj.pointX = targetRect.x + tx;
                    edgeObj.pointY = targetRect.y + ty;
                    edgeObj.depth = 0;
                    edge[key] = edgeObj;
                    
                    const startObj = new PATHINGobject();
                    startObj.pointX = targetRect.x + tx;
                    startObj.pointY = targetRect.y + ty;
                    startObj.depth = 0;
                    start[key] = startObj;
                }
            }
            
            const floodObj = new PATHINGfloodobject();
            floodObj.flood = flood;
            floodObj.edge = edge;
            floodObj.start = start;
            floodObj.ignoreWalls = ignoreWalls;
            PATHING._floods[targetKey] = floodObj;
        }
        
        const finalStartKey = startGrid.x * 1000 + startGrid.y;
        if (!PATHING._floods[targetKey].startpoints[finalStartKey]) {
            PATHING._floods[targetKey].startpoints[finalStartKey] = {
                startID: finalStartKey,
                callbackfunctions: [],
                startPoint: startGrid
            };
        }
        
        PATHING._floods[targetKey].startpoints[finalStartKey].callbackfunctions.push([callback, ignoreWalls, building, targetISO]);
        PATHING._floods[targetKey].pending += 1;
    }

    /**
     * Processes flood fill pathfinding for all pending flood objects.
     * Expands the flood area step by step within time constraints.
     */
    private static ProcessFlood(event: Event | null = null): void {
        const startTimer = Date.now();
        
        // Count pending floods
        let pendingCount = 0;
        for (const key in PATHING._floods) {
            if (PATHING._floods[key].pending) {
                pendingCount++;
            }
        }
        
        // Calculate time slice per flood
        let timeSliceLimit = 25 / pendingCount;
        if (timeSliceLimit < 5) timeSliceLimit = 5;
        
        // Process each pending flood
        for (const key in PATHING._floods) {
            const floodObj = PATHING._floods[key];
            if (floodObj.pending) {
                const timeSliceStart = Date.now();
                
                while (Date.now() - timeSliceStart < timeSliceLimit && floodObj.pending > 0) {
                    const newEdge: { [key: number]: PATHINGobject } = {};
                    let minDepth = 9999999;
                    floodObj.edgeLength = 0;
                    
                    // Expand current edge
                    for (const edgeKey in floodObj.edge) {
                        const edgePoint = floodObj.edge[edgeKey];
                        
                        if (edgePoint.depth <= floodObj.minDepth) {
                            const currentX = edgePoint.pointX;
                            const currentY = edgePoint.pointY;
                            
                            // Check all neighbors
                            for (let nx = currentX - 1; nx < currentX + 2; nx++) {
                                for (let ny = currentY - 1; ny < currentY + 2; ny++) {
                                    if (nx !== currentX || ny !== currentY) {
                                        const neighborKey = nx * 1000 + ny;
                                        
                                        if (!floodObj.flood[neighborKey] && !newEdge[neighborKey] && PATHING._costs[neighborKey]) {
                                            const newPoint = new PATHINGobject();
                                            newPoint.pointX = nx;
                                            newPoint.pointY = ny;
                                            
                                            let moveCost = PATHING._costs[neighborKey].cost;
                                            if (floodObj.ignoreWalls && PATHING._costs[neighborKey].building) {
                                                moveCost = 20;
                                            }
                                            
                                            // Higher cost for diagonal
                                            if (nx !== currentX && ny !== currentY) {
                                                moveCost *= 1.5;
                                            }
                                            
                                            newPoint.depth = edgePoint.depth + moveCost;
                                            if (newPoint.depth < minDepth) {
                                                minDepth = newPoint.depth;
                                            }
                                            
                                            newEdge[neighborKey] = newPoint;
                                            floodObj.flood[neighborKey] = newPoint;
                                            floodObj.edgeLength++;
                                        }
                                    }
                                }
                            }
                        } else {
                            newEdge[edgePoint.pointID] = edgePoint;
                            floodObj.edgeLength++;
                            if (edgePoint.depth < minDepth) {
                                minDepth = edgePoint.depth;
                            }
                        }
                    }
                    
                    floodObj.edge = newEdge;
                    floodObj.minDepth = minDepth;
                    PATHING.CheckStartReached(floodObj);
                }
            }
        }
    }

    private static CheckStartReached(floodObj: PATHINGfloodobject): number {
        let count = 0;
        for (const key in floodObj.startpoints) {
            const startPoint = floodObj.startpoints[key];
            if (startPoint && floodObj.flood[startPoint.startID]) {
                for (const callbackData of startPoint.callbackfunctions) {
                    PATHING.Path(floodObj.flood, startPoint.startID, callbackData[0], callbackData[1], callbackData[2], callbackData[3]);
                    floodObj.pending--;
                    count++;
                }
                startPoint.callbackfunctions = [];
                delete floodObj.startpoints[key];
            }
        }
        return count;
    }

    public static Path(
        flood: { [key: number]: PATHINGobject },
        startKey: number,
        callback: Function,
        ignoreWalls: boolean = false,
        building: BFOUNDATION | null = null,
        targetPoint: Point | null = null
    ): void {
        const path: Point[] = [];
        let pathLength = 0;
        
        if (flood[startKey]) {
            let currentX = flood[startKey].pointX;
            let currentY = flood[startKey].pointY;
            let currentDepth = flood[startKey].depth;
            
            path[pathLength] = PATHING.ToISO(PATHING.LocalGlobal(new Point(currentX, currentY)), 0);
            pathLength++;
            
            let searching = true;
            while (searching) {
                searching = false;
                let nextX = -1;
                let nextY = -1;
                let found = false;
                
                for (let dx = -1; dx < 2; dx++) {
                    for (let dy = -1; dy < 2; dy++) {
                        if (dx !== 0 || dy !== 0) {
                            const checkKey = (currentX + dx) * 1000 + (currentY + dy);
                            if (flood[checkKey] && flood[checkKey].depth < currentDepth && flood[checkKey].depth > 0) {
                                nextX = currentX + dx;
                                nextY = currentY + dy;
                                found = true;
                                currentDepth = flood[checkKey].depth;
                                searching = true;
                                
                                // Check for building collision
                                if (!ignoreWalls && pathLength > 1 && PATHING._costs[checkKey]?.building) {
                                    const hitBuilding = PATHING._costs[checkKey].building!;
                                    if (hitBuilding.health > 0) {
                                        callback(path, hitBuilding);
                                        PATHING.RenderPath(path);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
                
                if (found) {
                    currentX = nextX;
                    currentY = nextY;
                    path[pathLength] = PATHING.ToISO(PATHING.LocalGlobal(PATHING.Jiggle(nextX, nextY)), 0);
                    pathLength++;
                }
            }
        }
        
        // Add target point if provided
        if (targetPoint) {
            const targetGrid = PATHING.GlobalLocal(PATHING.FromISO(targetPoint));
            if (!building || !PATHING._costs[targetGrid.x * 1000 + targetGrid.y]) {
                path[pathLength] = targetPoint;
            }
        }
        
        PATHING.RenderFlood();
        PATHING.RenderPath(path);
        callback(path, building);
    }

    private static Jiggle(x: number, y: number): Point {
        return new Point(x + (Math.random() - 0.5) * 0.4, y + (Math.random() - 0.5) * 0.4);
    }

    public static GetBuildingFromISO(pos: Point): BFOUNDATION | null {
        const loc2 = PATHING.FromISO(pos);
        const loc3 = PATHING.GlobalLocal(loc2);
        const key = 1000 * Math.floor(loc3.x) + Math.floor(loc3.y);
        if (PATHING._costs[key]) {
            return PATHING._costs[key].building || null;
        }
        return null;
    }

    /**
     * Clears all flood fill data and invokes callbacks with empty paths.
     */
    public static Clear(): void {
        const collectedCallbacks: Function[] = [];
        
        for (const key in PATHING._floods) {
            const floodObj = PATHING._floods[key];
            for (const startKey in floodObj.startpoints) {
                const startPoint = floodObj.startpoints[startKey];
                if (startPoint?.callbackfunctions) {
                    for (const cb of startPoint.callbackfunctions) {
                        collectedCallbacks.push(cb[0]);
                    }
                }
            }
        }
        
        PATHING._floods = {};
        
        for (const callback of collectedCallbacks) {
            callback([], null, true);
        }
    }

    public static Cleanup(): void {
        PATHING._costs = {};
        PATHING._floods = {};
    }

    public static LineOfSight(
        x1: number, y1: number, x2: number, y2: number,
        targetBuilding: BFOUNDATION | null = null, checkWalls: boolean = false
    ): boolean {
        const start = PATHING.GlobalLocal(PATHING.FromISO(new Point(x1, y1)));
        const end = PATHING.GlobalLocal(PATHING.FromISO(new Point(x2, y2)));
        
        const startX = start.x;
        const startY = start.y;
        const endX = end.x;
        const endY = end.y;
        
        const dx = endX - startX;
        const dy = endY - startY;
        const angle = Math.atan2(dy, dx) * PATHING.c180PI;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        for (let i = 0; i < distance; i++) {
            const checkX = Math.floor(startX + Math.cos(angle * PATHING.cPI180) * i);
            const checkY = Math.floor(startY + Math.sin(angle * PATHING.cPI180) * i);
            const key = checkX * 1000 + checkY;
            
            if (!PATHING._costs[key]) return true;
            
            const building = PATHING._costs[key].building;
            if (building && building.health > 0) {
                if (targetBuilding && building === targetBuilding) continue;
                if (building._type === 17 || checkWalls) return false;
            }
        }
        return true;
    }

    public static ResetCosts(): void {
        PATHING._resetRequested = true;
    }

    public static Wander(center: Point, radius: number = 50, callback: Function | null = null): void {
        center.x = Math.floor(center.x);
        center.y = Math.floor(center.y);
        
        const candidates: Point[] = [];
        for (let i = -radius; i < radius; i += 10) {
            if (!GRID.Blocked(center.add(new Point(i, -radius)))) {
                candidates.push(center.add(new Point(i, -radius)));
            }
            if (!GRID.Blocked(center.add(new Point(i, radius)))) {
                candidates.push(center.add(new Point(i, radius)));
            }
            if (!GRID.Blocked(center.add(new Point(-radius, i)))) {
                candidates.push(center.add(new Point(-radius, i)));
            }
            if (!GRID.Blocked(center.add(new Point(radius, i)))) {
                candidates.push(center.add(new Point(radius, i)));
            }
        }
        
        if (candidates.length > 0) {
            const target = candidates[Math.floor(Math.random() * candidates.length)];
            PATHING.GetPath(center, new Rectangle(target.x, target.y, 10, 10), callback);
        }
    }

    public static RenderFlood(): void {
        // Debug rendering - disabled in production
    }

    public static RenderCosts(): void {
        // Debug rendering - disabled in production
    }

    public static RenderPath(path: any[], clicked: boolean = false): void {
        // Debug rendering - disabled in production
    }

    public static getNumberAsHexString(num: number, minLength: number = 1, prefix: boolean = true): string {
        let str = num.toString(16).toUpperCase();
        while (minLength > str.length) {
            str = "0" + str;
        }
        return prefix ? "0x" + str : str;
    }

    private static GlobalLocal(point: Point): Point {
        point.x *= 0.1;
        point.y *= 0.1;
        point.x += PATHING._gridWidth >> 1;
        point.y += PATHING._gridHeight >> 1;
        point.x = Math.floor(point.x);
        point.y = Math.floor(point.y);
        return point;
    }

    public static LocalGlobal(point: Point): Point {
        point.x -= PATHING._gridWidth >> 1;
        point.y -= PATHING._gridHeight >> 1;
        point.x *= 10;
        point.y *= 10;
        return point;
    }

    public static ToISO(point: Point, z: number): Point {
        const isoY = (point.x + point.y) * 0.5 - z;
        const isoX = point.x - point.y;
        return new Point(isoX, isoY);
    }

    public static FromISO(point: Point): Point {
        const gridY = point.y - point.x * 0.5;
        const gridX = point.x * 0.5 + point.y;
        return new Point(gridX, gridY);
    }

    public static PlotRandom(event: MouseEvent): void {
        const done = (path: any[]): void => {};
        const p = PATHING.ToISO(new Point(260, 260), 0);
        PATHING.GetPath(PATHING.ToISO(new Point(-2000, -2000), 0), new Rectangle(p.x, p.y, 10, 10), done);
    }
}
