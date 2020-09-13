import { BoundingBox } from './BoundingBox';
import { DrawBuffer } from './DrawBuffer';

export class Element {
    public readonly boundingBox: BoundingBox = new BoundingBox();
    public readonly drawBuffer: DrawBuffer = new DrawBuffer();
    public readonly children: Element[] = [];
    public readonly floatingChildren: Element[] = [];
    public key: string;
    public zIndex: number = 0;
}

