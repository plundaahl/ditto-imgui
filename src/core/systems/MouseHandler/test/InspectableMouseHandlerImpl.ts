import { UiElement } from '../../../types';
import { MouseHandlerImpl } from '../MouseHandlerImpl';

export class InspectableMouseHandlerImpl extends MouseHandlerImpl {
    getBuildStack(): UiElement[] {
        return this.buildStack;
    }

    getHoverCandidates(): UiElement[] {
        return this.hoverCandidates;
    }

    getParentsOfCandidates(): Set<UiElement> {
        return this.parentsOfCandidates;
    }

    getHoveredElementKey(): string | undefined {
        return this.hoveredElement;
    }

    getHoveredElementParents(): string[] {
        return this.parentsOfHoveredElement;
    }
    
    getFloatHoveredElementParents(): string[] {
        return this.floatParentsOfHoveredElement;
    }
}
