import gui from '../src';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
if (!canvas) {
    throw new Error('No canvas');
}

const context = canvas.getContext('2d');
if (!context) {
    throw new Error('No context');
}

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const dc = new gui.DrawContext();
const text = 'hi bob';
const { width, height } = dc.measureText(text);


const x = 10;
const y = 100;
const padding = 4;

dc.setFillStyle('#0000FF');
dc.fillRect(
    x - padding,
    y - height - padding,
    width + padding + padding,
    height + padding + padding,
)
dc.drawText(text, x, y);

dc.setFillStyle('#88FF88');
dc.save();
dc.beginPath()
dc.moveTo(30, 30);
dc.lineTo(150, 10);
dc.lineTo(100, 100);
dc.closePath();
dc.clip();
dc.fill();
dc.setFillStyle('#FFFFFF');
dc.fillRect(0, 70, 100, 20);
dc.rect(0, 70, 100, 20);
dc.stroke();
dc.restore();

dc.render(context);
