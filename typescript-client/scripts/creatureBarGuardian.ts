import MovieClip from 'openfl/display/MovieClip';

/**
 * creatureBarGuardian - Guardian creature stat bar CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="creatureBarGuardian")]
 */
export class creatureBarGuardian extends MovieClip {
    public mcBuff1: MovieClip;
    public mcBuff2: MovieClip;
    public mcBar: MovieClip;
    public mcBuff3: MovieClip;

    constructor() {
        super();
        this.mcBuff1 = new MovieClip();
        this.mcBuff2 = new MovieClip();
        this.mcBar = new MovieClip();
        this.mcBuff3 = new MovieClip();
    }
}
