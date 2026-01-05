import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

/**
 * CREATUREBUTTON_CLIP - Base UI clip class for Creature Button
 * Contains all UI element declarations for creature selection buttons
 * Converted from ActionScript to TypeScript
 */
export class CREATUREBUTTON_CLIP extends MovieClip {
    public _creatureImage!: MovieClip;
    public txtNumber!: TextField;
    public _bg!: MovieClip;
    public txtName!: TextField;
    public bLess!: Button_CLIP;
    public mcImage!: MovieClip;
    public bMore!: Button_CLIP;

    constructor() {
        super();
    }
}
