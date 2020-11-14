import { ServiceAPI } from './services';

export interface DittoContext extends ServiceAPI {
    beginLayer(key: string): void;
    endLayer(): void;
    beginElement(key: string): void;
    endElement(): void;
    render(): void;
}

