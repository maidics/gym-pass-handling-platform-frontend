export const validate = () => {
  const isEmpty = (value: string | undefined | null) => {
    return !value || value.trim() === "";
  };

  const isPasswordValid = (value: string | undefined | null) => {
    if (!value) return false;

    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/.test(
      value,
    );
  };

  const isEmailValid = (value: string): boolean => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
  };

  const isPhoneNumberValid = (value?: string) => {
    return value && /^\+[1-9]\d{1,14}$/.test(value);
  };

  return {
    isEmpty,
    isPasswordValid,
    isEmailValid,
    isPhoneNumberValid,
  };
};
