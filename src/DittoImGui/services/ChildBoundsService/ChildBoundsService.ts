import { Hookable } from '../../infrastructure/HookRunner';
import { UiElement, Box } from '../../types';

interface ChildBoundsServiceShared {
    getChildBounds(): Readonly<Box>;
}

export interface ChildBoundsServiceAPI extends ChildBoundsServiceShared {}
export interface ChildBoundsServiceCPI extends ChildBoundsServiceShared {}

export interface ChildBoundsService extends Hookable, ChildBoundsServiceCPI, ChildBoundsServiceAPI {
    onBeginElement(element: UiElement): void;
    onEndElement(): void;
}

