from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('products/', include('products.urls')),
    path('stores/', include('stores.urls')),
    path('favorites/', include('favorites.urls')),
    path('categories/', include('categories.urls')),
    path('addresses/', include('addresses.urls')),
    path('comments/', include('comments.urls')),
    path('cards/', include('cards.urls')),
    path('orders/', include('orders.urls')),
    path('cart/', include('cart.urls')),
    path('coupons/', include('coupons.urls')),
    path('transactions/', include('transactions.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
