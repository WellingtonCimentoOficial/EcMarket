from utils.payment_gateway import Gateway
from .exceptions import UserAlreadyExists, InvalidGoogleToken, InternalError
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from . import exceptions
from users.models import VerificationCode, PasswordResetCode
from uuid import uuid4
from datetime import timedelta
from django.utils import timezone
from django.core.mail import EmailMessage
from django.conf import settings
import requests
import os
import re
import random

def create_user_payload_to_payment_gateway(user_instance, update_user=False):
    try:
        payload = {
            "email": user_instance.email if not update_user else None,
            "first_name": user_instance.first_name if user_instance.first_name else None,
            "last_name": user_instance.last_name if user_instance.last_name else None,
            "phone":{
                "area_code": None,
                "number": None
            },
            "identification":{
                "type": None,
                "number": None
            },
            "default_address": None,
            "address":{
                "zip_code": str(user_instance.address.zip_code) if hasattr(user_instance, 'address') and user_instance.address.zip_code else None,
                "street_name": str(user_instance.address.street) if hasattr(user_instance, 'address') and user_instance.address.street else None,
                "street_number": int(user_instance.address.number) if hasattr(user_instance, 'address') and user_instance.address.number else None,
                "city":{
                    "name": str(user_instance.address.city) if hasattr(user_instance, 'address') and user_instance.address.city else None
                }
            },
            "date_registered": user_instance.date_joined.strftime('%Y-%m-%dT%H:%M:%S.%f%z') if user_instance.date_joined else None,
            "description": None,
            "default_card": None
        }
        return payload
    except:
        raise InternalError()

def get_or_create_user_in_payment_gateway(user_instance):
    # https://www.mercadopago.com.br/developers/en/reference/customers/_customers/post
    
    payload = create_user_payload_to_payment_gateway(user_instance)

    gateway = Gateway()

    response_search = gateway.search_customer(user_instance.email)

    if response_search.status_code == 200:

        results = response_search.json().get("results")

        if len(results) == 0:
            response = gateway.create_customer(payload)

            if response.status_code == 200 or response.status_code == 201:
                data = response.json()

                user_instance.gateway_user_id = data["id"]
                user_instance.save()

                return data
            
        if len(results) == 1:
            if not user_instance.gateway_user_id:
                user_instance.gateway_user_id = results[0]["id"]
                user_instance.save()

            return results[0]

def get_or_create_user_in_google(user_info):
    userid = user_info['sub']
    User = get_user_model()
    user = User.objects.filter(google_user_id=userid).first()
    user_by_email = User.objects.filter(email=user_info['email']).first()

    if not user:
        if not user_by_email:
            new_user = User.objects.create(
                google_user_id=userid,
                email=user_info['email'],
                first_name=user_info['given_name'],
                last_name=user_info['family_name'],
                password=make_password(userid)
            )
            return True, new_user
        raise UserAlreadyExists()
    return False, user

def validate_google_token(token):
    try:
        response = requests.get(f'https://oauth2.googleapis.com/tokeninfo?id_token={token}')
    except:
        raise InternalError()
    
    if response.status_code == 200 or response.status_code == 201:
        user_info = response.json()
        if user_info['aud'] == os.getenv('GOOGLE_OAUTH_CLIENT_ID'):
            return user_info
        raise InvalidGoogleToken()
    raise InvalidGoogleToken()

def google_user_id_exists(email):
    User = get_user_model()
    user = User.objects.filter(email=email).first()
    if user is not None and user.google_user_id is not None:
        return True
    return False

def apple_user_id_exists(email):
    User = get_user_model()
    user = User.objects.filter(email=email).first()
    if user is not None and user.apple_user_id is not None:
        return True
    return False


def validate_cpf_algorithm(cpf):
    def calculate_first_verifying_digit(cpf):
        first_nine_digits = list(map(int, cpf[:9]))
        first_nine_digits_decreasing_range = list(range(10, 1, -1))
        calc = [num * factor for num, factor in zip(first_nine_digits, first_nine_digits_decreasing_range)]
        total = sum(calc)
        rest_of_division = total % 11
        digit = 0 if rest_of_division < 2 else 11 - rest_of_division
        return digit

    def calculate_second_verifying_digit(cpf):
        first_ten_digits = list(map(int, cpf[:10]))
        first_ten_digits_decreasing_range = list(range(11, 1, -1))
        calc = [num * factor for num, factor in zip(first_ten_digits, first_ten_digits_decreasing_range)]
        total = sum(calc)
        rest_of_division = total % 11
        digit = 0 if rest_of_division < 2 else 11 - rest_of_division
        return digit
    
    first_digit = calculate_first_verifying_digit(cpf)
    second_digit = calculate_second_verifying_digit(cpf + str(first_digit))
    return cpf[-2:] == str(first_digit) + str(second_digit)

def validate_data_format(first_name=None, last_name=None, email=None, password=None, terms=None, password_reset_code=None, cpf=None):
    name_regex = re.compile("^[a-zA-Z\s]+$")
    email_regex = re.compile("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    password_regex = re.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).*$")
    only_numbers_regex = re.compile("^[0-9]+$")
    cpf_regex = re.compile("(?!(\d)\1{2}.\1{3}.\1{3}-\1{2})\d{3}\.\d{3}\.\d{3}-\d{2}")

    if first_name is not None:
        if not name_regex.match(first_name):
            raise exceptions.InvalidFirstNameFormat()
        
    if last_name is not None:
        if not name_regex.match(last_name):
            raise exceptions.InvalidLastNameFormat()

    if email is not None:
        if not email_regex.match(email):
            raise exceptions.InvalidEmailFormat()

    if password is not None:
        if not password_regex.match(password) or len(password) < 8:
            raise exceptions.InvalidPasswordFormat()

    if terms is not None:
        if not terms:
            raise exceptions.TermsNotAccepted()

    if password_reset_code is not None:
        if not only_numbers_regex.match(password_reset_code):
            raise exceptions.InvalidPasswordResetCodeFormat()
        
    if cpf is not None:
        if not only_numbers_regex.match(cpf) or len(cpf) != 11:
            raise exceptions.InvalidCpfFormat()
        elif not validate_cpf_algorithm(cpf):
            raise exceptions.InvalidCpf()

    return True

def create_user(first_name=None, last_name=None, email=None, password=None):
    User = get_user_model()

    if User.objects.filter(email=email).first() is not None:
        raise exceptions.EmailAlreadyUsed()
    
    new_user = User.objects.create(first_name=first_name, last_name=last_name, email=email, password=make_password(password))

    return new_user

def create_new_verification_code(user):
    try:
        code = uuid4()
        if hasattr(user, 'verification_code'):
            user.verification_code.delete()
            
        verification_code = VerificationCode()
        verification_code.code = code
        verification_code.user = user
        verification_code.save()
    except:
        raise exceptions.ErrorCreatingVerificationCode()


def verify_user_account(code):
    if code == '':
        raise exceptions.InvalidVerificationCode()

    try:
        code_instance = VerificationCode.objects.filter(code=code).first()
    except:
        raise exceptions.InvalidVerificationCodeFormat()
    
    if code_instance is not None:
        user = code_instance.user
        if not user.is_verified:

            current_time = timezone.now()

            difference = current_time - code_instance.created_at
            if difference <= timedelta(minutes=10):
                try:
                    user.is_verified = True
                    user.save()
                    return user
                except:
                    raise InternalError()
            raise exceptions.ExpiredVerificationCode()
        raise exceptions.AccountAlreadyVerified()
    raise exceptions.VerificationCodeNotFound()

def create_new_password_reset_code(user):
    try:
        code = random.randint(10000, 99999)
        if hasattr(user, 'password_reset_code'):
            user.password_reset_code.delete()
        
        password_reset_code = PasswordResetCode()
        password_reset_code.code = code
        password_reset_code.user = user
        password_reset_code.save()

        return password_reset_code
    except:
        raise exceptions.ErrorCreatingPasswordResetCode()

def send_password_changed_notification(user):
    try:
        email = EmailMessage(
            "Alteração de senha",
            f"Olá, sua senha foi alterada com sucesso, caso não seja você quem fez essa alteração, entre em contato conosco.",
            settings.EMAIL_HOST_USER,
            [user.email],
        )
        email.send(fail_silently=True)
    except:
        pass

def send_account_verified_notification(user):
    try:
        email = EmailMessage(
            "Verificação de conta",
            f"Olá, sua conta foi verificada com sucesso!\nAgora você pode aproveitar todos os beneficios.",
            settings.EMAIL_HOST_USER,
            [user.email],
        )
        email.send(fail_silently=True)
    except:
        pass

def send_welcome_notification(user):
    try:
        email = EmailMessage(
            "Seja bem vindo(a)",
            f"Olá, sua conta foi criada com sucesso!\nFicamos felizes de ter você por perto :)",
            settings.EMAIL_HOST_USER,
            [user.email],
        )
        email.send(fail_silently=True)
    except:
        pass