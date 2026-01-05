import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { TUTORIALARROWMC_CLIP } from './TUTORIALARROWMC_CLIP';

/**
 * TUTORIALPOPUPMC_CLIP - Tutorial popup clip
 * Contains UI elements for tutorial popups
 * Converted from ActionScript to TypeScript
 */
export class TUTORIALPOPUPMC_CLIP extends MovieClip {
    public mcArrow!: TUTORIALARROWMC_CLIP;
    public mcBubble!: MovieClip;
    public mcText!: TextField;
    public mcButton!: Button_CLIP;
    public mcBlocker!: MovieClip;

    constructor() {
        super();
    }
}
