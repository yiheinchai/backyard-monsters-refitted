import { ImageCache } from "../../display/ImageCache";
import { MapRoom3Cell } from "../MapRoom3Cell";
import { MapRoom3TileSetRange } from "./MapRoom3TileSetRange";

/**
 * Map room 3 tile set - manages tile selection based on cell height.
 */
export class MapRoom3TileSet {
    private m_TileSetInfo: Array<any>;
    private m_TileSetRanges: Array<MapRoom3TileSetRange>;
    private m_URLLookup: Record<string, number>;

    constructor(tileSetInfo: Array<any>) {
        this.m_TileSetInfo = tileSetInfo;
        this.m_TileSetRanges = [];
        this.m_URLLookup = {};
        const altitudes: Array<number> = [];
        const urls: Array<string> = [];
        for (let i = 0; i < this.m_TileSetInfo.length; i++) {
            if (altitudes.indexOf(parseInt(this.m_TileSetInfo[i].min_alt)) === -1) {
                altitudes.push(parseInt(this.m_TileSetInfo[i].min_alt));
            }
            if (altitudes.indexOf(parseInt(this.m_TileSetInfo[i].max_alt)) === -1) {
                altitudes.push(parseInt(this.m_TileSetInfo[i].max_alt));
            }
            urls.push(this.m_TileSetInfo[i].src);
            this.m_URLLookup[this.m_TileSetInfo[i].src] = i;
        }
        altitudes.sort((a, b) => a - b);
        ImageCache.GetImageGroupWithCallBack("map_tiles", urls, this.OnImagesLoaded.bind(this));
        for (let i = 0; i < altitudes.length - 1; i++) {
            const range: MapRoom3TileSetRange = new MapRoom3TileSetRange(altitudes[i], altitudes[i + 1]);
            this.m_TileSetRanges.push(range);
        }
        for (let i = 0; i < this.m_TileSetInfo.length; i++) {
            let j = 0;
            let range: MapRoom3TileSetRange = this.m_TileSetRanges[j];
            while (j < this.m_TileSetRanges.length && range.end <= this.m_TileSetInfo[i].min_alt) {
                j++;
                range = this.m_TileSetRanges[j];
            }
            while (j < this.m_TileSetRanges.length && range.end <= this.m_TileSetInfo[i].max_alt) {
                range.options.push(i);
                j++;
                range = this.m_TileSetRanges[j];
            }
        }
    }

    private OnImagesLoaded(images: Array<any>, groupName: string): void {
        for (let i = 0; i < images.length; i++) {
            const idx: number = this.m_URLLookup[images[i][0]];
            this.m_TileSetInfo[idx].bmd = images[i][1];
        }
    }

    public GetTileToDrawForCell(cell: MapRoom3Cell, seed: number): Record<string, any> | null {
        let result: Record<string, any> | null = null;
        if (cell.cellHeight < this.m_TileSetRanges[0].start) {
            return result;
        }
        let rangeIdx = 0;
        while (rangeIdx < this.m_TileSetRanges.length && this.m_TileSetRanges[rangeIdx].end < cell.cellHeight) {
            rangeIdx++;
        }
        if (rangeIdx < this.m_TileSetRanges.length) {
            const range: MapRoom3TileSetRange = this.m_TileSetRanges[rangeIdx];
            let randSeed: number = seed;
            randSeed ^= randSeed << 21;
            randSeed ^= randSeed >>> 35;
            randSeed ^= randSeed << 4;
            randSeed = Math.abs(randSeed);
            let optionIdx: number = randSeed % range.options.length;
            optionIdx = range.options[optionIdx];
            return this.m_TileSetInfo[optionIdx];
        }
        return result;
    }
}
