from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserAddress, UserDeliveryAddress
from .serializers import AddressSerializer, DeliveryAddressSerializer
from rest_framework import status
from .utils import validate_address, UF_TO_STATE
from .exceptions import AddressNotFoundError, DeliveryAddressNotFoundError
from utils.shipping_info import (
    Correios, InvalidZipCodeError, InvalidAddressError, 
    InvalidTokenError, InvalidNameFieldError, InvalidComplementFieldError
)
from utils.recaptcha import ReCaptcha, InvalidReCaptchaToken
import os 

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_address(request):
    try:
        address = UserAddress.objects.get(user=request.user)
        serializer = AddressSerializer(address, context={'request': request})
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def add_address(request):
    street = request.data.get("street")
    number = request.data.get("number")
    district = request.data.get("district")
    complement = request.data.get("complement")
    city = request.data.get("city")
    state = request.data.get("state")
    uf = request.data.get("uf")
    zip_code = request.data.get("zip_code")
    country = request.data.get("country")
    recaptcha_token = request.data.get("g-recaptcha-response")

    try:
        # validating recaptcha token
        recaptcha = ReCaptcha(token=recaptcha_token)
        recaptcha.validate_token()

        # initializing the correios class
        correios = Correios(username=os.getenv('CORREIOS_USERNAME'), APItoken=os.getenv('CORREIOS_TOKEN'))

        # checking if zip code is valid
        correios.validate_zip_code(zip_code)

        # validating data sent by frontend
        validated_data = correios.validate_data(zip_code=zip_code, street=street, district=district, number=number, state=state, city=city, uf=uf)
        
        # creating a address in database
        address = UserAddress.objects.create(
            user=request.user, 
            street=validated_data.get('street'), 
            number=validated_data.get('number'), 
            district=validated_data.get('district'), 
            complement=complement, 
            city=validated_data.get('city'), 
            state=validated_data.get('state'), 
            uf=validated_data.get('uf'), 
            zip_code=validated_data.get('zip_code'), 
            country=country
        )

        # serializing the data 
        serializer = AddressSerializer(address, context={'request': request})

        # returning a response
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except InvalidZipCodeError:
        return Response({'cod': 42, 'error': 'The zip code is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidAddressError:
        return Response({'cod': 43, 'error': 'The address is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidReCaptchaToken:
        return Response({'cod': 44, 'error': 'Validation failure of reCAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidTokenError:
        return Response({'cod': 45, 'error': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidComplementFieldError:
        return Response({'cod': 66, 'error': 'The complement field is Invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated]) 
def update_address(request):
    street = request.data.get("street")
    number = request.data.get("number")
    district = request.data.get("district")
    complement = request.data.get("complement")
    city = request.data.get("city")
    state = request.data.get("state")
    uf = request.data.get("uf")
    zip_code = request.data.get("zip_code")
    recaptcha_token = request.data.get("g-recaptcha-response")

    try:
        # validating recaptcha token
        recaptcha = ReCaptcha(token=recaptcha_token)
        recaptcha.validate_token()

        # initializing the correios class
        correios = Correios(username=os.getenv('CORREIOS_USERNAME'), APItoken=os.getenv('CORREIOS_TOKEN'))

        # checking if zip code is valid
        correios.validate_zip_code(zip_code)

        # validating data sent by frontend
        validated_data = correios.validate_data(zip_code=zip_code, street=street, district=district, number=number, state=state, city=city, uf=uf)

        # verifing if user has not a address
        if not hasattr(request.user, 'address'):
            raise AddressNotFoundError()

        # updating a address in database
        address = request.user.address
        address.street = validated_data.get('street')
        address.number = validated_data.get('number')
        address.district = validated_data.get('district')
        address.complement = complement
        address.city = validated_data.get('city')
        address.state = validated_data.get('state')
        address.uf = validated_data.get('uf')
        address.zip_code = validated_data.get('zip_code')
        address.save()

        # serializing the data 
        serializer = AddressSerializer(address, context={'request': request})

        # returning a response
        return Response(serializer.data)
    
    except InvalidZipCodeError:
        return Response({'cod': 56, 'error': 'The zip code is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidAddressError:
        return Response({'cod': 57, 'error': 'The address is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidReCaptchaToken:
        return Response({'cod': 58, 'error': 'Validation failure of reCAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidTokenError:
        return Response({'cod': 59, 'error': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)
    except AddressNotFoundError:
        return Response({ 'cod': 60, 'error': 'The address was not found' }, status=status.HTTP_404_NOT_FOUND)
    except InvalidComplementFieldError:
        return Response({'cod': 67, 'error': 'The complement field is Invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_delivery_addresses(request):
    try:
        delivery_addresses = UserDeliveryAddress.objects.filter(user=request.user)
        serializer = DeliveryAddressSerializer(delivery_addresses, many=True, context={'request': request})
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def add_delivery_address(request):
    name = request.data.get("name")
    street = request.data.get("street")
    number = request.data.get("number")
    district = request.data.get("district")
    complement = request.data.get("complement")
    city = request.data.get("city")
    state = request.data.get("state")
    uf = request.data.get("uf")
    zip_code = request.data.get("zip_code")
    country = request.data.get("country")
    recaptcha_token = request.data.get("g-recaptcha-response")

    try:
        # validating delivery address quantity
        if request.user.delivery_addresses.count() >= 2:
            return Response({ 'cod': 50, 'error': 'Maximum number of delivery addresses reached' }, status=status.HTTP_401_UNAUTHORIZED)

        # validating recaptcha token
        recaptcha = ReCaptcha(token=recaptcha_token)
        recaptcha.validate_token()

        # initializing the correios class
        correios = Correios(username=os.getenv('CORREIOS_USERNAME'), APItoken=os.getenv('CORREIOS_TOKEN'))

        # checking if zip code is valid
        correios.validate_zip_code(zip_code)

        # validating data sent by frontend
        validated_data = correios.validate_data(
            name=name, zip_code=zip_code, street=street, 
            district=district, number=number, complement=complement, 
            state=state, city=city, uf=uf
        )
        
        # creating a address in database
        address = UserDeliveryAddress.objects.create(
            user=request.user,
            name=name,
            street=validated_data.get('street'), 
            number=validated_data.get('number'), 
            district=validated_data.get('district'), 
            complement=complement, 
            city=validated_data.get('city'), 
            state=validated_data.get('state'), 
            uf=validated_data.get('uf'), 
            zip_code=validated_data.get('zip_code'), 
            country=country
        )

        # serializing the data 
        serializer = DeliveryAddressSerializer(address, context={'request': request})

        # returning a response
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except InvalidNameFieldError:
        return Response({ 'cod': 49, 'error': 'The name field is invalid' }, status=status.HTTP_400_BAD_REQUEST)
    except InvalidZipCodeError:
        return Response({'cod': 51, 'error': 'The zip code is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidAddressError:
        return Response({'cod': 52, 'error': 'The address is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidReCaptchaToken:
        return Response({'cod': 53, 'error': 'Validation failure of reCAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidTokenError:
        return Response({'cod': 54, 'error': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidComplementFieldError:
        return Response({'cod': 68, 'error': 'The complement field is Invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated]) 
def update_delivery_address(request, pk):
    name = request.data.get("name")
    street = request.data.get("street")
    number = request.data.get("number")
    district = request.data.get("district")
    complement = request.data.get("complement")
    city = request.data.get("city")
    state = request.data.get("state")
    uf = request.data.get("uf")
    zip_code = request.data.get("zip_code")
    recaptcha_token = request.data.get("g-recaptcha-response")

    try:
        # validating recaptcha token
        recaptcha = ReCaptcha(token=recaptcha_token)
        recaptcha.validate_token()

        # initializing the correios class
        correios = Correios(username=os.getenv('CORREIOS_USERNAME'), APItoken=os.getenv('CORREIOS_TOKEN'))

        # checking if zip code is valid
        correios.validate_zip_code(zip_code)

        # validating data sent by frontend
        validated_data = correios.validate_data(
            name=name, zip_code=zip_code, street=street, district=district, 
            number=number, complement=complement, state=state, city=city, uf=uf
        )

        # getting a address from database
        delivery_address = request.user.delivery_addresses.filter(id=pk).first()

        # verifing if user has a delivery address with a id equal pk
        if delivery_address is None:
            raise DeliveryAddressNotFoundError()
        
        # updating a delivery address in database
        delivery_address.name = name
        delivery_address.street = validated_data.get('street')
        delivery_address.number = validated_data.get('number')
        delivery_address.district = validated_data.get('district')
        delivery_address.complement = complement
        delivery_address.city = validated_data.get('city')
        delivery_address.state = validated_data.get('state')
        delivery_address.uf = validated_data.get('uf')
        delivery_address.zip_code = validated_data.get('zip_code')
        delivery_address.save()

        # serializing the data 
        serializer = DeliveryAddressSerializer(delivery_address, context={'request': request})

        # returning a response
        return Response(serializer.data)
    
    except InvalidZipCodeError:
        return Response({'cod': 61, 'error': 'The zip code is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidAddressError:
        return Response({'cod': 62, 'error': 'The address is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidReCaptchaToken:
        return Response({'cod': 63, 'error': 'Validation failure of reCAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidTokenError:
        return Response({'cod': 64, 'error': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidNameFieldError:
        return Response({ 'cod': 65, 'error': 'The name field is invalid' }, status=status.HTTP_400_BAD_REQUEST)
    except InvalidComplementFieldError:
        return Response({'cod': 69, 'error': 'The complement field is Invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated]) 
def delete_delivery_address(request, pk):
    try:
        # getting a address from database
        delivery_address = request.user.delivery_addresses.filter(id=pk).first()

        # verifing if user has a delivery address with a id equal pk
        if delivery_address is None:
            raise DeliveryAddressNotFoundError()
        
        # deleting a delivery address
        delivery_address.delete()
        
        # returning a response
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    except DeliveryAddressNotFoundError:
        return Response({ 'cod': 55, 'error': 'The address was not found' }, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_cep_info(request, zip_code):
    try:
        # initializing the correios class
        correios = Correios(username=os.getenv('CORREIOS_USERNAME'), APItoken=os.getenv('CORREIOS_TOKEN'))

        # checking if zip code is valid
        correios.validate_zip_code(zip_code)

        # getting a correios token
        token = correios.get_token()

        # getting a zip code informations
        zip_code_info = correios.get_zip_code_info(token=token, destination_zip_code=zip_code)

        # returning a response
        data = {
            'id': 0,
            'street': zip_code_info.get('logradouro'),
            'number': None,
            'district': zip_code_info.get('bairro'),
            'complement': None,
            'city': zip_code_info.get('localidade'),
            'state': UF_TO_STATE.get(str(zip_code_info.get('uf')).upper()),
            'uf': zip_code_info.get('uf'),
            'zip_code': zip_code_info.get('cep'),
            'country': None
        }
        return Response(data)
    
    except InvalidZipCodeError:
        return Response({'cod': 48, 'error': 'The zip code is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)