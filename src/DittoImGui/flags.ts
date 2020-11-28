import { flagFactory } from './lib/FlagFactory';

const elementFlag = flagFactory();

export const FOCUSABLE = elementFlag();
export const PERSISTENT = elementFlag();
