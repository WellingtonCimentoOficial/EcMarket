from django.db.models import OuterRef, Count, Q
from .exceptions import CategoryFilterError

def apply_category_filters(productfather_instance, categoryproduct_instance, search_param=None, min_product_count_param=None, max_product_count_param=None, random_param=None):

    # filtering by name
    if search_param is not None:
        if search_param != "":
            categories = categoryproduct_instance.objects.filter(Q(name__icontains=search_param)).order_by('-id')
        else:
            raise CategoryFilterError()
    else:
        categories = categoryproduct_instance.objects.all().order_by('-id')
    
    # limiting products to the reported value
    if max_product_count_param is not None:
        if max_product_count_param.isdigit():
            categories_subquery = productfather_instance.filter(categories=OuterRef('pk')).order_by('-id')[:max_product_count_param]
            categories = categoryproduct_instance.annotate(limit_products=categories_subquery)
        else:
            raise CategoryFilterError()
        

    # bringing only the categories that have the minimum number of products requested
    if min_product_count_param is not None:
        if min_product_count_param.isdigit():
            categories = categories.annotate(product_count=Count('productfather')).filter(product_count__gte=int(min_product_count_param))
        else:
            raise CategoryFilterError()

    # ordering itens random
    if random_param is not None and random_param.lower() == 'true':
        categories = categories.order_by('?')

    return categories