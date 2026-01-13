import IOErrorEvent from "openfl/events/IOErrorEvent";

import { EnumYardType } from "../enums/EnumYardType";
import { MapRoom3Cell } from "../MapRoom3Cell";
import { MapRoom3Data } from "../data/MapRoom3Data";
import { MapRoomManager } from "../../maproom_manager/MapRoomManager";
import { Bookmark } from "./Bookmark";
import { SingletonLock } from "../../../../config/singletonlock/SingletonLock";
import { URLLoaderApi } from "../../../../URLLoaderApi";

import { GLOBAL } from "../../../../GLOBAL";
import { KEYS } from "../../../../KEYS";
import { LOGGER } from "../../../../LOGGER";

/**
 * BookmarksManager - manages custom and auto-generated bookmarks for map cells.
 */
export class BookmarksManager {
    private static s_Instance: BookmarksManager | null = null;

    private static readonly BOOKMARKS_VERSION_SAVE_DATA_VALUE: string = "mr3";
    private static readonly BOOKMARKS_VERSION_SAVE_DATA_FIELD: string = "v";
    private static readonly BOOKMARKS_CUSTOM_SAVE_DATA_FIELD: string = "c";
    private static readonly BOOKMARKS_ENEMIES_SAVE_DATA_FIELD: string = "e";
    private static readonly BOOKMARKS_FRIENDS_SAVE_DATA_FIELD: string = "f";
    private static readonly MAX_AUTO_BOOKMARKS: number = 16000;
    private static readonly MAX_CUSTOM_BOOKMARKS: number = 50;

    public static readonly TYPE_CUSTOM: number = 0;
    public static readonly TYPE_ENEMIES: number = 1;
    public static readonly TYPE_FRIENDS: number = 2;
    public static readonly TYPE_PLAYER_RESOURCES: number = 3;
    public static readonly TYPE_PLAYER_STRONGHOLDS: number = 4;

    private m_CustomBookmarks: Array<Bookmark> = [];
    private m_EnemyBookmarks: Array<Bookmark> = [];
    private m_FriendBookmarks: Array<Bookmark> = [];
    private m_PlayerResourceBookmarks: Array<Bookmark> = [];
    private m_PlayerStrongholdBookmarks: Array<Bookmark> = [];

    constructor(lock: SingletonLock) {
        this.m_CustomBookmarks = [];
        this.m_EnemyBookmarks = [];
        this.m_FriendBookmarks = [];
        this.m_PlayerResourceBookmarks = [];
        this.m_PlayerStrongholdBookmarks = [];
    }

    public static get instance(): BookmarksManager {
        BookmarksManager.s_Instance = BookmarksManager.s_Instance || new BookmarksManager(new SingletonLock());
        return BookmarksManager.s_Instance;
    }

    public Setup(data: Record<string, any>, mapData: MapRoom3Data): void {
        const playerCells = mapData.playerOwnedCells;
        const len = playerCells.length;
        for (let i = 0; i < len; i++) {
            const cell = playerCells[i] as MapRoom3Cell;
            switch (cell.cellType) {
                case EnumYardType.RESOURCE:
                    this.AddBookmark(cell, BookmarksManager.TYPE_PLAYER_RESOURCES, false);
                    break;
                case EnumYardType.STRONGHOLD:
                    this.AddBookmark(cell, BookmarksManager.TYPE_PLAYER_STRONGHOLDS, false);
                    break;
            }
        }
        if (!data.hasOwnProperty(BookmarksManager.BOOKMARKS_VERSION_SAVE_DATA_FIELD) || data[BookmarksManager.BOOKMARKS_VERSION_SAVE_DATA_FIELD] !== BookmarksManager.BOOKMARKS_VERSION_SAVE_DATA_VALUE) {
            return;
        }
        if (data.hasOwnProperty(BookmarksManager.BOOKMARKS_CUSTOM_SAVE_DATA_FIELD)) {
            this.LoadBookmarksOfType(data[BookmarksManager.BOOKMARKS_CUSTOM_SAVE_DATA_FIELD], mapData, BookmarksManager.TYPE_CUSTOM);
        }
        if (data.hasOwnProperty(BookmarksManager.BOOKMARKS_ENEMIES_SAVE_DATA_FIELD)) {
            this.LoadBookmarksOfType(data[BookmarksManager.BOOKMARKS_ENEMIES_SAVE_DATA_FIELD], mapData, BookmarksManager.TYPE_ENEMIES);
        }
        if (data.hasOwnProperty(BookmarksManager.BOOKMARKS_FRIENDS_SAVE_DATA_FIELD)) {
            this.LoadBookmarksOfType(data[BookmarksManager.BOOKMARKS_FRIENDS_SAVE_DATA_FIELD], mapData, BookmarksManager.TYPE_FRIENDS);
        }
    }

    public SaveBookmarks(): void {
        const saveData: Record<string, any> = {};
        saveData[BookmarksManager.BOOKMARKS_VERSION_SAVE_DATA_FIELD] = BookmarksManager.BOOKMARKS_VERSION_SAVE_DATA_VALUE;
        saveData[BookmarksManager.BOOKMARKS_CUSTOM_SAVE_DATA_FIELD] = this.SaveBookmarksOfType(BookmarksManager.TYPE_CUSTOM);
        saveData[BookmarksManager.BOOKMARKS_ENEMIES_SAVE_DATA_FIELD] = this.SaveBookmarksOfType(BookmarksManager.TYPE_ENEMIES);
        saveData[BookmarksManager.BOOKMARKS_FRIENDS_SAVE_DATA_FIELD] = this.SaveBookmarksOfType(BookmarksManager.TYPE_FRIENDS);
        MapRoomManager.instance.bookmarkData = saveData;
        const url = GLOBAL._apiURL + "player/savebookmarks";
        const params = [["bookmarks", JSON.stringify(saveData)]];
        new URLLoaderApi().load(url, params, this.OnBookmarksSaved.bind(this), this.OnBookmarksSavedError.bind(this));
    }

    private OnBookmarksSaved(result: Record<string, any>): void {
        if (result.error !== 0) {
            LOGGER.Log("err", "BookmarksManager.SaveBookmarks", result.error);
        }
    }

    private OnBookmarksSavedError(event: IOErrorEvent): void {
        LOGGER.Log("err", "BookmarksManager.SaveBookmarks HTTP");
    }

    private SaveBookmarksOfType(type: number): Array<Record<string, any>> {
        const bookmarks = this.GetBookmarksOfType(type);
        if (bookmarks === null) {
            return [];
        }
        const result: Array<Record<string, any>> = [];
        for (const bookmark of bookmarks) {
            if (bookmark === null || bookmark.mapCell === null) {
                continue;
            }
            result.push({
                "x": bookmark.mapCell.cellX,
                "y": bookmark.mapCell.cellY,
                "n": bookmark.userDefinedName
            });
        }
        return result;
    }

    private LoadBookmarksOfType(data: Array<any>, mapData: MapRoom3Data, type: number): void {
        const bookmarks = this.GetBookmarksOfType(type);
        if (bookmarks === null) {
            return;
        }
        for (const entry of data) {
            if (entry !== null) {
                const x = entry.x;
                const y = entry.y;
                const cell = mapData.GetMapRoom3Cell(x, y);
                if (cell !== null) {
                    const name = String(entry.n);
                    const bookmark = new Bookmark(cell, name);
                    bookmarks.push(bookmark);
                }
            }
        }
    }

    public Cleanup(): void {
        this.ClearBookmarks(BookmarksManager.TYPE_CUSTOM);
        this.ClearBookmarks(BookmarksManager.TYPE_ENEMIES);
        this.ClearBookmarks(BookmarksManager.TYPE_FRIENDS);
        this.ClearBookmarks(BookmarksManager.TYPE_PLAYER_RESOURCES);
        this.ClearBookmarks(BookmarksManager.TYPE_PLAYER_STRONGHOLDS);
    }

    public AddBookmark(cell: MapRoom3Cell, type: number = 0, save: boolean = true): void {
        const bookmarks = this.GetBookmarksOfType(type);
        if (bookmarks === null) {
            return;
        }
        if (this.IsBookmarked(cell, type)) {
            return;
        }
        const maxBookmarks = type === BookmarksManager.TYPE_CUSTOM ? BookmarksManager.MAX_CUSTOM_BOOKMARKS : BookmarksManager.MAX_AUTO_BOOKMARKS;
        if (bookmarks.length >= maxBookmarks) {
            GLOBAL.Message(KEYS.Get("mr3_bookmarks_full_message", { "v1": maxBookmarks }));
            return;
        }
        const bookmark = new Bookmark(cell);
        bookmarks.unshift(bookmark);
        if (save) {
            this.SaveBookmarks();
        }
        if (cell.cellGraphic !== null) {
            cell.cellGraphic.redrawTile();
        }
    }

    public RemoveBookmark(cell: MapRoom3Cell, type: number = 0, save: boolean = true): void {
        const bookmarks = this.GetBookmarksOfType(type);
        if (bookmarks === null) {
            return;
        }
        const bookmark = this.FindBookmark(cell, type);
        if (bookmark === null) {
            return;
        }
        const index = bookmarks.indexOf(bookmark);
        if (index < 0) {
            return;
        }
        bookmarks.splice(index, 1);
        if (save) {
            this.SaveBookmarks();
        }
        if (cell.cellGraphic !== null) {
            cell.cellGraphic.redrawTile();
        }
    }

    public ClearBookmarks(type: number = 0, save: boolean = false): void {
        const bookmarks = this.GetBookmarksOfType(type);
        if (bookmarks === null) {
            return;
        }
        for (const bookmark of bookmarks) {
            bookmark.Clear();
        }
        bookmarks.length = 0;
        if (save) {
            this.SaveBookmarks();
        }
    }

    public IsBookmarked(cell: MapRoom3Cell, type: number = 0): boolean {
        return this.FindBookmark(cell, type) !== null;
    }

    private FindBookmark(cell: MapRoom3Cell, type: number = 0): Bookmark | null {
        const bookmarks = this.GetBookmarksOfType(type);
        if (bookmarks === null) {
            return null;
        }
        for (const bookmark of bookmarks) {
            if (bookmark !== null && bookmark.mapCell === cell) {
                return bookmark;
            }
        }
        return null;
    }

    public GetBookmarksOfType(type: number): Array<Bookmark> | null {
        switch (type) {
            case BookmarksManager.TYPE_CUSTOM:
                return this.m_CustomBookmarks;
            case BookmarksManager.TYPE_ENEMIES:
                return this.m_EnemyBookmarks;
            case BookmarksManager.TYPE_FRIENDS:
                return this.m_FriendBookmarks;
            case BookmarksManager.TYPE_PLAYER_RESOURCES:
                return this.m_PlayerResourceBookmarks;
            case BookmarksManager.TYPE_PLAYER_STRONGHOLDS:
                return this.m_PlayerStrongholdBookmarks;
            default:
                return null;
        }
    }
}
