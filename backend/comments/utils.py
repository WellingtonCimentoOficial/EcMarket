from products.exceptions import ProductFatherNotFoundError
from stores.exceptions import StoreNotFoundError
from .exceptions import InvalidCommentError, InvalidCommentRatingError
from django.utils.html import escape

def validate_data(product_id, comment, rating, is_store=False):
    # verifing if product id is a int type
    if not isinstance(product_id, int):
        if is_store:
            raise StoreNotFoundError()
        raise ProductFatherNotFoundError()
    
    # verifing if a comment is not empty
    if not comment:
        raise InvalidCommentError()
    
    # verifing if comment has a xss injection
    if escape(comment) != comment:
        raise InvalidCommentError()
    
    # verifing if rating is valid
    if not isinstance(rating, (int, float)) or rating < 1 or rating > 5:
        raise InvalidCommentRatingError()
    

def apply_filters(productfather_instance, rating=None):
    # getting all the data from the database
    comments = productfather_instance.comments.all().order_by('-id')

    # checking if rating param is true
    if rating is not None:
        try:
            # converting the rating parameter to an integer
            rating_int = int(rating)

            # converting the rating parameter to an integer
            rating_max = rating_int + 1

            # filtering for comments that have a rating within the range
            comments = productfather_instance.comments.filter(rating__range=[rating_int if rating_int <= 5 else 5, 5 if rating_max > 5 else rating_max])
        except:
            pass
        
    return comments