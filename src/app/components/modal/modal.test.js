/* eslint-disable no-undef */
import { ModalView } from './scripts/modalView';
import isChecked from './template/isChecked';
const modal = new ModalView();

describe('validateTextField', () => {
  it('should return true', () => {
    const result = modal.validateTextField('    Text text text    ');
    expect(result).toBe(true);
  });

  it('should return false with no arguments', () => {
    const result = modal.validateTextField();
    expect(result).toBe(false);
  });

  it('should return falthy value if argument does not equal `string`', () => {
    const result = modal.validateTextField(123123);
    expect(result).toBe(false);
  });

  it('should return false from string with only spaces', () => {
    const result = modal.validateTextField('                         ');
    expect(result).toBe(false);
  });
});

describe('isChecked', () => {
  it('should return css class `checked`', () => {
    const result = isChecked('truthy', 'truthy');
    expect(result).toBe('checked');
  });

  it('should return empty string if different value', () => {
    const result = isChecked('truthy', 'falthy');
    expect(result).toBe('');
  });

  it('should return empty string one of value is empty', () => {
    const result = isChecked('', 'other');
    expect(result).toBe('');
  });
});
