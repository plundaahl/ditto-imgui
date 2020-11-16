import { ServiceAPI } from './services';
import { CoreAPI } from './core';
import { ControllerAPI } from './controllers';

export interface DittoContext extends ServiceAPI, CoreAPI {
    readonly controller: ControllerAPI,
    beginLayer(key: string, flags?: number): void;
    endLayer(): void;
    beginElement(key: string, flags?: number): void;
    endElement(): void;
    render(): void;
}

