from django.db.models import Avg, Q

def apply_product_filters(product_instance, **kwargs):
    search = kwargs.get('search')
    rating = kwargs.get('rating')
    random = kwargs.get('random')

    # verifing if search param exists and if his value is true 
    if search is not None:
        products = product_instance.objects.filter(Q(name__icontains=search)).all()
    else:
        products = product_instance.objects.all()

    if rating is not None and rating.isdigit():
        products = products.annotate(average_rating=Avg('comments__rating'))
        products = products.filter(Q(average_rating__gte=int(rating)))

    # verifing if random param is true and then organizing
    if random is not None and random.lower() == 'true':
        products = products.order_by('?')
    else:
        products = products.order_by('-id')
    
    return products