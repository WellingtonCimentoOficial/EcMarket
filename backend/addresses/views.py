from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Address, DeliveryAddress
from .serializers import AddressSerializer, DeliveryAddressSerializer
from rest_framework import status
from .utils import validate_address
from .exceptions import AddressNotFoundError, DeliveryAddressNotFoundError
from utils.shipping_info import Correios
import os

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_address(request):
    try:
        address = Address.objects.get(user=request.user)
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

    try:
        # validating the information sent by the front end
        validate_address(street, number, district, city, state, uf, zip_code)
        
        # creating a address in database
        address = Address.objects.create(user=request.user, street=street, number=number, district=district, complement=complement, city=city, state=state, uf=uf, zip_code=zip_code, country="BR")

        # serializing the data 
        serializer = AddressSerializer(address, context={'request': request})

        # returning a response
        return Response(serializer.data)
    
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
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

    try:
        # validating the information sent by the front end
        validate_address(street, number, district, city, state, uf, zip_code)

        # verifing if user has not a address
        if not hasattr(request.user, 'address'):
            raise AddressNotFoundError()

        # updating a address in database
        address = request.user.address
        address.street = street
        address.number = number
        address.district = district
        address.complement = complement
        address.city = city
        address.state = state
        address.uf = uf
        address.zip_code = zip_code
        address.save()

        # serializing the data 
        serializer = AddressSerializer(address, context={'request': request})

        # returning a response
        return Response(serializer.data)
    
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_delivery_addresses(request):
    try:
        delivery_addresses = DeliveryAddress.objects.filter(user=request.user)
        serializer = DeliveryAddressSerializer(delivery_addresses, many=True, context={'request': request})
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def add_delivery_address(request):
    street = request.data.get("street")
    number = request.data.get("number")
    district = request.data.get("district")
    complement = request.data.get("complement")
    city = request.data.get("city")
    state = request.data.get("state")
    uf = request.data.get("uf")
    zip_code = request.data.get("zip_code")

    try:
        # validating the information sent by the front end
        validate_address(street, number, district, city, state, uf, zip_code)
        
        # creating a address in database
        address = DeliveryAddress.objects.create(user=request.user, street=street, number=number, district=district, complement=complement, city=city, state=state, uf=uf, zip_code=zip_code, country="BR")

        # serializing the data 
        serializer = DeliveryAddressSerializer(address, context={'request': request})

        # returning a response
        return Response(serializer.data)
    
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated]) 
def update_delivery_address(request, pk):
    street = request.data.get("street")
    number = request.data.get("number")
    district = request.data.get("district")
    complement = request.data.get("complement")
    city = request.data.get("city")
    state = request.data.get("state")
    uf = request.data.get("uf")
    zip_code = request.data.get("zip_code")

    try:
        # validating the information sent by the front end
        validate_address(street, number, district, city, state, uf, zip_code)

        # getting a address from database
        delivery_address = request.user.delivery_addresses.filter(id=pk).first()

        # verifing if user has a delivery address with a id equal pk
        if delivery_address is None:
            raise DeliveryAddressNotFoundError()
        
        # updating a delivery address in database
        delivery_address.street = street
        delivery_address.number = number
        delivery_address.district = district
        delivery_address.complement = complement
        delivery_address.city = city
        delivery_address.state = state
        delivery_address.uf = uf
        delivery_address.zip_code = zip_code
        delivery_address.save()

        # serializing the data 
        serializer = DeliveryAddressSerializer(delivery_address, context={'request': request})

        # returning a response
        return Response(serializer.data)
    
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
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
        return Response(status=status.HTTP_200_OK)
    
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_cep_info(request, zip_code):
    try:
        # initializing the correios class
        correios = Correios(username=os.getenv('CORREIOS_USERNAME'), APItoken=os.getenv('CORREIOS_TOKEN'))

        # checking if zip code is valid
        if not correios.validate_zip_code(zip_code):
            return Response({'error': 'The zip code is invalid'}, status=status.HTTP_400_BAD_REQUEST)

        # getting a correios token
        token = correios.get_token()

        # getting a zip code informations
        zip_code_info = correios.get_zip_code_info(token=token, destination_zip_code=zip_code)

        # checking if token and zip_code_info are valid and then returning a response
        if token and zip_code_info:
            data = {
                'cep': zip_code_info.get('cep'),
                'uf': zip_code_info.get('uf'),
                'city': zip_code_info.get('localidade'),
                'neighborhood': zip_code_info.get('bairro'),
                'address': zip_code_info.get('logradouro'),
            }
            return Response(data)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)