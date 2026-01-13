import { Console } from "../../../debug/Console";
import { Component } from "../Component";

import { GLOBAL } from "../../../../../GLOBAL";

/**
 * Temporary component - wraps a component and removes it after a duration.
 */
export class TemporaryComponent extends Component {
    private m_temporaryComponent: Component;
    private m_durationInSeconds: number;
    private m_timeToRemove: number;

    private static s_cachedTimestamp: number = 0;
    private static s_lastCacheFrame: number = -1;

    constructor(component: Component, durationInSeconds: number) {
        super();
        this.m_temporaryComponent = component;
        this.m_durationInSeconds = durationInSeconds;
        this.m_timeToRemove = GLOBAL.Timestamp() + durationInSeconds;
        if (this.m_durationInSeconds <= 1) {
            Console.warning("You tried to add a component(" + component + ") that will be instatly removed... why would you do that?");
        }
    }

    protected override onUnregister(): void {
        this.owner.removeComponent(this.m_temporaryComponent);
    }

    protected override onRegister(): void {
        this.owner.addComponent(this.m_temporaryComponent);
    }

    public override tick(delta: number = 1): void {
        // Cache timestamp to avoid repeated GLOBAL.Timestamp() calls
        // Only update cache once per frame, reuse for all TemporaryComponent instances
        if (TemporaryComponent.s_lastCacheFrame !== GLOBAL._frameNumber) {
            TemporaryComponent.s_cachedTimestamp = GLOBAL.Timestamp();
            TemporaryComponent.s_lastCacheFrame = GLOBAL._frameNumber;
        }

        if (TemporaryComponent.s_cachedTimestamp >= this.m_timeToRemove) {
            this.owner.removeComponent(this);
        }
    }
}
