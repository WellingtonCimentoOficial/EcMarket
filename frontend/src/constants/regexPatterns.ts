// checks if name has a valid format
export const onlyUpperCaseLowerCaseAndSpaceLettersRegex = /^[a-zA-Z\s]+$/;

// checks if email has a valid format
export const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

// checks if there is at least one uppercase letter, lowercase letter, number and special character
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).*$/

// checks cpf format, example 000.000.000-00
export const cpfRegex = /(?!(\d)\1{2}.\1{3}.\1{3}-\1{2})\d{3}\.\d{3}\.\d{3}-\d{2}/

// Only digits from 0 to 9
export const onlyNumbersRegex = /^[0-9]+$/

// All characters except numbers
export const everythingExceptNumbersRegex = /\D/g

// Only special characters
export const specialCharacters = /[^\w\s]/gi