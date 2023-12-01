// GENERAL ERRORS
export const INVALID_EMAIL_ERROR = {
    title: 'E-mail inválido',
    text: 'O formato do e-mail informado é inválido, verifique o mesmo e tente novamente.'
}
export const RECAPTCHA_ERROR = {
    title: 'Erro no ReCaptcha',
    text: 'Ocorreu um erro ao tentar validar o recaptcha, tente novamente mais tarde.'
}
export const REQUEST_ERROR = {
    title: 'Ocorreu um erro',
    text: 'Ocorreu um erro ao tentar fazer a solicitação, tente novamente mais tarde.'
}
export const EMAIL_ALREADY_USED_ERROR = {
    title: 'E-mail ja utilizado',
    text: 'Já existe uma conta vinculada ao endereço de e-mail informado.'
}
export const TERMS_NOT_ACCEPTED_ERROR = {
    title: 'Termos de uso não aceito',
    text: 'Para prosseguir com a criação da conta é necessario aceitar os termos.'
}
export const ACCOUNT_ALREADY_VERIFIED_ERROR = {
    title: 'Conta já verificada',
    text: 'A conta portadora do código de verificação ja foi validada.'
}
export const FIRST_NAME_INVALID_ERROR = {
    title: 'Primeiro nome inválido',
    text: 'O primeiro nome deve conter apenas letras entre 3 a 50 caracteres.'
}


// AUTHENTICATION ERRORS
export const INVALID_USER_AUTHENTICATION_METHOD_ERROR = {
    title: 'Autenticação Inválida',
    text: 'Esse método de autenticação não está disponível para sua conta.'
}
export const INVALID_THIRD_PARTY_AUTHENTICATION_ERROR = {
    title: 'Autenticação Inválida',
    text: 'Não é possível redefinir sua senha, pois você utiliza o método de autenticação de terceiros.'
}
export const INVALID_AUTHENTICATION_GOOGLE_ERROR = {
    title: 'Autenticação Inválida',
    text: 'Faça o login utilizando o método de autenticação do Google.'
}
export const INVALID_AUTHENTICATION_APPLE_ERROR = {
    title: 'Autenticação Inválida',
    text: 'Faça o login utilizando o método de autenticação da Apple.'
}
export const INVALID_GOOGLE_OAUTH2_TOKEN_ERROR = {
    title: 'Token Inválido',
    text: 'Token do google oauth inválido'
}
export const GOOGLE_OAUTH2_TOKEN_VALIDATION_ERROR = {
    title: 'Ocorreu um erro',
    text: 'Não foi possível validar o Google Oauth Token'
}


// RESET PASSWORD ERRORS
export const EXPIRED_CODE_ERROR = {
    title: 'Código Expirado',
    text: 'O código informado está expirado, tente solicitar outro.'
}
export const INVALID_CODE_ERROR = {
    title: 'Código Inválido',
    text: 'O código informado é inválido, verifique o mesmo e tente novamente.'
}
export const INVALID_CODE_FORMAT_ERROR = {
    title: 'Código Inválido',
    text: 'O formato do código informado é inválido, verifique o mesmo e tente novamente.'
}
export const INVALID_PASSWORD_ERROR = {
    title: 'Senha Inválida',
    text: 'A senha precisa ter no mínimo 8 digitos incluindo, caractere especial, letra maiúscula, letra minúscula e número.'
}
export const NEW_PASSWORD_SAME_AS_CURRENT_ERROR = {
    title: 'Senha Inválida',
    text: 'A nova senha não pode ser igual a atual.'
}


// VERIFY ACCOUNT MESSAGES
export const EXPIRED_ACCOUNT_VERIFICATION_CODE_ERROR = {
    title: 'Código Expirado',
    text: 'O código de verificação está expirado. Será necesário solicitar outro para poder efeturar a verificação da conta.'
}
export const INVALID_ACCOUNT_VERIFICATION_CODE_ERROR = {
    title: 'Código Inválido',
    text: 'O código de verificação informado é inválido.'
}
export const INVALID_ACCOUNT_VERIFICATION_CODE_FORMAT_ERROR = {
    title: 'Formato Inválido',
    text: 'O formato do código de verificação informado é inválido. Verifique o mesmo e tente novamente.'
}
export const ACCOUNT_VERIFICATION_CODE_NOT_FOUND_ERROR = {
    title: 'Código não encontrado',
    text: 'O código de verificação não foi encontrado.'
}
export const ACCOUNT_VERIFICATION_ERROR = {
    title: 'Ocorreu um erro',
    text: 'Ocorreu um erro ao tentar validar a conta.'
}
