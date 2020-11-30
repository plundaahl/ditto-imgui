export interface BoxSizeConfig {
    padding: number,
    border: number,
}

export interface BoxSizeManager {
    getBorderWidth(): number;
    getPadding(): number;
}
