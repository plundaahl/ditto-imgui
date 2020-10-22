import { ActionPluginManager, ActionPlugin } from './ActionPluginManager';

export class ActionPluginManagerImpl implements ActionPluginManager {
    private readonly plugins: ActionPlugin[] = [];

    constructor() {
        this.registerPlugin = this.registerPlugin.bind(this);
        this.isElementHighlighted = this.isElementHighlighted.bind(this);
        this.isElementReadied = this.isElementReadied.bind(this);
        this.isElementTriggered = this.isElementTriggered.bind(this);
        this.isElementToggled = this.isElementToggled.bind(this);
        this.isElementQueried = this.isElementQueried.bind(this);
        this.isElementDragged = this.isElementDragged.bind(this);
        this.isElementInteracted = this.isElementInteracted.bind(this);
        this.isChildInteracted = this.isChildInteracted.bind(this);
        this.getDragX = this.getDragX.bind(this);
        this.getDragY = this.getDragY.bind(this);
    }

    registerPlugin(provider: ActionPlugin): void {
        this.plugins.push(provider);
    }

    isElementHighlighted(): boolean {
        for (const provider of this.plugins) {
            if (provider.isElementHighlighted()) {
                return true;
            }
        }
        return false;
    }

    isElementReadied(): boolean {
        for (const provider of this.plugins) {
            if (provider.isElementReadied()) {
                return true;
            }
        }
        return false;
    }

    isElementTriggered(): boolean {
        for (const provider of this.plugins) {
            if (provider.isElementTriggered()) {
                return true;
            }
        }
        return false;
    }

    isElementToggled(): boolean {
        for (const provider of this.plugins) {
            if (provider.isElementToggled()) {
                return true;
            }
        }
        return false;
    }

    isElementQueried(): boolean {
        for (const provider of this.plugins) {
            if (provider.isElementQueried()) {
                return true;
            }
        }
        return false;
    }

    isElementDragged(): boolean {
        for (const provider of this.plugins) {
            if (provider.isElementDragged()) {
                return true;
            }
        }
        return false;
    }

    isElementInteracted(): boolean {
        for (const provider of this.plugins) {
            if (provider.isElementInteracted()) {
                return true;
            }
        }
        return false;
    }

    isChildInteracted(): boolean {
        for (const provider of this.plugins) {
            if (provider.isChildInteracted()) {
                return true;
            }
        }
        return false;
    }

    isFloatingChildInteracted(): boolean {
        for (const provider of this.plugins) {
            if (provider.isFloatingChildInteracted()) {
                return true;
            }
        }
        return false;
    }

    getDragX(): number {
        const provider = this.plugins.find(provider => provider.isElementDragged());
        return provider
            ? provider.getDragX()
            : 0;
    }

    getDragY(): number {
        const provider = this.plugins.find(provider => provider.isElementDragged());
        return provider
            ? provider.getDragY()
            : 0;
    }
}
