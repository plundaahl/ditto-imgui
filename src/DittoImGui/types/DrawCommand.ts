type CustomCommandFn = { (context: CanvasRenderingContext2D, ...args: any): void };

type CanvasRenderingContext2DFunctions = Pick<CanvasRenderingContext2D,
    'clearRect' | 'fillRect' | 'strokeRect' | 'fillText' | 'strokeText' |
    'measureText' | 'getLineDash' | 'setLineDash' | 'createLinearGradient' |
    'createRadialGradient' | 'createPattern' | 'beginPath' | 'closePath' |
    'moveTo' | 'lineTo' | 'bezierCurveTo' | 'quadraticCurveTo' | 'arc' |
    'arcTo' | 'ellipse' | 'rect' | 'fill' | 'stroke' | 'drawFocusIfNeeded' |
    'scrollPathIntoView' | 'clip' | 'isPointInPath' | 'isPointInStroke' |
    'rotate' | 'scale' | 'translate' | 'transform' | 'setTransform' |
    'resetTransform' | 'drawImage' | 'createImageData' | 'getImageData' |
    'putImageData' | 'save' | 'restore'
>

interface INativeCommandCore<T extends keyof CanvasRenderingContext2DFunctions> {
    native: true,
    command: T,
    args: Parameters<CanvasRenderingContext2DFunctions[T]>
}
interface INativeCommand extends INativeCommandCore<keyof CanvasRenderingContext2DFunctions> { }

interface ICustomCommandCore<T extends (...args: any) => void> {
    native: false,
    command: T,
    args: Parameters<T>,
}

interface ICustomCommand extends ICustomCommandCore<any> { }

export type DrawCommand = ICustomCommand | INativeCommand;

