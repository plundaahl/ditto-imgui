export function createOffscreenCanvasContext() {
    const canvas = document.createElement('canvas');
    if (!canvas) {
        throw new Error('Could not create canvas');
    }

    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('Could not get context');
    }

    return context;
}

