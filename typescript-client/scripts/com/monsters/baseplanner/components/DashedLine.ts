import CapsStyle from "openfl/display/CapsStyle";
import LineScaleMode from "openfl/display/LineScaleMode";
import Shape from "openfl/display/Shape";
import Sprite from "openfl/display/Sprite";
import Point from "openfl/geom/Point";

/**
 * DashedLine - utility for drawing dashed lines with configurable patterns.
 */
export class DashedLine extends Sprite {
    private lengthsArray: Array<number>;
    private lineColor: number = 0;
    private lineWeight: number = 0;
    private lineAlpha: number = 1;
    private curX: number = 0;
    private curY: number = 0;
    private remainingDist: number = 0;
    private curIndex: number = 0;
    private arraySum: number = 0;
    private startIndex: number = 0;
    private fill: Shape;
    private stroke: Shape;

    constructor(weight: number = 0, color: number = 0, lengths: Array<number> | null = null) {
        super();
        this.lengthsArray = [];
        this.fill = new Shape();
        this.stroke = new Shape();
        if (lengths !== null) {
            this.lengthsArray = lengths;
        } else {
            this.lengthsArray = [5, 5];
        }
        if (this.lengthsArray.length % 2 !== 0) {
            lengths!.push(5);
        }
        for (let i = 0; i < lengths!.length; i++) {
            this.arraySum += lengths![i];
        }
        this.lineWeight = weight;
        this.lineColor = color;
        this.stroke.graphics.lineStyle(this.lineWeight, this.lineColor, this.lineAlpha, false, LineScaleMode.NONE, CapsStyle.NONE);
        this.addChild(this.fill);
        this.addChild(this.stroke);
    }

    public moveTo(x: number, y: number): void {
        this.stroke.graphics.moveTo(x, y);
        this.fill.graphics.moveTo(x, y);
        this.curX = x;
        this.curY = y;
        this.remainingDist = 0;
        this.startIndex = 0;
    }

    public lineTo(endX: number, endY: number): void {
        const slope = (endY - this.curY) / (endX - this.curX);
        let x = this.curX;
        let y = this.curY;
        const xDir = endX < x ? -1 : 1;
        const yDir = endY < y ? -1 : 1;

        loop0:
        while (Math.abs(x - this.curX) < Math.abs(x - endX) || Math.abs(y - this.curY) < Math.abs(y - endY)) {
            for (let i = this.startIndex; i < this.lengthsArray.length; i++) {
                const segLen = this.remainingDist === 0 ? this.lengthsArray[i] : this.remainingDist;
                const coords = this.getCoords(segLen, slope);
                const dx = coords.x * xDir;
                const dy = coords.y * yDir;
                if (!(Math.abs(x - this.curX) + Math.abs(dx) < Math.abs(x - endX) || Math.abs(y - this.curY) + Math.abs(dy) < Math.abs(y - endY))) {
                    this.remainingDist = this.getDistance(this.curX, this.curY, endX, endY);
                    this.curIndex = i;
                    break loop0;
                }
                if (i % 2 === 0) {
                    this.stroke.graphics.lineTo(this.curX + dx, this.curY + dy);
                } else {
                    this.stroke.graphics.moveTo(this.curX + dx, this.curY + dy);
                }
                this.curX += dx;
                this.curY += dy;
                this.curIndex = i;
                this.startIndex = 0;
                this.remainingDist = 0;
            }
        }
        this.startIndex = this.curIndex;
        if (this.remainingDist !== 0) {
            if (this.curIndex % 2 === 0) {
                this.stroke.graphics.lineTo(endX, endY);
            } else {
                this.stroke.graphics.moveTo(endX, endY);
            }
            this.remainingDist = this.lengthsArray[this.curIndex] - this.remainingDist;
        } else if (this.startIndex === this.lengthsArray.length - 1) {
            this.startIndex = 0;
        } else {
            ++this.startIndex;
        }
        this.curX = endX;
        this.curY = endY;
        this.fill.graphics.lineTo(endX, endY);
    }

    private getCoords(dist: number, slope: number): Point {
        const angle = Math.atan(slope);
        const y = Math.abs(Math.sin(angle) * dist);
        const x = Math.abs(Math.cos(angle) * dist);
        return new Point(x, y);
    }

    private getDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    public clear(): void {
        this.stroke.graphics.clear();
        this.stroke.graphics.lineStyle(this.lineWeight, this.lineColor, this.lineAlpha, false, LineScaleMode.NONE, CapsStyle.NONE);
        this.fill.graphics.clear();
        this.moveTo(0, 0);
    }

    public lineStyle(weight: number = 0, color: number = 0, alpha: number = 1): void {
        this.lineWeight = weight;
        this.lineColor = color;
        this.lineAlpha = alpha;
        this.stroke.graphics.lineStyle(this.lineWeight, this.lineColor, this.lineAlpha, false, LineScaleMode.NONE, CapsStyle.NONE);
    }

    public beginFill(color: number, alpha: number = 1): void {
        this.fill.graphics.beginFill(color, alpha);
    }

    public endFill(): void {
        this.fill.graphics.endFill();
    }
}
