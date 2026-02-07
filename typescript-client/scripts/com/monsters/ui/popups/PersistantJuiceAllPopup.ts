import MouseEvent from "openfl/events/MouseEvent";

import { popup_juice_all } from "../../../../popup_juice_all";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getPOPUPS(): any { return require("../../../../POPUPS").POPUPS; }
function getCREATURES(): any { return require("../../../../CREATURES").CREATURES; }



/**
 * Persistant juice all popup - confirmation popup for juicing all creatures.
 */
export class PersistantJuiceAllPopup extends popup_juice_all {
    protected m_fpAcceptCallback: Function | null = null;
    protected m_fpCloseCallback: Function | null = null;
    protected m_strCreepId: string = "";
    protected m_nTotalCreeps: number = 0;

    constructor() {
        super();
    }

    public setup(creepId: string, acceptCallback: Function, closeCallback: Function): void {
        this.m_fpAcceptCallback = acceptCallback;
        this.m_fpCloseCallback = closeCallback;
        this.m_strCreepId = creepId;
        this.m_nTotalCreeps = getGLOBAL().player.monsterListByID(this.m_strCreepId).numHousedCreeps;
        let resourceMultiplier: number = 0.6;
        let totalResources: number = 0;
        if (getGLOBAL()._bJuicer._lvl.Get() === 2) {
            resourceMultiplier = 0.8;
        } else if (getGLOBAL()._bJuicer._lvl.Get() === 3) {
            resourceMultiplier = 1;
        }
        totalResources += Math.ceil(getCREATURES().GetProperty(this.m_strCreepId, "cResource") * resourceMultiplier) * this.m_nTotalCreeps;
        this.mcFrame.Setup(true, this.cancelCallback.bind(this));
        this.btnCancel.Setup(getKEYS().Get("mh_cancel_btn"));
        this.btnCancel.addEventListener(MouseEvent.CLICK, this.cancelCallback.bind(this), false, 0, true);
        this.btnJuice.Setup(getKEYS().Get("mh_juicemonstersX_btn", {
            "v1": this.m_nTotalCreeps,
            "v2": getGLOBAL().FormatNumber(totalResources)
        }));
        this.btnJuice.addEventListener(MouseEvent.CLICK, this.acceptCallback.bind(this), false, 0, true);
        this.btnJuice.Highlight = true;
        this.tfTitle.htmlText = getKEYS().Get("pm_juiceall_popup_title");
        this.tfBody.htmlText = getKEYS().Get("pm_juiceall_popup_body");
    }

    protected acceptCallback(event: MouseEvent | null = null): void {
        if (this.m_fpAcceptCallback !== null) {
            this.m_fpAcceptCallback(this.m_strCreepId);
        }
        getPOPUPS().Remove(this);
        this.clear();
    }

    protected cancelCallback(event: MouseEvent | null = null): void {
        if (this.m_fpCloseCallback !== null) {
            this.m_fpCloseCallback(event);
        }
        getPOPUPS().Remove(this);
        this.clear();
    }

    protected clear(): void {
        if (this.btnCancel.hasEventListener(MouseEvent.CLICK)) {
            this.btnCancel.removeEventListener(MouseEvent.CLICK, this.cancelCallback.bind(this));
        }
        if (this.btnJuice.hasEventListener(MouseEvent.CLICK)) {
            this.btnJuice.removeEventListener(MouseEvent.CLICK, this.acceptCallback.bind(this));
        }
        this.m_fpAcceptCallback = null;
        this.m_fpCloseCallback = null;
        this.mcFrame.Clear();
    }
}
