import { ServiceAPI } from './services';
import { CoreAPI } from './core';

export interface DittoContext extends ServiceAPI, CoreAPI {
    beginLayer(key: string, flags?: number): void;
    endLayer(): void;
    beginElement(key: string, flags?: number): void;
    endElement(): void;
    render(): void;
}

