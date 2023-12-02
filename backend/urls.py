from django.urls import path
from django.conf.urls import include
from rest_framework import routers
from .views import BookViewSet, ShelfViewSet, UserViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'books', BookViewSet)
router.register(r'shelves', ShelfViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
