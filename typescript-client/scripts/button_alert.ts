import MovieClip from 'openfl/display/MovieClip';
import { button_spinner } from './button_spinner';

/**
 * button_alert - Alert badge for buttons
 * Shows notification count on buttons
 * Converted from ActionScript to TypeScript
 */
export class button_alert extends MovieClip {
    public mcSpin!: button_spinner;
    public mcCounter!: MovieClip;

    constructor() {
        super();
    }
}
