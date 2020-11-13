export function configureFocusElements(canvas: HTMLElement): [HTMLElement, HTMLElement, HTMLElement] {
    const tabBackwardsTrap = createInputElement();
    const tabCenterTrap = createInputElement();
    const tabForwardsTrap = createInputElement();

    canvas.appendChild(tabBackwardsTrap);
    canvas.appendChild(tabCenterTrap);
    canvas.appendChild(tabForwardsTrap);

    return [
        tabBackwardsTrap,
        tabCenterTrap,
        tabForwardsTrap,
    ];
}

function createInputElement(): HTMLElement {
    const e = document.createElement('input');
    e.type = 'text';
    return e;
}
