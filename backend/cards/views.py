from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import CardSerializer
from .exceptions import CardNotFoundError
from .utils import change_card

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cards(request):
    try:
        # searching for all user cards
        cards = request.user.cards.all()

        # serializing the data
        serializer = CardSerializer(cards, many=True, context={'request': request})

        return Response(serializer.data)
    
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_card(request, pk):
    try:
        # looking for a user card that has the id informed
        card = request.user.cards.filter(id=pk).first()

        # returning an exception if no card with the given id is found
        if card is None:
            raise CardNotFoundError()
        
        # serializing the data
        serializer = CardSerializer(card, context={'request': request})

        return Response(serializer.data)
    
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_card(request, pk): # is not updating in payment gateway, because is returning a error
    # token = request.data.get("token")
    # try:
    #     card = request.user.cards.filter(id=pk).first()
        
    #     if card is None:
    #         raise CardNotFoundError()
        
    #     card_updated = change_card(request.user, card.gateway_card_id, token)

    #     serializer = CardSerializer(card_updated, context={'request': request})

    #     return Response(serializer.data)
        
    # except Exception as e:
    #     if hasattr(e, "detail") and hasattr(e, "status_code"):
    #         return Response({'error': e.detail}, status=e.status_code)
    #     return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_401_UNAUTHORIZED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_card(request, pk):
    try:
        # looking for the card with the informed id
        card = request.user.cards.filter(id=pk)

        # returning an exception if no card with the given id is found
        if card is None:
            raise CardNotFoundError()
        
        # deleting card from database
        card.delete()

        return Response(status=status.HTTP_200_OK)
    
    except Exception as e:
        if hasattr(e, "detail") and hasattr(e, "status_code"):
            return Response({'error': e.detail}, status=e.status_code)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)