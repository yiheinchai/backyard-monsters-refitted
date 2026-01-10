import DisplayObject from "openfl/display/DisplayObject";
import Sprite from "openfl/display/Sprite";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";
import { TransformAroundPointPlugin } from "./TransformAroundPointPlugin";
import { TweenLite } from "../TweenLite";

/**
 * TransformAroundCenterPlugin - Transforms display object around its center.
 */
export class TransformAroundCenterPlugin extends TransformAroundPointPlugin {
    public static readonly VERSION: number = 1.02;
    public static readonly API: number = 1;

    constructor() {
        super();
        this.propName = "transformAroundCenter";
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        let tempAdded = false;
        let tempParent: Sprite | null = null;
        
        if (target.parent === null) {
            tempAdded = true;
            tempParent = new Sprite();
            tempParent.addChild(target as DisplayObject);
        }
        
        const bounds: Rectangle = target.getBounds(target.parent);
        value.point = new Point(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        
        if (tempAdded && tempParent !== null) {
            tempParent.removeChild(target);
        }
        
        return super.onInitTween(target, value, tween);
    }
}
