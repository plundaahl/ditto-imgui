import { ServiceAPI } from './services';
import { CoreAPI } from './core';

export interface DittoContext extends ServiceAPI, CoreAPI {
    beginLayer(key: string): void;
    endLayer(): void;
    beginElement(key: string): void;
    endElement(): void;
    render(): void;
}

