import EventDispatcher from 'openfl/events/EventDispatcher';
import { SecNum } from './com/cc/utils/SecNum';
import { PROTIP_CLIP } from './PROTIP_CLIP';
import MovieClip from 'openfl/display/MovieClip';
import Sprite from 'openfl/display/Sprite';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';

/**
 * GLOBAL - Core game state and constants
 * Skeleton implementation for conversion support
 * Converted from ActionScript to TypeScript
 */
export class GLOBAL {
    public static serverUrl: string = "http://localhost:3001/";
    public static cdnUrl: string = "http://localhost:3001/";
    public static apiVersionSuffix: string = "v1.4.3-beta";
    public static _apiURL: string = "";
    public static _storageURL: string = "";
    public static textContentLoaded: boolean = false;
    public static supportedLangsLoaded: boolean = false;
    public static eventDispatcher: EventDispatcher = new EventDispatcher();
    public static _SCREENCENTER: Point = new Point(400, 300);
    public static _zoomed: boolean = false;
    public static mode: string = "";
    public static e_BASE_MODE: any = {
        BUILD: "build",
        ATTACK: "attack",
        WMATTACK: "wmattack",
        VIEW: "view",
        WMVIEW: "wmview",
        HELP: "help",
        IBUILD: "ibuild",
        IVIEW: "iview",
        IATTACK: "iattack",
        IHELP: "ihelp",
        IWMVIEW: "iwmview",
        IWMATTACK: "iwmattack"
    };

    // Stubs for methods used in dependencies
    public static gotoURL(url: string, window: any = null, windowName: any = null, vars: any = null): void {
        console.log("GLOBAL gotoURL:", url);
    }

    public static goFullScreen(): void {
        // stub
    }

    public static setTownHall(val: any): void {
        // stub
    }

    public static ErrorMessage(msg: string): void {
        console.error("GLOBAL Error:", msg);
    }

    public static Message(msg: string): void {
        console.log("GLOBAL Message:", msg);
    }

    public static Zoom(): void {
        GLOBAL._zoomed = !GLOBAL._zoomed;
        // logic for zooming
    }

    public static StatGet(stat: string): number {
        // stub
        return 0;
    }

    public static StatSet(stat: string, val: any): void {
        // stub
    }
}
