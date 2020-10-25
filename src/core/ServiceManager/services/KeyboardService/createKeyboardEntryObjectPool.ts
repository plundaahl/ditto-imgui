import { ObjectPool } from '../../../lib/ObjectPool';
import { KeyEntry } from './KeyEntry';

export function createKeyboardEntryObjectPool(): ObjectPool<KeyEntry> {
    return new ObjectPool(
        () => ({ key: '', code: '' }),
        (entry) => {
            entry.key = '';
            entry.code = '';
        },
    );
}
