import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

export class HOUSINGPOPUP_CLIP extends MovieClip {
    public title_txt: TextField;
    public capacity_desc_txt: TextField;
    public tAscendText: TextField;
    public tStorage: TextField;
    public mcOverdrive: MovieClip;
    public bCombine: MovieClip;
    public bAscend: MovieClip;
    public tDescription: TextField;
    public tLabel1: TextField;
    public tLabel2: TextField;
    public tLabel3: TextField;
    public tLabel4: TextField;
    public mcArrow: MovieClip;
    public mcResult: MovieClip;
    public mcSlot1: MovieClip;
    public mcSlot2: MovieClip;
    public mcSlot3: MovieClip;
    public mcSlot4: MovieClip;
    public bAction: MovieClip;

    constructor() {
        super();
        this.title_txt = new TextField();
        this.capacity_desc_txt = new TextField();
        this.tAscendText = new TextField();
        this.tStorage = new TextField();
        this.mcOverdrive = new MovieClip();
        this.bCombine = new MovieClip();
        this.bAscend = new MovieClip();
        this.tDescription = new TextField();
        this.tLabel1 = new TextField();
        this.tLabel2 = new TextField();
        this.tLabel3 = new TextField();
        this.tLabel4 = new TextField();
        this.mcArrow = new MovieClip();
        this.mcResult = new MovieClip();
        this.mcSlot1 = new MovieClip();
        this.mcSlot2 = new MovieClip();
        this.mcSlot3 = new MovieClip();
        this.mcSlot4 = new MovieClip();
        this.bAction = new MovieClip();
    }
}
