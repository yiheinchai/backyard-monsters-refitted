import { Component } from "./components/Component";

/**
 * Interface for objects that can own components.
 */
export interface IComponentOwner {
    addComponent(component: Component, name?: string, priority?: number): void;
    removeComponent(component: Component): void;
    getComponent(component: Component): Component | null;
    getComponentByType(type: new (...args: any[]) => Component): Component | null;
    getComponentByName(name: string): Component | null;
}
