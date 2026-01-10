import Bitmap from "openfl/display/Bitmap";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";
import FileReference from "openfl/net/FileReference";
import ByteArray from "openfl/utils/ByteArray";

import { JPGEncoder } from "../../adobe/images/JPGEncoder";
import { screenshot } from "./screenshot";
import { screenshot_ui_CLIP } from "./screenshot_ui_CLIP";

/**
 * screenshot_ui - Screenshot editor UI with brightness, contrast, saturation, tilt and grain controls.
 */
export class screenshot_ui extends screenshot_ui_CLIP {
    private brightness: number = 0;
    private contrast: number = 0;
    private saturation: number = 0;
    private tilt: number = 0;
    private grain: number = 0;
    private border: number = 0;
    private dragPoint: Point | null = null;
    private offsetPoint: Point;
    private presets: Array<any>;

    constructor() {
        this.offsetPoint = new Point(-20, -20);
        this.presets = [
            ["Normal", 0, 0, 0, 0, 0, 0],
            ["B&W", 10, 10, -100, 0, 0, 1],
            ["B&W 2", 0, 40, -100, 0, 0, 1],
            ["Toy", 0, 0, 10, 60, 0, 2],
            ["Toy 2", 10, 30, 20, 60, 0, 2],
            ["Old", 10, 40, -30, 10, 1, 3]
        ];
        super();
        this.mcImage.addEventListener(MouseEvent.MOUSE_DOWN, this.DragStart.bind(this));
        this.mcImage.addEventListener(MouseEvent.MOUSE_UP, this.DragStop.bind(this));
        this.bBrightnessDown.Setup("-");
        this.bBrightnessDown.addEventListener(MouseEvent.CLICK, this.BrightnessDown.bind(this));
        this.bBrightnessUp.Setup("+");
        this.bBrightnessUp.addEventListener(MouseEvent.CLICK, this.BrightnessUp.bind(this));
        this.bContrastDown.Setup("-");
        this.bContrastDown.addEventListener(MouseEvent.CLICK, this.ContrastDown.bind(this));
        this.bContrastUp.Setup("+");
        this.bContrastUp.addEventListener(MouseEvent.CLICK, this.ContrastUp.bind(this));
        this.bSaturationDown.Setup("-");
        this.bSaturationDown.addEventListener(MouseEvent.CLICK, this.SaturationDown.bind(this));
        this.bSaturationUp.Setup("+");
        this.bSaturationUp.addEventListener(MouseEvent.CLICK, this.SaturationUp.bind(this));
        this.bTiltDown.Setup("-");
        this.bTiltDown.addEventListener(MouseEvent.CLICK, this.TiltDown.bind(this));
        this.bTiltUp.Setup("+");
        this.bTiltUp.addEventListener(MouseEvent.CLICK, this.TiltUp.bind(this));
        this.bGrainDown.Setup("-");
        this.bGrainDown.addEventListener(MouseEvent.CLICK, this.GrainDown.bind(this));
        this.bGrainUp.Setup("+");
        this.bGrainUp.addEventListener(MouseEvent.CLICK, this.GrainUp.bind(this));
        this.bSave1.SetupKey("btn_savetoalbum");
        this.bSave1.Enabled = false;
        this.bSave2.SetupKey("btn_posttowall");
        this.bSave2.Enabled = false;
        this.bSave3.SetupKey("btn_downloadimage");
        this.bSave3.addEventListener(MouseEvent.CLICK, this.Save.bind(this));
        for (let i = 0; i < this.presets.length; i++) {
            (this as any)["bPreset" + (i + 1)].Setup(this.presets[i][0]);
            (this as any)["bPreset" + (i + 1)].addEventListener(MouseEvent.CLICK, this.LoadPreset(i));
        }
        this.Update();
    }

    private LoadPreset(n: number): (event: MouseEvent | null) => void {
        return ((event: MouseEvent | null = null): void => {
            this.brightness = this.presets[n][1];
            this.contrast = this.presets[n][2];
            this.saturation = this.presets[n][3];
            this.tilt = this.presets[n][4];
            this.grain = this.presets[n][5];
            this.border = this.presets[n][6];
            this.Update();
        }).bind(this);
    }

    private DragStart(event: MouseEvent | null = null): void {
        this.dragPoint = new Point(this.mouseX, this.mouseY);
        this.addEventListener(MouseEvent.MOUSE_MOVE, this.Dragging.bind(this));
    }

    private DragStop(event: MouseEvent | null = null): void {
        this.removeEventListener(MouseEvent.MOUSE_MOVE, this.Dragging.bind(this));
        this.offsetPoint.x += this.mouseX - this.dragPoint!.x;
        this.offsetPoint.y += this.mouseY - this.dragPoint!.y;
        this.Update();
    }

    private Dragging(event: MouseEvent | null = null): void {
        screenshot.Take(this.mouseX - this.dragPoint!.x + this.offsetPoint.x, this.mouseY - this.dragPoint!.y + this.offsetPoint.y);
        this.Update();
        this.mcImage.removeChildAt(0);
        this.mcImage.addChild(new Bitmap(screenshot._processedImage));
    }

    private Update(): void {
        this.tBrightness.htmlText = "<b>" + (100 + this.brightness) + "%";
        this.tContrast.htmlText = "<b>" + (100 + this.contrast) + "%";
        this.tSaturation.htmlText = "<b>" + (100 + this.saturation) + "%";
        this.tTilt.htmlText = this.tilt === 0 ? "<b>OFF" : "<b>ON " + this.tilt + "%";
        this.tGrain.htmlText = this.grain === 0 ? "<b>OFF" : (this.grain === 1 ? "<b>LOW" : "<b>HIGH");
        screenshot.Process(this.brightness, this.contrast, this.saturation, this.tilt, this.grain, this.border);
        this.mcImage.removeChildAt(0);
        this.mcImage.addChild(new Bitmap(screenshot._processedImage));
        this.mcImage.width = 550;
        this.mcImage.height = 360;
    }

    private Save(event: MouseEvent | null = null): void {
        const encoder = new JPGEncoder(80);
        const byteArray = encoder.encode(screenshot._processedImage);
        const fileRef = new FileReference();
        fileRef.save(byteArray, "BackyardMonsters.jpg");
    }

    private BrightnessDown(event: MouseEvent): void { if (this.brightness > -100) this.brightness -= 10; this.Update(); }
    private BrightnessUp(event: MouseEvent): void { if (this.brightness < 100) this.brightness += 10; this.Update(); }
    private ContrastDown(event: MouseEvent): void { if (this.contrast > -100) this.contrast -= 10; this.Update(); }
    private ContrastUp(event: MouseEvent): void { if (this.contrast < 100) this.contrast += 10; this.Update(); }
    private SaturationDown(event: MouseEvent): void { if (this.saturation > -100) this.saturation -= 10; this.Update(); }
    private SaturationUp(event: MouseEvent): void { if (this.saturation < 100) this.saturation += 10; this.Update(); }
    private TiltUp(event: MouseEvent): void { if (this.tilt < 100) this.tilt += 10; this.Update(); }
    private TiltDown(event: MouseEvent): void { if (this.tilt > 0) this.tilt -= 10; this.Update(); }
    private GrainDown(event: MouseEvent): void { if (this.grain > 0) --this.grain; this.Update(); }
    private GrainUp(event: MouseEvent): void { if (this.grain < 2) this.grain += 1; this.Update(); }
}
