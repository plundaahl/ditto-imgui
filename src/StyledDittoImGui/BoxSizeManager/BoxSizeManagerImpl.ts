import {
    BoxSizeManager,
    BoxSizeConfig,
} from './BoxSizeManager';

export class BoxSizeManagerImpl implements BoxSizeManager {
    constructor(
        private config: BoxSizeConfig,
    ) {}

    getBorderWidth(): number {
        return this.config.border;
    }

    getPadding(): number {
        return this.config.padding;
    }
}
