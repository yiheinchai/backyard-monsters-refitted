import MovieClip from 'openfl/display/MovieClip';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
import { MONSTERBAITER } from './MONSTERBAITER';
import { MONSTERBAITERPOPUP_CLIP } from './MONSTERBAITERPOPUP_CLIP';
import { MonsterBaiterItem } from './MonsterBaiterItem';
import { POPUPSETTINGS } from './POPUPSETTINGS';
import { SOUNDS } from './SOUNDS';
import { STORE } from './STORE';

/**
 * MONSTERBAITERPOPUP - Monster baiter popup for attack setup
 * Converted from ActionScript to TypeScript
 */
export class MONSTERBAITERPOPUP extends MONSTERBAITERPOPUP_CLIP {
    private static readonly BAITER_BAR_WIDTH: number = 535;
    
    public monsters: any[];
    public _arrows: any[];
    public _attackPt: Point;
    public _attackIndex: number;
    private attackArrow: MovieClip;
    private attackStrings: string[];
    private items: MonsterBaiterItem[];
    private _guidePage: number = 1;

    constructor() {
        super();
        this.title_txt.htmlText = KEYS.Get("bait_title");
    }

    public Setup(param1: any, param2: number): void {
        let _loc4_: number = 0;
        let _loc6_: MovieClip = null;
        let _loc7_: MovieClip = null;
        let _loc8_: MonsterBaiterItem = null;
        
        this.clearBtn.SetupKey("bait_clear_btn");
        this.clearBtn.addEventListener(MouseEvent.CLICK, this.clearDown.bind(this));
        this.tSize.htmlText = "<b>" + KEYS.Get("size_of_attack") + "</b>";
        this.tUpgrade.htmlText = KEYS.Get("upgrade_monster_baiter");
        this.sendBtn.SetupKey("bait_start_btn");
        this.sendBtn.addEventListener(MouseEvent.CLICK, this.onSendDown.bind(this));
        this.attackStrings = ["tl", "tr", "br", "bl", "t", "r", "b", "l"];
        this.monsters = [this.m1, this.m2, this.m3, this.m4, this.m5, this.m6, this.m7, this.m8, this.m9, this.m10, this.m11, this.m12, this.m13, this.m14];
        this.sendBtn.Highlight = true;
        this.items = [];
        
        _loc4_ = 1;
        while (_loc4_ < 15) {
            _loc8_ = new MonsterBaiterItem();
            (this as any)["m" + _loc4_].addChild(_loc8_);
            _loc8_.Setup("C" + _loc4_);
            _loc8_._count = param1["C" + _loc4_];
            _loc8_.Update();
            _loc8_.addEventListener(Event.CHANGE, this.onChange.bind(this));
            _loc8_.addEventListener("increment", this.onIncrementAttempt.bind(this));
            this.items.push(_loc8_);
            _loc4_++;
        }
        
        const _loc5_: MovieClip[] = [this.tl_mc, this.tr_mc, this.br_mc, this.bl_mc, this.t_mc, this.r_mc, this.b_mc, this.l_mc];
        this._arrows = GLOBAL._bBaiter._lvl.Get() >= 3 ? _loc5_.splice(0, 8) : _loc5_.splice(0, 4);
        if (param2 >= this._arrows.length) {
            param2 = 0;
        }
        for (const _loc6_item of _loc5_) {
            _loc6_ = _loc6_item;
            _loc6_.visible = false;
        }
        for (const _loc7_item of this._arrows) {
            _loc7_ = _loc7_item;
            _loc7_.gotoAndStop(2);
            _loc7_.addEventListener(MouseEvent.CLICK, this.handleArrowDown.bind(this));
            _loc7_.buttonMode = true;
        }
        this._attackIndex = param2;
        this.setAttackDirection(this._arrows[param2]);
        this.Update();
    }

    private handleArrowDown(param1: MouseEvent): void {
        const _loc2_: MovieClip = param1.target as MovieClip;
        if (_loc2_ != this.attackArrow) {
            this.setAttackDirection(_loc2_);
        }
    }

    private onBuyDown(param1: MouseEvent): void {
        STORE.ShowB(2, 1, ["MUSK"]);
    }

    private onIncrementAttempt(param1: Event): void {
        const _loc2_: number = MONSTERBAITER._musk / MONSTERBAITER._muskLimit * 100;
        let _loc3_: number = 0;
        for (const _loc4_ of this.items) {
            _loc3_ += _loc4_.getCost();
        }
    }

    private clearDown(param1: MouseEvent): void {
        const _loc2_: any = {};
        for (const _loc3_ of this.items) {
            _loc3_._count = 0;
            _loc2_[_loc3_._key] = _loc3_._count;
            _loc3_.Update();
        }
        MONSTERBAITER._queue = _loc2_;
        this.Update();
        SOUNDS.Play("click1");
    }

    public setAttackDirection(param1: MovieClip): void {
        const _loc2_: Point[] = [new Point(400, 180), new Point(400, 270), new Point(400, 0), new Point(400, 90), new Point(400, 225), new Point(400, 315), new Point(400, 45), new Point(400, 135)];
        if (this.attackArrow) {
            this.attackArrow.gotoAndStop(2);
        }
        let _loc3_: number = 0;
        while (_loc3_ < this._arrows.length) {
            if (this._arrows[_loc3_] == param1) {
                param1.gotoAndStop(1);
                this._attackPt = _loc2_[_loc3_];
                this._attackIndex = _loc3_;
                this.attackArrow = param1;
                this._arrows[_loc3_].removeEventListener(MouseEvent.CLICK, this.handleArrowDown.bind(this));
            } else {
                this._arrows[_loc3_].addEventListener(MouseEvent.CLICK, this.handleArrowDown.bind(this));
            }
            _loc3_++;
        }
        MONSTERBAITER._attackDir = this._attackIndex;
        MONSTERBAITER._attackPt = _loc2_[this._attackIndex];
    }

    private onChange(param1: Event | null = null): void {
        const _loc2_: any = {};
        for (const _loc3_ of this.items) {
            _loc2_[_loc3_._key] = _loc3_._count;
        }
        MONSTERBAITER._queue = _loc2_;
    }

    public Tick(): void {
    }

    public Update(): void {
        let _loc1_: number = 0;
        for (const _loc2_ of this.items) {
            _loc1_ += _loc2_.getCost();
        }
        this.clearBtn.Enabled = _loc1_ > 0;
        const _loc3_: number = MONSTERBAITER._musk / MONSTERBAITER._muskLimit * 100;
        let _loc4_: number = MONSTERBAITER._musk - _loc1_;
        if (_loc4_ < 0) {
            _loc4_ = 0;
        }
        (this.mcStorage as any).mcBar.width = (1 - _loc4_ / MONSTERBAITER._muskLimit) * MONSTERBAITERPOPUP.BAITER_BAR_WIDTH;
        (this.mcStorage as any).mcBarB.width = 0;
        const _loc5_: number = MONSTERBAITER._musk - _loc1_;
        for (const _loc2_ of this.items) {
            _loc2_.Enable(_loc2_._cost <= _loc5_);
            _loc2_.Update();
        }
        if (_loc1_ > MONSTERBAITER._musk || _loc1_ == 0) {
            this.sendBtn.Enabled = false;
            this.sendBtn.removeEventListener(MouseEvent.CLICK, this.onSendDown.bind(this));
        } else {
            this.sendBtn.Enabled = true;
            this.sendBtn.addEventListener(MouseEvent.CLICK, this.onSendDown.bind(this));
        }
    }

    private onSendDown(param1: MouseEvent): void {
        MONSTERBAITER.Hide();
        let _loc2_: number = 0;
        for (const _loc3_ of this.items) {
            _loc2_ += _loc3_.getCost();
        }
        MONSTERBAITER._musk -= _loc2_;
        MONSTERBAITER.PrepAttack();
    }

    public Help(param1: MouseEvent | null = null): void {
        const _loc2_: number = 7;
        this._guidePage += 1;
        if (this._guidePage > _loc2_) {
            this._guidePage = 1;
        }
        this.gotoAndStop(this._guidePage);
        if (this._guidePage > 1) {
            this.txtGuide.htmlText = KEYS.Get("bait_tut_" + (this._guidePage - 1));
            if (this._guidePage == 2) {
                this.bContinue.addEventListener(MouseEvent.CLICK, this.Help.bind(this));
                this.bContinue.SetupKey("btn_continue");
            }
        }
    }

    public Hide(): void {
        MONSTERBAITER.Hide();
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
