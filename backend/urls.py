from django.urls import path
from django.conf.urls import include
from rest_framework import routers
from .views import BookViewSet, ShelfViewSet, UserViewSet

router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('books', BookViewSet)
router.register('shelves', ShelfViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
