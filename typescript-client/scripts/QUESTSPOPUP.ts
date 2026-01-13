import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import { ImageCache } from './com/monsters/display/ImageCache';
import { PopupInfoMonster } from './com/monsters/maproom_advanced/PopupInfoMonster';
import { SiegeWeapons } from './com/monsters/siege/SiegeWeapons';
import { SiegeWeapon } from './com/monsters/siege/weapons/SiegeWeapon';
import { QUESTSPOPUP_CLIP } from './QUESTSPOPUP_CLIP';
import { QUESTGROUP } from './QUESTGROUP';
import { QUESTINFO } from './QUESTINFO';
import { QUESTITEM } from './QUESTITEM';
import { SpecialRewardInfo } from './SpecialRewardInfo';
import { QUESTS } from './QUESTS';
import { KEYS } from './KEYS';
import { SOUNDS } from './SOUNDS';
import { GLOBAL } from './GLOBAL';
import { BASE } from './BASE';
import { Button } from './Button';
import { POPUPSETTINGS } from './POPUPSETTINGS';

export class QUESTSPOPUP extends QUESTSPOPUP_CLIP {
    public _groupsMC: MovieClip;
    public _questsMC: MovieClip;
    public _infoMC: QUESTINFO;
    public _monsterRewardMC: PopupInfoMonster;
    public _specialReward: SpecialRewardInfo;
    public _groupID: number;
    public _questID: string;

    constructor() {
        super();
        this._groupID = -1;
        this._questID = "";
        this.ListGroups();
        this.title_txt.htmlText = KEYS.Get("quests_title");
        for (let _loc1_ = 0; _loc1_ < QUESTS._quests.length; _loc1_++) {
            const _loc2_ = QUESTS._quests[_loc1_];
            if (QUESTS._completed && QUESTS._completed[_loc2_.id] == 1) {
                this.ListQuestsB(_loc2_.group);
                this.ShowQuestB(_loc2_.id);
                break;
            }
        }
    }

    public ListGroups(): void {
        if (this._groupsMC) {
            this.removeChild(this._groupsMC);
            this._groupsMC = null;
        }
        this._groupsMC = this.addChild(new MovieClip()) as MovieClip;
        this._groupsMC.x = -337;
        this._groupsMC.y = -195;

        for (let _loc1_ = 0; _loc1_ < QUESTS._questGroups.length; _loc1_++) {
            const _loc2_ = QUESTS._questGroups[_loc1_];
            const _loc3_ = this._groupsMC.addChild(new QUESTGROUP()) as QUESTGROUP;
            _loc3_.tLabel.htmlText = KEYS.Get(_loc2_.name);
            _loc3_.name = _loc1_.toString();
            _loc3_.x = 10;
            _loc3_.y = 10 + 30 * _loc1_;
            _loc3_.mouseChildren = false;
            _loc3_.buttonMode = true;
            _loc3_.addEventListener(MouseEvent.CLICK, this.ListQuests.bind(this));
            _loc3_.gotoAndStop(1);

            for (let _loc4_ = 0; _loc4_ < QUESTS._quests.length; _loc4_++) {
                const _loc5_ = QUESTS._quests[_loc4_];
                if (QUESTS._completed && _loc5_.group == _loc1_ && QUESTS._completed[_loc5_.id] == 1) {
                    _loc3_.gotoAndStop(3);
                }
                if (this._groupID == _loc1_) {
                    _loc3_.gotoAndStop(2);
                }
            }
        }
    }

    public ListQuests(param1: MouseEvent = null): void {
        SOUNDS.Play("click1");
        if (param1) {
            this._groupID = parseInt(param1.target.name);
            for (let _loc2_ = 0; _loc2_ < QUESTS._quests.length; _loc2_++) {
                const _loc3_ = QUESTS._quests[_loc2_];
                if (_loc3_.group == this._groupID && QUESTS._completed && QUESTS._completed[_loc3_.id] == 1) {
                    this.ShowQuestB(_loc3_.id);
                    break;
                }
            }
            this.ListQuestsB(this._groupID);
        } else {
            this.ListQuestsB(this._groupID);
        }
    }

    public ListQuestsB(groupID: number): void {
        const AddItem = (param1: any, param2: number): number => {
            if (!param1.block) {
                if (param1.id == "BOOKMARK" && !GLOBAL._flags.fanfriendbookmarkquests) {
                    return 0;
                }
                if (param1.id.substr(0, 6) == "INVITE" && !GLOBAL._flags.fanfriendbookmarkquests) {
                    return 0;
                }
                if (param1.id == "FAN" && !GLOBAL._flags.fanfriendbookmarkquests) {
                    return 0;
                }
                const _loc3_ = this._questsMC.addChild(new QUESTITEM()) as QUESTITEM;
                _loc3_.tLabel.htmlText = KEYS.Get(param1.name, param1.keyvars);
                _loc3_.y = 10 + 30 * param2;
                _loc3_.x = 10;
                _loc3_.mouseChildren = false;
                _loc3_.buttonMode = true;
                _loc3_.addEventListener(MouseEvent.CLICK, this.ShowQuest(param1.id));
                _loc3_.gotoAndStop(1);
                if (QUESTS._completed && QUESTS._completed[param1.id] == 1) {
                    _loc3_.gotoAndStop(3);
                } else {
                    _loc3_.mcTick.visible = false;
                }
                if (this._questID == param1.id) {
                    _loc3_.gotoAndStop(2);
                }
                return 1;
            }
            return 0;
        };

        this._groupID = groupID;
        this.ListGroups();

        if (this._questsMC) {
            this.removeChild(this._questsMC);
            this._questsMC = null;
        }
        if (this._infoMC) {
            this.removeChild(this._infoMC);
            this._infoMC = null;
        }

        this._questsMC = this.addChild(new MovieClip()) as MovieClip;
        this._questsMC.x = -188;
        this._questsMC.y = -195;

        let c = 0;
        if (QUESTS._completed) {
            for (let i = 0; i < QUESTS._quests.length; i++) {
                const q = QUESTS._quests[i];
                if (q.group == this._groupID && c < 13) {
                    if (QUESTS._completed[q.id] && QUESTS._completed[q.id] == 1) {
                        c += AddItem(q, c);
                    }
                }
            }
        }

        for (let i = 0; i < QUESTS._quests.length; i++) {
            const q = QUESTS._quests[i];
            if (q.group == this._groupID && c < 13) {
                const show = true;
                if (show && !QUESTS._completed[q.id]) {
                    c += AddItem(q, c);
                }
            }
        }
    }

    public ShowQuest(questID: string): (event: MouseEvent) => void {
        return (param1: MouseEvent): void => {
            this.ShowQuestB(questID);
        };
    }

    public ShowQuestB(questID: string): void {
        this._questID = questID;
        if (this._infoMC) {
            this.removeChild(this._infoMC);
            this._infoMC = null;
        }
        this.ListQuestsB(this._groupID);
        this._infoMC = this.addChild(new QUESTINFO()) as QUESTINFO;
        this._infoMC.x = 8;
        this._infoMC.y = -195;
        this._infoMC.tReward.htmlText = "<b>" + KEYS.Get("popup_label_reward") + "</b>";
        QUESTS._displayedInstructions = true;

        for (let i = 0; i < QUESTS._quests.length; i++) {
            const q = QUESTS._quests[i];
            if (q.id == questID) {
                let description = KEYS.Get(q.description, q.keyvars);
                description = description.replace("#installsgenerated#", BASE._installsGenerated.toString());
                description = description.replace("#mushroomspicked#", QUESTS._global.mushroomspicked.toString());
                description = description.replace("#goldmushroomspicked#", QUESTS._global.goldmushroomspicked.toString());
                description = description.replace("#monstersblended#", QUESTS._global.monstersblended.toString());
                description = description.replace("#giftssent#", QUESTS._global.bonus_gifts.toString());
                description = description.replace("#sentgiftsaccepted#", QUESTS._global.gift_accept.toString());

                if (QUESTS._completed && QUESTS._completed[questID] == 1) {
                    this._infoMC.tDescription.htmlText = "<b>" + KEYS.Get("q_ui_completed") + "</b><br>" + description;
                } else {
                    this._infoMC.tDescription.htmlText = description;
                }

                if (QUESTS._completed && QUESTS._completed[q.id] == 1 || q.hint == "") {
                    this._infoMC.tHint.htmlText = "";
                } else {
                    const hintStr = KEYS.Get(q.hint, q.keyvars);
                    this._infoMC.tHint.htmlText = "<b>" + KEYS.Get("q_ui_hint") + "</b> <i>" + hintStr + "</i>";
                }

                if (q.questimage) {
                    const ImageLoaded = (param1: string, param2: BitmapData): void => {
                        try {
                            this._infoMC.mcImage.addChild(new Bitmap(param2));
                        } catch (e) {
                        }
                    };
                    ImageCache.GetImageWithCallBack("popups/" + q.questimage, ImageLoaded);
                }

                if (q.monster_reward != undefined) {
                    for (let qq = 0; qq < 5; qq++) {
                        if (GLOBAL.mode == GLOBAL._loadmode) {
                            this._infoMC["R" + (qq + 1)].gotoAndStop(qq + 1);
                        } else {
                            this._infoMC["R" + (qq + 1)].gotoAndStop(qq + 7);
                        }
                        this._infoMC["R" + (qq + 1)].visible = false;
                    }
                    this._monsterRewardMC = new PopupInfoMonster();
                    this._monsterRewardMC.Setup(this._infoMC.R1.x, this._infoMC.R1.y, q.reward_creatureid, q.monster_reward);
                    this._infoMC.addChild(this._monsterRewardMC);
                } else if (q.siegeweapon_reward) {
                    for (let n = 1; n <= 5; n++) {
                        this._infoMC["R" + n].visible = false;
                    }
                    const weapon = SiegeWeapons.getWeapon(q.siegeweapon_reward);
                    this._specialReward = new SpecialRewardInfo();
                    this._specialReward.x = this._infoMC.R1.x;
                    this._specialReward.y = this._infoMC.R1.y;
                    this._specialReward.Setup(weapon.name, q.siegeweapon_rewardcount, weapon.rewardImage);
                    this._infoMC.addChild(this._specialReward);
                } else {
                    for (let c = 0; c < 5; c++) {
                        if (GLOBAL.mode == GLOBAL._loadmode) {
                            this._infoMC["R" + (c + 1)].gotoAndStop(c + 1);
                        } else {
                            this._infoMC["R" + (c + 1)].gotoAndStop(c + 7);
                        }
                        this._infoMC["R" + (c + 1)].tTitle.htmlText = KEYS.Get(GLOBAL._resourceNames[c]);
                        this._infoMC["R" + (c + 1)].tValue.htmlText = "<b>" + GLOBAL.FormatNumber(q.reward[c]) + "</b>";
                        this._infoMC["R" + (c + 1)].visible = true;
                    }
                }

                this._infoMC.bCollect.SetupKey("btn_collect");
                if (BASE._pendingPurchase.length == 0) {
                    this._infoMC.bCollect.addEventListener(MouseEvent.CLICK, this.Collect(questID));
                    if (!QUESTS._completed || QUESTS._completed[questID] != 1) {
                        (this._infoMC.bCollect as Button).Enabled = false;
                        this._infoMC.mcArrow.visible = false;
                    } else {
                        (this._infoMC.bCollect as Button).Highlight = true;
                        this._infoMC.mcArrow.visible = true;
                    }
                } else {
                    (this._infoMC.bCollect as Button).Enabled = false;
                }
                break;
            }
        }
    }

    public Collect(questID: string): (event?: MouseEvent) => void {
        return (param1: MouseEvent = null): void => {
            this._infoMC.bCollect.enabled = false;
            QUESTS.CollectB(questID);
            for (let _loc2_ = 0; _loc2_ < QUESTS._quests.length; _loc2_++) {
                const _loc3_ = QUESTS._quests[_loc2_];
                if (QUESTS._completed && QUESTS._completed[_loc3_.id] == 1) {
                    this.ListQuestsB(_loc3_.group);
                    this.ShowQuestB(_loc3_.id);
                    return;
                }
            }
            if (QUESTS._mc) {
                QUESTS.Hide();
            }
        };
    }

    public Hide(): void {
        QUESTS.Hide();
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
