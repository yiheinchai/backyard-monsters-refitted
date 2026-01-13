import DisplayObject from 'openfl/display/DisplayObject';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import { Chat } from './com/monsters/chat/Chat';
import { icon_worker } from './icon_worker';
import { icon_worker_inferno } from './icon_worker_inferno';
import { bubblepopupRight } from './bubblepopupRight';
import { bubblepopup } from './bubblepopup';
import { GLOBAL } from './GLOBAL';
import { BASE } from './BASE';
import { KEYS } from './KEYS';
import { QUEUE } from './QUEUE';
import { STORE } from './STORE';
import { TUTORIAL } from './TUTORIAL';
import { UI2 } from './UI2';

export class UI_WORKERS {
    private static _do: DisplayObject;
    private static _mc: MovieClip;
    private static _workers: any[];
    private static _popupdo: DisplayObject;
    private static _popupID: number;
    private static _popupmc: bubblepopupRight;
    private static _popupmc2: bubblepopup;
    private static _maxWorkers: number;
    private static _workerMCOffset: number = 45;
    private static _canUseHorizontal: boolean = false;

    constructor() {
    }

    public static Setup(): void {
        if (UI_WORKERS._do && UI_WORKERS._do.parent) {
            UI_WORKERS._do.parent.removeChild(UI_WORKERS._do);
            UI_WORKERS._do = null;
        }
        UI_WORKERS._mc = new MovieClip();
        UI_WORKERS._workers = [];
        if (GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD) {
            UI_WORKERS._maxWorkers = 5;
            if (!BASE.isMainYard) {
                UI_WORKERS._maxWorkers = 1;
            }
            for (let _loc1_ = 0; _loc1_ < UI_WORKERS._maxWorkers; _loc1_++) {
                let _loc2_: MovieClip;
                if (GLOBAL.InfernoMode()) {
                    _loc2_ = new icon_worker_inferno();
                } else {
                    _loc2_ = new icon_worker();
                }
                _loc2_.y = 20 + _loc1_ * UI_WORKERS._workerMCOffset;
                _loc2_.mouseChildren = false;
                _loc2_.addEventListener(MouseEvent.CLICK, UI_WORKERS.MouseClicked(_loc1_));
                _loc2_.addEventListener(MouseEvent.MOUSE_OVER, UI_WORKERS.MouseOver(_loc1_));
                _loc2_.addEventListener(MouseEvent.MOUSE_OUT, UI_WORKERS.MouseOut);
                _loc2_.buttonMode = true;
                UI_WORKERS._mc.addChild(_loc2_);
                UI_WORKERS._workers.push({
                    "purchased": false,
                    "active": false,
                    "id": 0,
                    "message": "",
                    "mc": _loc2_
                });
            }
            UI_WORKERS._do = GLOBAL._layerUI.addChild(UI_WORKERS._mc);
        }
        UI_WORKERS.Update();
        if (!UI2._showBottom) {
            UI_WORKERS.Hide();
        }
    }

    private static MouseOver(i: number): (event?: MouseEvent) => void {
        return (param1: MouseEvent = null): void => {
            let _loc3_: string;
            const _loc2_ = UI_WORKERS._workers[i];
            if (_loc2_.purchased) {
                if (_loc2_.active) {
                    _loc3_ = _loc2_.message;
                } else {
                    _loc3_ = KEYS.Get("ui_worker_idle");
                }
            } else {
                _loc3_ = KEYS.Get("ui_worker_hire");
            }
            UI_WORKERS.PopupShow(UI_WORKERS._mc.x - 5, UI_WORKERS._mc.y + UI_WORKERS._workerMCOffset / 2 + i * UI_WORKERS._workerMCOffset + UI_WORKERS._workerMCOffset * 0.5, _loc3_, i);
        };
    }

    private static MouseOut(param1: MouseEvent): void {
        UI_WORKERS.PopupHide();
    }

    private static MouseClicked(i: number): (event?: MouseEvent) => void {
        return (param1: MouseEvent = null): void => {
            if (UI_WORKERS._workers[i]) {
                if (UI_WORKERS._workers[i].purchased) {
                    QUEUE.JumpToWorker(i);
                } else {
                    STORE.ShowB(1, 0, ["BEW"]);
                }
            }
        };
    }

    public static Update(): void {
        let _loc1_ = false;
        for (let _loc2_ = 0; _loc2_ < UI_WORKERS._workers.length; _loc2_++) {
            const _loc3_ = UI_WORKERS._workers[_loc2_];
            if (QUEUE._stack && QUEUE._stack[_loc2_]) {
                const _loc4_ = QUEUE._stack[_loc2_];
                if (_loc3_.id != _loc4_.id) {
                    _loc3_.id = _loc4_.id;
                }
                _loc3_.message = "<b>" + _loc4_.title + "</b> " + _loc4_.message;
                if (!_loc3_.purchased) {
                    _loc3_.purchased = true;
                    _loc1_ = true;
                }
                if (_loc3_.active != _loc4_.active) {
                    _loc3_.active = _loc4_.active;
                    _loc1_ = true;
                }
                if (_loc3_.active && UI_WORKERS._popupID == _loc2_) {
                    UI_WORKERS.PopupUpdate(_loc3_.message);
                }
            }
        }
        if (_loc1_) {
            UI_WORKERS.Render();
        }
        UI_WORKERS.Resize();
    }

    public static Resize(): void {
        if (!Chat.flagsShouldChatDisplay() && UI_WORKERS._canUseHorizontal) {
            if (UI_WORKERS._mc) {
                UI_WORKERS._mc.x = GLOBAL._SCREEN.x;
                UI_WORKERS._mc.y = GLOBAL._SCREEN.bottom - 52;
            }
        } else if (UI_WORKERS._mc) {
            UI_WORKERS._mc.x = GLOBAL._SCREEN.x + GLOBAL._SCREEN.width - UI_WORKERS._workerMCOffset;
            const _loc1_ = UI2._wildMonsterBar ? 20 : 0;
            UI_WORKERS._mc.y = GLOBAL._SCREEN.top + 50 + _loc1_ + 30 * UI2.TimersVisible();
        }
    }

    private static Render(): void {
        for (let _loc1_ = 0; _loc1_ < UI_WORKERS._maxWorkers; _loc1_++) {
            const _loc2_ = UI_WORKERS._workers[_loc1_];
            if (_loc2_.purchased) {
                if (_loc2_.active) {
                    _loc2_.mc.gotoAndStop(2);
                } else {
                    _loc2_.mc.gotoAndStop(1);
                }
                if (STORE._storeData.BST) {
                    _loc2_.mc.mcIcon.gotoAndStop(2);
                } else {
                    _loc2_.mc.mcIcon.gotoAndStop(1);
                }
            } else {
                _loc2_.mc.gotoAndStop(3);
                _loc2_.mc.label_txt.htmlText = "<b>" + KEYS.Get("ui_worker_hireicon") + "</b>";
            }
        }
    }

    public static PopupShow(param1: number, param2: number, param3: string, param4: number): void {
        UI_WORKERS.PopupHide();
        UI_WORKERS._popupID = param4;
        UI_WORKERS._popupmc = new bubblepopupRight();
        UI_WORKERS._popupmc.Setup(param1, param2, param3);
        UI_WORKERS._popupmc.Nudge("left");
        UI_WORKERS._popupdo = GLOBAL._layerUI.addChild(UI_WORKERS._popupmc);
    }

    public static PopupUpdate(param1: string): void {
        if (UI_WORKERS._popupmc) {
            UI_WORKERS._popupmc.Update(param1);
        } else if (UI_WORKERS._popupmc2) {
            UI_WORKERS._popupmc2.Update(param1);
        }
    }

    public static PopupHide(): void {
        if (UI_WORKERS._popupdo) {
            if (UI_WORKERS._popupdo.parent == GLOBAL._layerUI) {
                GLOBAL._layerUI.removeChild(UI_WORKERS._popupdo);
            }
            UI_WORKERS._popupdo = null;
        }
    }

    public static Show(): void {
        if (TUTORIAL._stage < 192) {
            UI_WORKERS._mc.visible = false;
        } else {
            UI_WORKERS._mc.visible = true;
        }
    }

    public static Hide(): void {
        UI_WORKERS._mc.visible = false;
    }
}
