from products.exceptions import ProductNotFoundError
from stores.exceptions import StoreNotFoundError
from .exceptions import InvalidCommentError, InvalidCommentRatingError
from django.utils.html import escape

def validate_data(product_id, comment, rating, is_store=False):

    # verifing if product id is a int type
    if not isinstance(product_id, int):
        if is_store:
            raise StoreNotFoundError()
        raise ProductNotFoundError()
    
    # verifing if a comment is not empty
    if not comment:
        raise InvalidCommentError()
    
    # verifing if comment has a xss injection
    if escape(comment) != comment:
        raise InvalidCommentError()
    
    # verifing if rating is valid
    if not isinstance(rating, (int, float)) or rating < 1 or rating > 5:
        raise InvalidCommentRatingError()
    