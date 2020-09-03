import {
    createObjectBinding,
} from '../bind';

describe('createObjectBinding', () => {
    test('Returned binding should be able to retrieve un-updated state', () => {
        const source = { value: 0 };
        const binding = createObjectBinding(source);
        expect(binding.value()).toBe(source.value);
    });

    test('Returned binding should be able to retrieve updated state', () => {
        const source = { value: 0 };
        const binding = createObjectBinding(source);
        source.value = 27;
        expect(binding.value()).toBe(source.value);
    });

    test('Binding should be able to update source object', () => {
        const source = { value: 0 };
        const binding = createObjectBinding(source);
        binding.value(33);
        expect(source.value).toBe(33);
    });
});
