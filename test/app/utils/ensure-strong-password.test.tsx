import { isStrongPassword } from 'app/utils/ensure-strong-password';
import { expect, test } from 'vitest'

const email = 'test@example.com';

const testCases = [
  { password: 'Short1!', description: 'a password that is too short', validation: false },
  { password: 'NoNumber!', description: 'a password without a number', validation: false  },
  { password: 'NoSpecial1', description: 'a password without a special character', validation: false  },
  { password: '12345678', description: 'a common password', validation: false  },
  { password: 'test@example.com123!', description: 'a password containing the email', validation: false  },
  { password: 'StrongP@ssw0rd', description: 'a valid password', validation: true  },
];

testCases.forEach(({ password, description, validation }) => {
  test(`isStrongPassword - ${description}`, () => {
    const result = isStrongPassword(password, email);
    expect(result.isValid).toBe(validation);
  });
});

// test the output of the function, it should be an object with a boolean and an array of strings
test('isStrongPassword - output is validation and an array of string', () => {
  const result = isStrongPassword('Short', email);
  expect(result.isValid).toBe(false);
  expect(result.errorMessages).toBeInstanceOf(Array);
  expect(result.errorMessages.length).toBeGreaterThan(0);
});