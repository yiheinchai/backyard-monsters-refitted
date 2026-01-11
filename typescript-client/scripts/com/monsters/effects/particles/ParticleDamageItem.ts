import Point from "openfl/geom/Point";

import { ParticleText } from "./ParticleText";
import { ParticleDamageItem_CLIP } from "../../../../ParticleDamageItem_CLIP";

import { GLOBAL } from "../../../../GLOBAL";
import { MAP } from "../../../../MAP";
import { BRESOURCE } from "../../../../BRESOURCE";
import { TweenLite } from "gs/TweenLite";
import { Cubic } from "gs/easing/Cubic";

/**
 * Particle damage item - displays floating damage/loot text.
 */
export class ParticleDamageItem extends ParticleDamageItem_CLIP {
    public _mc: ParticleDamageItem | null = null;

    constructor() {
        super();
    }

    public Init(position: Point, value: number, type: number): void {
        this._mc = MAP._PROJECTILES.addChild(this) as ParticleDamageItem;
        this.Fill(value, type);
        this.Move(position);
    }

    public Fill(value: number, type: number): void {
        let text: string = "";
        let color: string = "";
        if (type === ParticleText.TYPE_DAMAGE || type === ParticleText.TYPE_HEAL) {
            switch (type) {
                case ParticleText.TYPE_DAMAGE:
                    color = "FF0000";
                    text = "<b>" + value + "</b>";
                    break;
                case ParticleText.TYPE_HEAL:
                    color = "00ff00";
                    text = "<b>+" + (value * -1) + "</b>";
                    break;
            }
        } else {
            color = this.getLootColor(type);
            const mode: string = GLOBAL.mode;
            let prefix: string = "";
            prefix = mode === "attack" || mode === "wmattack" ? "+" : "-";
            text = "<b>" + prefix + value + "</b>";
        }
        this._mc!.tLootA.htmlText = "<font color=\"#" + color + "\">" + text + "</font>";
        this._mc!.tLootB.htmlText = text;
    }

    public getLootColor(type: number): string {
        switch (type) {
            case BRESOURCE.RESOURCE_TWIGS:
                return "723228";
            case BRESOURCE.RESOURCE_PEBBLES:
                return "999999";
            case BRESOURCE.RESOURCE_PUTTY:
                return "FF00FF";
            case BRESOURCE.RESOURCE_GOO:
                return "00FF00";
            case BRESOURCE.RESOURCE_COAL:
                return "3F3B36";
            case BRESOURCE.RESOURCE_BONE:
                return "F0E6C5";
            case BRESOURCE.RESOURCE_SULFUR:
                return "EEED71";
            case BRESOURCE.RESOURCE_MAGMA:
                return "D95300";
            default:
                return "FFFF00";
        }
    }

    public Move(position: Point): void {
        this._mc!.x = position.x;
        this._mc!.y = position.y;
        this._mc!.cacheAsBitmap = true;
        TweenLite.to(this._mc, 0.5, {
            "y": position.y - 25,
            "ease": Cubic.easeInOut,
            "onComplete": this.Remove.bind(this)
        });
    }

    public Remove(): void {
        this._mc!.x = this._mc!.y = -10000;
        try {
            MAP._PROJECTILES.removeChild(this._mc!);
        } catch (e: any) {
            // Ignore error
        }
        ParticleText.Remove(this);
    }
}
