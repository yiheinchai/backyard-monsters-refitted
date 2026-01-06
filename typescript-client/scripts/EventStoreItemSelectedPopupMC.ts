import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

// [Embed(source="/_assets/assets.swf", symbol="EventStoreItemSelectedPopupMC")]
export class EventStoreItemSelectedPopupMC extends MovieClip {
    public previewImageHolder: MovieClip;
    public xpCostText: TextField;
    public previewImageFrame: MovieClip;
    public titleImageHolder: MovieClip;
    public experienceDisplay: MovieClip;
    public descriptionText: TextField;
    public purchaseButton: Button_CLIP;
    public prizeNameText: TextField;

    constructor() {
        super();
    }
}
