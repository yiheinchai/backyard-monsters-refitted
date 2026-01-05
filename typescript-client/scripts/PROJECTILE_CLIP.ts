import MovieClip from 'openfl/display/MovieClip';

/**
 * PROJECTILE_CLIP - Projectile display CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="PROJECTILE_CLIP")]
 */
export class PROJECTILE_CLIP extends MovieClip {
    public mcProjectile: MovieClip;
    public mcShadow: MovieClip;

    constructor() {
        super();
        this.mcProjectile = new MovieClip();
        this.mcShadow = new MovieClip();
    }
}
