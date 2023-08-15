from products.models import ProductChild
from .exceptions import InvalidShoppingCartItemError, InvalidQuantitytError, ItemNotFoundInCartError, DuplicateItemError
from products.models import ProductChild
from products.exceptions import ProductNotFoundError
from transactions.exceptions import InternalError


def validate_cart_products(products):
    existing_ids = [product["id"] for product in products] # creating a list with product id
    has_error = False
    if len(set(existing_ids)) == len(existing_ids):
        for product in products:
            product_instance = ProductChild.objects.filter(id=product.get("id")).first()
            if not product_instance or product_instance.quantity < product.get("quantity"):
                has_error = True

        if not has_error: # if no product is invalid, it returns True
            return True
        raise InvalidShoppingCartItemError() # raises an exception if any product is invalid
        
    raise DuplicateItemError()
        
def delete_cart_product(cart_instance, product_id):
    try:
        if cart_instance.is_full(): # checking if the shopping cart has products
            existing_items = cart_instance.products.copy() # creating a copy of shopping cart products
            new_items = [] # creating an empty list
            found_product = False # creating a variable that stores a boolean value

            for product in existing_items: # scrolling through all the products in the existing_items list
                if product["id"] != product_id: # checking if the id of the current product is different from the id of the product that will be deleted
                    new_items.append(product) # adding the product in the new_items list
                else:
                    # assigning the value True to the variable, in case the current product id is the id of the product that will be deleted
                    found_product = True

            #raising an exception if the value of the variable found product is False
            if not found_product:
                raise ItemNotFoundInCartError()
                
            cart_instance.products = new_items # replacing cart products with existing_items list products
            cart_instance.save() # saving changes to the database

    except Exception as e:
        raise e
    
def update_cart_product(cart_instance, product_id, quantity=None):
    try:
        if cart_instance.is_full(): # checking if the shopping cart has products
            found_product = False # creating a variable that stores a boolean value
            existing_items = cart_instance.products.copy() # creating a copy of shopping cart products
            for product in existing_items: # scrolling through all the products in the shopping cart
                if product["id"] == product_id: # checking if the current product in the list is the same one that should be updated
                        product_instance = ProductChild.objects.filter(id=product_id).first() # creating a product instance
                        if product_instance: # checking if the instance is valid
                            # checking if the quantity that must be updated exists and then if the current quantity in stock of the product is less than or equal to the quantity to be updated
                            if quantity is not None and type(quantity) == int and product_instance.quantity >= quantity:
                                if quantity > 0: # checking if the quantity to change is greater than zero
                                    product["quantity"] = quantity # changing the quantity
                                    cart_instance.products = existing_items # replacing cart products with existing_items list products
                                    cart_instance.save() # saving changes to the database
                                    found_product = True
                                else:
                                    # deleting the product from the shopping cart, if the quantity to be changed is equal to or less than zero
                                    delete_cart_product(cart_instance, product_id)
                            else:
                                raise InvalidQuantitytError()
                        else:
                            # deleting the product from the cart, if it no longer exists in the db
                            delete_cart_product(cart_instance, product_id)
                            raise ProductNotFoundError()
            
            #raising an exception if the value of the variable found product is False
            if not found_product:
                raise ItemNotFoundInCartError()

    except Exception as e:
        raise e

def add_cart_product(cart_instance, new_products):
    try:
        existing_items = cart_instance.products.copy() # creating a copy of shopping cart products
        
        if len(cart_instance.products) > 0: # checking if the shopping cart has products
            existing_ids = [product["id"] for product in existing_items] # creating a list with product id
            
            # going through the items that were already in the cart and checking if any of the new products already exist in the cart
            for product in new_products:
                if product["id"] not in existing_ids:
                    existing_items.append(product)
        else:
            existing_items.extend(new_products) # adding all products to existing_items list

        cart_instance.products = existing_items # replacing cart products with existing_items list products
        cart_instance.save() # saving changes to the database

    except:
        raise InternalError()