import { DrawContext } from '../src';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
if (!canvas) {
    throw new Error('No canvas');
}

const context = canvas.getContext('2d');
if (!context) {
    throw new Error('No context');
}

const dc = new DrawContext();

dc.drawText('hi bob', 15, 20);
dc.render(context);
