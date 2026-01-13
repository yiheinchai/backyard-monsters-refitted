import { IPlayerHandler } from "../interfaces/IPlayerHandler";
import { Player } from "../player/Player";
import { BaseBuff } from "./BaseBuff";
import { BaseBuffLibrary } from "./BaseBuffLibrary";

// Helper function
declare function print(msg: string): void;

/**
 * Base buff handler - manages active buffs for the player.
 */
export class BaseBuffHandler implements IPlayerHandler {
    public static instance: BaseBuffHandler = new BaseBuffHandler();

    private m_buffs: Array<BaseBuff> | null = null;
    private m_player: Player | null = null;
    private m_isInitialized: boolean = false;

    constructor() {}

    public get isInitialized(): boolean {
        return this.m_isInitialized;
    }

    public getBuffByID(buffId: number): BaseBuff | null {
        if (!this.isInitialized || !this.m_buffs) {
            return null;
        }
        
        for (let i = 0; i < this.m_buffs.length; i++) {
            const buff = this.m_buffs[i];
            if (buffId === buff.id) {
                return buff;
            }
        }
        return null;
    }

    public getBuffByName(name: string): BaseBuff | null {
        if (!this.m_buffs) {
            return null;
        }
        
        for (let i = 0; i < this.m_buffs.length; i++) {
            const buff = this.m_buffs[i];
            if (name === buff.name) {
                return buff;
            }
        }
        return null;
    }

    public addBuffByID(buffId: number): BaseBuff | null {
        const buff = BaseBuffLibrary.getBuffByID(buffId);
        if (buff) {
            this.addBuff(buff);
        }
        return buff;
    }

    private addBuff(buff: BaseBuff): void {
        if (this.m_buffs) {
            this.m_buffs.push(buff);
            buff.apply();
            print("added base buff " + buff + "(id:" + buff.id + ") with a value of " + buff.value);
        }
    }

    public clearBuffs(): void {
        this.m_isInitialized = false;
        if (!this.m_buffs) {
            return;
        }
        
        for (let i = this.m_buffs.length - 1; i >= 0; i--) {
            this.m_buffs[i].clear();
            this.m_buffs.splice(i, 1);
        }
    }

    public exportData(): any {
        return null;
    }

    public importData(data: any): void {
        for (const key in data) {
            const id = parseInt(key);
            if (!isNaN(id) && data[key] !== null && data[key] !== 0) {
                const state = this.m_player && this.m_player.isAttacking ? BaseBuffLibrary.k_ATTACKING : BaseBuffLibrary.k_DEFENDING;
                const buff = BaseBuffLibrary.getBuffByID(id, state);
                if (buff) {
                    buff.value = data[key];
                    this.addBuff(buff);
                }
            }
        }
    }

    public initialize(options: any = null): void {
        if (!this.m_buffs) {
            BaseBuffLibrary.initialize();
            this.m_buffs = [];
        }
        this.m_isInitialized = true;
    }

    public get name(): string {
        return "buffs";
    }

    public set player(value: Player) {
        this.m_player = value;
    }
}
