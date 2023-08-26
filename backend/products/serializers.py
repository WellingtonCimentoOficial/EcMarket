from rest_framework import serializers
from .models import ProductFather, ProductChild, ProductPresentation, ProductTechnicalInformation
from django.db.models import Avg, Count
from stores.serializers import StoreSerializer

class ProductChildDetailSerializer(serializers.ModelSerializer):
    default_price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    discount_price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    discount_percentage = serializers.SerializerMethodField()
    installment_details = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    def get_discount_percentage(self, obj):
        return obj.discount_percentage()
    
    def get_images(self, obj):
        request = self.context.get('request')
        image_fields = ['principal_image', 'image_2', 'image_3', 'image_4', 'image_5']
        images = {}
        for field_name in image_fields:
            image = getattr(obj, field_name)
            if image:
                images[field_name] = request.build_absolute_uri(image.url)
            else:
                images[field_name] = None
        return images 
    
    def get_installment_details(self, obj):
        max_installments = 12
        installment_price = obj.default_price / max_installments
        data = {
            "installments": max_installments,
            "installment_price": installment_price
        }
        return data

    class Meta:
        model = ProductChild
        exclude = [
            'product_father',
            'principal_image', 
            'image_2', 
            'image_3', 
            'image_4', 
            'image_5' 
        ]


class ProductChildMinimalSerializer(serializers.ModelSerializer):
    default_price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    discount_price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    discount_percentage = serializers.SerializerMethodField()
    installment_details = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    def get_discount_percentage(self, obj):
        return obj.discount_percentage()
    
    def get_images(self, obj):
        request = self.context.get('request')
        image_fields = ['principal_image', 'image_2', 'image_3', 'image_4', 'image_5']
        images = {}
        for field_name in image_fields:
            image = getattr(obj, field_name)
            if image:
                images[field_name] = request.build_absolute_uri(image.url)
            else:
                images[field_name] = None
        return images 
    
    def get_installment_details(self, obj):
        max_installments = 12
        installment_price = obj.default_price / max_installments
        data = {
            "installments": max_installments,
            "installment_price": installment_price
        }
        return data

    class Meta:
        model = ProductChild
        exclude = [
            'product_father', 
            'sku', 
            'quantity', 
            'created_at', 
            'updated_at', 
            'principal_image', 
            'image_2', 
            'image_3', 
            'image_4', 
            'image_5'
        ]

class ProductPresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPresentation
        exclude = ['product']

class ProductTechnicalInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductTechnicalInformation
        exclude = ['product']

class ProductFatherDetailSerializer(serializers.ModelSerializer):
    shipping_weight = serializers.DecimalField(max_digits=7, decimal_places=2, coerce_to_string=False)
    shipping_width = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    shipping_height = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    shipping_length = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    children = ProductChildDetailSerializer(many=True, read_only=True)
    presentation = serializers.SerializerMethodField()
    technical_informations = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    store = StoreSerializer()

    def get_rating(self, obj):
        average_rating = obj.comments.aggregate(Avg('rating'))['rating__avg']
        rating_count = obj.comments.aggregate(Count('rating'))['rating__count']
        rating_data = {
            "average": round(average_rating, 2) if average_rating else 0,
            "count": rating_count
        }
        return rating_data
    
    def get_presentation(self, obj):
        request = self.context.get('request')
        try:
            presentation = obj.presentation
            serializer = ProductPresentationSerializer(presentation, context={'request': request})
            return serializer.data
        except:
            return None
        
    def get_technical_informations(self, obj):
        request = self.context.get('request')
        try:
            technical_informations = obj.technical_information.all()
            serializer = ProductTechnicalInformationSerializer(technical_informations, many=True, context={'request': request})
            return serializer.data
        except:
            return None

    class Meta:
        model = ProductFather
        fields = '__all__'


class ProductFatherMinimalSerializer(serializers.ModelSerializer):
    children = ProductChildMinimalSerializer(many=True, read_only=True)
    rating = serializers.SerializerMethodField()

    def get_rating(self, obj):
        average_rating = obj.comments.aggregate(Avg('rating'))['rating__avg']
        rating_count = obj.comments.aggregate(Count('rating'))['rating__count']
        rating_data = {
            "average": round(average_rating, 2) if average_rating else 0,
            "count": rating_count
        }
        return rating_data

    class Meta:
        model = ProductFather
        exclude = [
            'categories',
            'store',
            'shipping_weight',
            'shipping_width',
            'shipping_height',
            'shipping_length',
            'created_at',
            'updated_at'
        ]
