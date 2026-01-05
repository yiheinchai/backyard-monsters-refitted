import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

export class HousingPersistentMonsterBar extends MovieClip {
    public static readonly k_NormalFrame: number = 1;
    public static readonly k_HealFrame: number = 2;
    public static readonly k_monsterBarDisplayBarWidth: number = 100; // estimated

    public mcIcon: MovieClip;
    public tName: TextField;
    public m_healthBar: MovieClip;
    public m_capacityBar: MovieClip;
    public tCapacityText: TextField;
    public tHealStatusText: TextField;
    public bHeal: MovieClip;
    public bJuice: MovieClip;
    public bFinish: MovieClip;
    public bCancel: MovieClip;
    public m_shine: MovieClip;
    public m_creatureID: string;

    constructor(creatureID: string = "") {
        super();
        this.m_creatureID = creatureID;
        this.mcIcon = new MovieClip();
        this.tName = new TextField();
        this.m_healthBar = new MovieClip();
        this.m_capacityBar = new MovieClip();
        // Setup nested clips for bars if needed, assuming they are accessible
        (this.m_healthBar as any).mcBar = new MovieClip();
        (this.m_capacityBar as any).mcBar = new MovieClip();
        (this.m_capacityBar as any).mcBarGrey = new MovieClip();

        this.tCapacityText = new TextField();
        this.tHealStatusText = new TextField();
        this.bHeal = new MovieClip();
        this.bJuice = new MovieClip();
        this.bFinish = new MovieClip();
        this.bCancel = new MovieClip();
        this.m_shine = new MovieClip();
    }

    public updateTimer(): void {
        // Implementation stub
    }

    public getTimeCost(param: boolean = false): number {
        return 0;
    }

    public getResourceCostInShiny(): number {
        return 0;
    }
}
