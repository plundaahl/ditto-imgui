import { configureFocusElements } from '../configureFocusElements';
import { BrowserFocusHandleImpl } from '../BrowserFocusHandleImpl';

function errorIfNull<T>(arg: T | null) {
    if (arg === null) {
        throw new Error('arg is null');
    }
    return arg;
}

const canvas = errorIfNull(document.getElementById('canvas'));

const instance = new BrowserFocusHandleImpl(
    canvas,
    ...configureFocusElements(
        errorIfNull(document.getElementById('inputwrapper'))
    ),
);

instance.onAppBlur(() => {
    console.log('BLUR');
    canvas.classList.remove('highlighted');
});
instance.onAppFocus(() => {
    console.log('FOCUS');
    canvas.classList.add('highlighted');
});

const isFirstCheckbox = errorIfNull(document.getElementById('is-first')) as HTMLInputElement;
const isLastCheckbox = errorIfNull(document.getElementById('is-last')) as HTMLInputElement;

isFirstCheckbox.onchange = () => instance
    .setIsFocusedOnFirstElement(isFirstCheckbox.checked);

isLastCheckbox.onchange = () => instance
    .setIsFocusedOnLastElement(isLastCheckbox.checked);

isFirstCheckbox.checked = false;
isLastCheckbox.checked = false;
instance.setIsFocusedOnLastElement(isLastCheckbox.checked);
instance.setIsFocusedOnFirstElement(isFirstCheckbox.checked);
