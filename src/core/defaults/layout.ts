import { UiElement } from '../types';

const PADDING = 5;
const PADDING_X2 = PADDING * 2;

export function basicVerticalLayoutFn(parent: UiElement) {
    const siblings = parent.children;
    const element = siblings[siblings.length - 1];
    const prevElem = siblings[siblings.length - 2];

    element.bounds.x = parent.bounds.x + PADDING;

    element.bounds.y = (prevElem
        ? prevElem.bounds.y + prevElem.bounds.h
        : parent.bounds.y) + PADDING;

    element.bounds.w = parent.bounds.w - PADDING_X2;
}

