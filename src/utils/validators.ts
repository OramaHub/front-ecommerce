export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit >= 10) firstDigit = 0;
  if (parseInt(digits[9]) !== firstDigit) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit >= 10) secondDigit = 0;
  return parseInt(digits[10]) === secondDigit;
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function validateName(name: string): boolean {
  return name.trim().length >= 3;
}
