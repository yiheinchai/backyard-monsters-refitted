import MovieClip from 'openfl/display/MovieClip';
import SimpleButton from 'openfl/display/SimpleButton';
import TextField from 'openfl/text/TextField';

export class HousingPersistentPopup_CLIP extends MovieClip {
    public bTransfer: MovieClip;
    public bJuice: MovieClip;
    public bClear: MovieClip;
    public bHealAll: MovieClip;
    public tHealthText: TextField;
    public tCapacityText: TextField;
    public tJuicingText: TextField;
    public tTitleHealing: TextField;
    public tTitleHousing: TextField;
    public tTitleBunkers: TextField;
    public m_bgWhite: MovieClip;
    public monsterContainer: MovieClip;
    public monsterContainerMask: MovieClip;
    public m_line: MovieClip;
    public mcStorage: MovieClip;
    public title_txt: TextField;
    public capacity_desc_txt: TextField;
    public tAscendText: TextField;
    public tStorage: TextField;
    public mcOverdrive: MovieClip;
    public mcMessage: MovieClip;
    public bContinue: SimpleButton;
    public txtGuide: TextField;

    constructor() {
        super();
        this.bTransfer = new MovieClip();
        this.bJuice = new MovieClip();
        this.bClear = new MovieClip();
        this.bHealAll = new MovieClip();
        this.tHealthText = new TextField();
        this.tCapacityText = new TextField();
        this.tJuicingText = new TextField();
        this.tTitleHealing = new TextField();
        this.tTitleHousing = new TextField();
        this.tTitleBunkers = new TextField();
        this.m_bgWhite = new MovieClip();
        this.monsterContainer = new MovieClip();
        this.monsterContainerMask = new MovieClip();
        this.m_line = new MovieClip();
        this.mcStorage = new MovieClip();
        this.title_txt = new TextField();
        this.capacity_desc_txt = new TextField();
        this.tAscendText = new TextField();
        this.tStorage = new TextField();
        this.mcOverdrive = new MovieClip();
        this.mcMessage = new MovieClip();
        this.bContinue = new SimpleButton();
        this.txtGuide = new TextField();
    }
}
