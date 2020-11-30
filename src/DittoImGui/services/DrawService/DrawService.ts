import { UiElement } from '../../types';
import { Hookable } from '../../infrastructure/HookRunner';

import {
    LineCapOpts,
    LineJoinOpts,
    FillStyleOpts,
    StrokeStyleOpts,
    TextAlignOpts,
} from './CustomCommands';

export interface DrawAPI {
    clearRect(x: number, y: number, w: number, h: number): void;
    fillRect(x: number, y: number, w: number, h: number): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
    drawText(text: string, x: number, y: number): void;
    measureText(text: string): { width: number, height: number, ascent: number, descent: number };
    setLineWidth(width: number): void;
    setLineCap(cap: LineCapOpts): void;
    setLineJoin(join: LineJoinOpts): void;
    setFont(font: string): void;
    setFillStyle(style: FillStyleOpts): void;
    setStrokeStyle(style: StrokeStyleOpts): void;
    setTextAlign(align: TextAlignOpts): void;
    beginPath(): void;
    closePath(): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    fill(): void;
    stroke(): void;
    clip(fillRule?: 'nonzero' | 'evenodd'): void;
    rect(x: number, y: number, w: number, h: number): void;
    save(): void;
    restore(): void;
    translate(x: number, y: number): void;
}

export interface DrawCPI {}

export interface DrawService extends DrawAPI, DrawCPI, Hookable {
    onBeginElement(element: UiElement): void;
    onEndElement(): void;
}

