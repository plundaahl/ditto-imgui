import { ContextImpl } from '../../Context';
import { createCanvasContext } from '../../DrawBuffer';

(window as any).context = new ContextImpl(createCanvasContext);
