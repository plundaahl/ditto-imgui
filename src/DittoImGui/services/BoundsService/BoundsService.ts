import { Hookable } from '../../infrastructure/HookRunner';
import { UiElement, Box } from '../../types';

interface BoundsServiceShared {
    getElementBounds(): Box;
    getChildBounds(): Readonly<Box>;
    getSiblingBounds(): Readonly<Box>;
    getParentBounds(): Readonly<Box> | undefined;
}

export interface BoundsServiceAPI extends BoundsServiceShared {}
export interface BoundsServiceCPI extends BoundsServiceShared {}

export interface BoundsService extends Hookable, BoundsServiceCPI, BoundsServiceAPI {
    onBeginElement(element: UiElement): void;
    onEndElement(): void;
}

