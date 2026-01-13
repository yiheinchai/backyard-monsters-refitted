import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Shape from "openfl/display/Shape";

import { ImageCache } from "../display/ImageCache";
import { ALLIANCES } from "./ALLIANCES";

/**
 * Alliance info class - holds data and relationships for an alliance.
 */
export class AllyInfo {
    private static _forceRelations: boolean = true;
    private static _useIconRelations: boolean = false;
    
    private static _relationProps: { [key: string]: number } = {
        hostile: -1,
        hostileleader: -2,
        neutral: 0,
        friendly: 1,
        friendlyleader: 2,
        member: 4,
        leader: 5
    };
    
    private static _picPropsL: any = {
        picX: 0, picY: 0, picW: 75, picH: 75,
        relW: 75, relH: 75, relX: 0, relY: 0
    };
    
    private static _picPropsM: any = {
        picX: 2, picY: 2, picW: 46, picH: 46,
        relW: 50, relH: 50, relX: 0, relY: 0
    };
    
    private static _picPropsS: any = {
        picX: 0, picY: 0, picW: 25, picH: 25,
        relW: 25, relH: 25, relX: 0, relY: 0
    };
    
    private static _picPropsXS: any = {
        picX: 0, picY: 0, picW: 12, picH: 12,
        relW: 12, relH: 12, relX: 0, relY: 0
    };
    
    public static _picURLs: any = {
        baseURL: "alliances/",
        sizeL: "_large",
        sizeM: "_medium",
        sizeS: "_small",
        sizeXS: "_xsmall",
        ally: "A",
        friendly: "F",
        hostile: "H",
        neutral: "N",
        playerHex: 0x388C67,
        allyHex: 0xACD7F9,
        friendlyHex: 0x13DB05,
        hostileHex: 0xFF4B18,
        neutralHex: 0xFFFF00,
        noneHex: 0xFFFFFF,
        ext: ".png"
    };

    private alliance_id: number;
    public name: string;
    public image: number;
    public relationship: number = 0;
    public relationships: { [key: number]: number } | null;
    private _relCheckSelf: boolean = true;
    private _relCheckThem: boolean = false;

    constructor(data: any) {
        this.alliance_id = data.alliance_id;
        this.name = data.name;
        this.image = data.image;
        this.relationships = data.relationships;
        
        if (AllyInfo._forceRelations) {
            if (ALLIANCES._allianceID && ALLIANCES._allianceID !== 0 && this.alliance_id && !this.relationship) {
                this.Relations(ALLIANCES._allianceID);
            }
        }
    }

    public Relations(myAllianceId: number): number {
        if (this.alliance_id) {
            this.relationship = AllyInfo._relationProps.neutral;
        }
        
        if (!this.relationships || !ALLIANCES._myAlliance) {
            return 0;
        }
        
        let relation = 0;
        
        if (myAllianceId === this.alliance_id) {
            relation = AllyInfo._relationProps.member;
            this.relationship = relation;
            return 0;
        }
        
        if (this._relCheckThem) {
            if (this.relationships && this.relationships[myAllianceId]) {
                relation = this.relationships[myAllianceId];
            }
        }
        
        if (this._relCheckSelf) {
            if (ALLIANCES._myAlliance && (ALLIANCES._myAlliance as any).relationships && 
                (ALLIANCES._myAlliance as any).relationships[this.alliance_id]) {
                relation = (ALLIANCES._myAlliance as any).relationships[this.alliance_id];
            }
        }
        
        this.relationship = relation;
        return relation;
    }

    public AlliancePic(size: string, container: MovieClip, relationContainer: MovieClip | null = null, showRelation: boolean = false): void {
        if (this.alliance_id && this.alliance_id > 0 && this.image) {
            const imageId = this.image;
            let url = "" + AllyInfo._picURLs.baseURL + imageId;
            let picProps: any = {};
            
            if (size === AllyInfo._picURLs.sizeL || size === "large") {
                url += AllyInfo._picURLs.sizeL;
                picProps = AllyInfo._picPropsL;
            } else if (size === AllyInfo._picURLs.sizeM || size === "medium") {
                url += AllyInfo._picURLs.sizeM;
                picProps = AllyInfo._picPropsM;
            } else if (size === AllyInfo._picURLs.sizeS || size === "small") {
                url += AllyInfo._picURLs.sizeS;
                picProps = AllyInfo._picPropsS;
            } else {
                return;
            }
            
            url += AllyInfo._picURLs.ext;
            ImageCache.GetImageWithCallBack(url, this.IconLoaded.bind(this), true, 1, "", [container, picProps]);
            
            if (showRelation) {
                if (AllyInfo._useIconRelations) {
                    let relUrl = "" + AllyInfo._picURLs.baseURL;
                    let relProps: any = {};
                    
                    if (this.relationship === AllyInfo._relationProps.neutral) {
                        relUrl += AllyInfo._picURLs.neutral;
                    } else if (this.relationship >= AllyInfo._relationProps.member) {
                        relUrl += AllyInfo._picURLs.ally;
                    } else if (this.relationship > AllyInfo._relationProps.neutral && this.relationship < AllyInfo._relationProps.member) {
                        relUrl += AllyInfo._picURLs.friendly;
                    } else if (this.relationship > AllyInfo._relationProps.hostile) {
                        return;
                    } else {
                        relUrl += AllyInfo._picURLs.hostile;
                    }
                    
                    if (size === AllyInfo._picURLs.sizeL || size === "large") {
                        relUrl += AllyInfo._picURLs.sizeS;
                        relProps = AllyInfo._picPropsL;
                    } else if (size === AllyInfo._picURLs.sizeM || size === "medium") {
                        relUrl += AllyInfo._picURLs.sizeS;
                        relProps = AllyInfo._picPropsM;
                    } else if (size === AllyInfo._picURLs.sizeS || size === "small") {
                        relUrl += AllyInfo._picURLs.sizeXS;
                        relProps = AllyInfo._picPropsS;
                    } else {
                        return;
                    }
                    
                    relUrl += AllyInfo._picURLs.ext;
                    ImageCache.GetImageWithCallBack(relUrl, this.IconRelationLoaded.bind(this), true, 1, "", [container, relProps]);
                } else if (relationContainer) {
                    let numChildren = relationContainer.numChildren;
                    while (numChildren--) {
                        relationContainer.removeChildAt(numChildren);
                    }
                    
                    const shape = new Shape();
                    let color: number = 0xFFFFFF;
                    
                    if (this.relationship === AllyInfo._relationProps.neutral) {
                        color = AllyInfo._picURLs.neutralHex;
                    } else if (this.relationship >= AllyInfo._relationProps.member) {
                        color = AllyInfo._picURLs.allyHex;
                    } else if (this.relationship > AllyInfo._relationProps.neutral && this.relationship < AllyInfo._relationProps.member) {
                        color = AllyInfo._picURLs.friendlyHex;
                    } else if (this.relationship <= AllyInfo._relationProps.hostile) {
                        color = AllyInfo._picURLs.hostileHex;
                    } else {
                        color = AllyInfo._picURLs.noneHex;
                    }
                    
                    shape.graphics.beginFill(color);
                    shape.graphics.drawRect(picProps.relX, picProps.relY, picProps.relW, picProps.relH);
                    shape.graphics.endFill();
                    relationContainer.addChild(shape);
                }
            }
        }
    }

    private IconLoaded(path: string, data: BitmapData, args: any[] | null = null): void {
        const bm = new Bitmap(data);
        if (args && args[0]) {
            args[0].addChild(bm);
            args[0].setChildIndex(bm, 0);
            bm.x = args[1].picX;
            bm.y = args[1].picY;
        }
    }

    private IconRelationLoaded(path: string, data: BitmapData, args: any[] | null = null): void {
        const bm = new Bitmap(data);
        if (args && args[0]) {
            args[0].addChild(bm);
            bm.x = args[1].relX;
            bm.y = args[1].relY;
        }
    }
}
