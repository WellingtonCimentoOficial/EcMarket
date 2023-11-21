from utils.payment_gateway import Gateway
from .exceptions import UserAlreadyExists, InvalidGoogleToken, InternalError
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.auth.hashers import make_password
from .exceptions import (
    InvalidPasswordFormat, InvalidEmailFormat, 
    InvalidFirstNameFormat, InvalidLastNameFormat, 
    EmailAlreadyUsed, TermsNotAccepted
)
import requests
import os
import re

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

            group = Group.objects.get_or_create(name='customer')[0]
            group.user_set.add(new_user)

            return new_user
        raise UserAlreadyExists()
    return user

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

def validate_data_format(first_name=None, last_name=None, email=None, password=None, terms=None):
    name_regex = re.compile("^[a-zA-Z\s]+$")
    email_regex = re.compile("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    password_regex = re.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).*$")

    if first_name is not None:
        if not name_regex.match(first_name):
            raise InvalidFirstNameFormat
        
    if last_name is not None:
        if not name_regex.match(last_name):
            raise InvalidLastNameFormat

    if email is not None:
        if not email_regex.match(email):
            raise InvalidEmailFormat

    if password is not None:
        if not password_regex.match(password) or len(password) < 8:
            raise InvalidPasswordFormat

    if terms is not None:
        if not terms:
            raise TermsNotAccepted

    return True

def create_user(first_name=None, last_name=None, email=None, password=None):
    User = get_user_model()

    if User.objects.filter(email=email).first() is not None:
        raise EmailAlreadyUsed
    
    new_user = User.objects.create(first_name=first_name, last_name=last_name, email=email, password=make_password(password))
    group = Group.objects.get_or_create(name='customer')[0]
    group.user_set.add(new_user)

    return new_user