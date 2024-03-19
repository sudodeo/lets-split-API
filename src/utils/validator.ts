import { ValidationError } from "../types/error.type";
import { User } from "../types/user.types";

export const validateRegistration = async (
  payload: User,
): Promise<ValidationError[]> => {
  const errors: ValidationError[] = [];

  if (payload == null || JSON.stringify(payload) === "{}") {
    errors.push({
      field: "payload",
      error: "payload is required",
    });
    return errors;
  }

  const { email, firstName, lastName, dob, password } = payload;

  const emailErrors = validateEmail(email);
  if (emailErrors.length > 0) {
    errors.push(...emailErrors);
  }

  if (firstName == null || firstName === "") {
    errors.push({
      field: "firstName",
      error: "first name is required",
    });
  }

  if (lastName == null || lastName === "") {
    errors.push({
      field: "lastName",
      error: "last name is required",
    });
  }

  if (dob == null) {
    errors.push({
      field: "dob",
      error: "date of birth is required",
    });
    return errors;
  }

  const dobErrors = validateDob(dob);
  if (dobErrors.length > 0) {
    errors.push(...dobErrors);
  }

  if (password == null || password === "") {
    errors.push({
      field: "password",
      error: "password is required",
    });
    return errors;
  }

  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    errors.push(...passwordErrors);
  }

  return errors;
};

export function validateEmail(email: string): ValidationError[] {
  const errors: ValidationError[] = [];
  if (email == null || email == "") {
    errors.push({
      field: "email",
      error: "email is required",
    });
    return errors;
  }

  const emailRegex = /\S+@\S+\.[a-zA-Z]+$/;
  if (!emailRegex.test(email)) {
    errors.push({
      field: "email",
      error: "invalid email address",
    });
  }

  return errors;
}

export function validateDob(dob: Date): ValidationError[] {
  const errors: ValidationError[] = [];

  const currentYear = new Date().getFullYear();
  const dateOfBirth = new Date(dob);
  const dobYear = dateOfBirth.getFullYear();
  if (currentYear - dobYear < 18) {
    errors.push({
      field: "dob",
      error: "user must be at least 18 years old",
    });
  }

  // invalid date
  if (isNaN(dateOfBirth.getTime())) {
    errors.push({
      field: "dob",
      error: "invalid date of birth",
    });
  }

  return errors;
}

export function validatePassword(password: string): ValidationError[] {
  const errors: ValidationError[] = [];
  if (password == null || password == "") {
    errors.push({
      field: "email",
      error: "email is required",
    });
    return errors;
  }

  if (password.length < 8) {
    errors.push({
      field: "password",
      error: "password must be at least 8 characters long",
    });
  }

  if (!/[A-Z]/.test(password)) {
    errors.push({
      field: "password",
      error: "password must contain at least one uppercase letter",
    });
  }

  if (!/[a-z]/.test(password)) {
    errors.push({
      field: "password",
      error: "password must contain at least one lowercase letter",
    });
  }

  if (!/\d/.test(password)) {
    errors.push({
      field: "password",
      error: "password must contain at least one number",
    });
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push({
      field: "password",
      error: "password must contain at least one special character",
    });
  }

  return errors;
}
