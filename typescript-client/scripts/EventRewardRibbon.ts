import { MovieClip } from 'openfl/display/MovieClip';
import { RewardLayerMask } from './RewardLayerMask';
import { RewardRibbon } from './RewardRibbon';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="EventRewardRibbon")]
@Embed({ source: "/_assets/assets.swf", symbol: "EventRewardRibbon" })
export class EventRewardRibbon extends MovieClip {
    public rewardLayerMask1: RewardLayerMask;
    public rewardRibbon0: RewardRibbon;
    public rewardImage0: MovieClip;

    constructor() {
        super();
    }
}
