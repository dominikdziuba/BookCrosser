from django.urls import path
from django.conf.urls import include
from rest_framework import routers
from .views import BookViewSet, ShelfViewSet, UserViewSet, CityViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'books', BookViewSet)
router.register(r'shelves', ShelfViewSet)
router.register(r'cities', CityViewSet)


urlpatterns = [
    path('', include(router.urls)),

]
