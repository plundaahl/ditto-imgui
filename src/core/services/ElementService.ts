import { UiElement } from '../types';

export interface ElementService {
    getCurrentElement(): UiElement;
}

export interface ElementServiceSPI {
    setCurrentElement(element: UiElement): void;
}

export class ElementServiceImpl implements ElementService, ElementServiceSPI {
    private currentElement: UiElement;

    getCurrentElement(): UiElement {
        return this.currentElement;
    }

    setCurrentElement(element: UiElement): void {
        this.currentElement = element;
    }
}

