import { EnumYardType } from "../enums/EnumYardType";
import { MapRoom3Cell } from "../MapRoom3Cell";

import { KEYS } from "../../../../KEYS";

/**
 * Bookmark - represents a saved map room 3 location.
 */
export class Bookmark {
    private m_MapRoom3Cell: MapRoom3Cell | null;
    private m_UserDefinedName: string = "";

    constructor(cell: MapRoom3Cell, customName: string = "") {
        this.m_MapRoom3Cell = cell;
        this.m_UserDefinedName = customName;
    }

    private static MakeDefaultBookmarkName(cell: MapRoom3Cell): string {
        switch (cell.cellType) {
            case EnumYardType.PLAYER:
                return KEYS.Get("bm_starter_cell_name", { "fname": cell.name });
            case EnumYardType.RESOURCE:
                return KEYS.Get("bm_resource_cell_name", { "v1": cell.baseLevel });
            case EnumYardType.STRONGHOLD:
                return KEYS.Get("bm_stronghold_cell_name", { "v1": cell.baseLevel });
            case EnumYardType.FORTIFICATION:
                return KEYS.Get("bm_fortification_cell_name", { "v1": cell.baseLevel });
            case EnumYardType.EMPTY:
            default:
                if (cell.isOwnedByWildMonster) {
                    return KEYS.Get("bm_wild_monster_cell_name");
                }
                return "";
        }
    }

    public get mapCell(): MapRoom3Cell | null {
        return this.m_MapRoom3Cell;
    }

    public get cellX(): number {
        return this.m_MapRoom3Cell ? this.m_MapRoom3Cell.cellX : -1;
    }

    public get cellY(): number {
        return this.m_MapRoom3Cell ? this.m_MapRoom3Cell.cellY : -1;
    }

    public get displayName(): string {
        return this.m_UserDefinedName ? this.m_UserDefinedName : Bookmark.MakeDefaultBookmarkName(this.m_MapRoom3Cell!);
    }

    public get userDefinedName(): string {
        return this.m_UserDefinedName;
    }

    public set userDefinedName(value: string) {
        this.m_UserDefinedName = value;
    }

    public Clear(): void {
        this.m_MapRoom3Cell = null;
        this.m_UserDefinedName = "";
    }
}
