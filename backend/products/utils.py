from django.db.models import Avg, Q
from django.db.models.functions import Coalesce
from .exceptions import ProductFilterError

def apply_product_filters(product_instance, **kwargs):
    search = kwargs.get('search')
    rating = kwargs.get('rating')
    random = kwargs.get('random')
    relevance = kwargs.get('relevance')

    # verifing if search param exists and if his value is true 
    if search is not None:
        products = product_instance.objects.filter(Q(name__icontains=search)).all()
    else:
        products = product_instance.objects.all()

    if rating is not None and rating.isdigit():
        if int(rating) > 0 and int(rating) <= 5:
            products = products.annotate(average_rating=Avg('comments__rating'))
            products = products.filter(Q(average_rating__gte=int(rating)))
        else:
            raise ProductFilterError()

    if relevance is not None and relevance.isdigit():
        if int(relevance) == 0:
            if hasattr(products.first(), 'average_rating'):
                products = products.order_by('-average_rating')
            else:
                products = products.annotate(average_rating=Avg('comments__rating')).order_by('-average_rating')
        elif int(relevance) == 1:
            products = products.annotate(ordering_price=Coalesce('children__discount_price', 'children__default_price')).order_by('-ordering_price')
        elif int(relevance) == 2:
            products = products.annotate(ordering_price=Coalesce('children__discount_price', 'children__default_price')).order_by('ordering_price')
        else:
            raise ProductFilterError()
        
    # verifing if random param is true and then organizing
    if random is not None and random.lower() == 'true':
        products = products.order_by('?')
    elif not hasattr(products.first(), 'average_rating') and not hasattr(products.first(), 'ordering_price'):
        products = products.order_by('-id')
    
    return products