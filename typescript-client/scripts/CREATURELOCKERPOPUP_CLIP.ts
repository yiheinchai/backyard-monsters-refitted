import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { creatureBar } from './creatureBar';
import { Embed } from "./core/Embed";

/**
 * CREATURELOCKERPOPUP_CLIP - Creature locker popup CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="CREATURELOCKERPOPUP_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "CREATURELOCKERPOPUP_CLIP" })
export class CREATURELOCKERPOPUP_CLIP extends MovieClip {
    public bNext: Button_CLIP;
    public tTime: TextField;
    public bSpeed: creatureBar;
    public time_txt: TextField;
    public bResource: creatureBar;
    public bInstant: Button_CLIP;
    public mcButtons: MovieClip;
    public tResource: TextField;
    public bDamage: creatureBar;
    public title_txt: TextField;
    public bPrevious: Button_CLIP;
    public bContinue: Button_CLIP;
    public health_txt: TextField;
    public mcList: MovieClip;
    public txtGuide: TextField;
    public prod_label_txt: TextField;
    public tSpeed: TextField;
    public bTime: creatureBar;
    public bStorage: creatureBar;
    public tCosts: TextField;
    public tHealth: TextField;
    public housing_txt: TextField;
    public tStorage: TextField;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;
    public goo_txt: TextField;
    public tDescription: TextField;
    public tDamage: TextField;
    public damage_txt: TextField;
    public speed_txt: TextField;
    public bHealth: creatureBar;

    constructor() {
        super();
        this.bNext = new Button_CLIP();
        this.tTime = new TextField();
        this.bSpeed = new creatureBar();
        this.time_txt = new TextField();
        this.bResource = new creatureBar();
        this.bInstant = new Button_CLIP();
        this.mcButtons = new MovieClip();
        this.tResource = new TextField();
        this.bDamage = new creatureBar();
        this.title_txt = new TextField();
        this.bPrevious = new Button_CLIP();
        this.bContinue = new Button_CLIP();
        this.health_txt = new TextField();
        this.mcList = new MovieClip();
        this.txtGuide = new TextField();
        this.prod_label_txt = new TextField();
        this.tSpeed = new TextField();
        this.bTime = new creatureBar();
        this.bStorage = new creatureBar();
        this.tCosts = new TextField();
        this.tHealth = new TextField();
        this.housing_txt = new TextField();
        this.tStorage = new TextField();
        this.mcImage = new MovieClip();
        this.mcFrame = new frame_CLIP();
        this.goo_txt = new TextField();
        this.tDescription = new TextField();
        this.tDamage = new TextField();
        this.damage_txt = new TextField();
        this.speed_txt = new TextField();
        this.bHealth = new creatureBar();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
