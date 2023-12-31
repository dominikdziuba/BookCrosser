from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Book, Shelf
from .serializers import BookSelializer, ShelfSerializer, UserSelializer
from geopy.distance import geodesic
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSelializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSelializer
    authentication_classes = (TokenAuthentication,)
    permission_classes =(IsAuthenticated,)

class ShelfViewSet(viewsets.ModelViewSet):
    queryset = Shelf.objects.all()
    serializer_class = ShelfSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes =(IsAuthenticated,)

    @action(detail=True, methods=['POST'])
    def add_book_to_shelf(self, request, pk=None):
        # user = User.objects.get(id=1)
        user = request.user
        shelf = Shelf.objects.get(id=pk)
        serializer = BookSelializer(data=request.data)
        if serializer.is_valid():
            book = serializer.save(added_by=user)
            shelf.books.add(book)

            return Response({'message': 'Book added to shelf successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'])
    def take_book_from_shelf(self, request, pk=None):
        shelf = self.get_object()
        # user = User.objects.get(id=1)
        user = request.user
        print(user)
        book_id = request.data.get('book_id')

        try:
            book = shelf.books.get(id=book_id)
        except Book.DoesNotExist:
            return Response({'message': 'Book not found on the shelf'}, status=status.HTTP_404_NOT_FOUND)

        book.taken_by = user
        book.save()
        shelf.books.remove(book)

        return Response({'message': 'Book taken from the shelf successfully'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def create_shelf(self, request):
        serializer = ShelfSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def get_closest_shelf(self, request):
        user_coords = (50.058667, 19.942972)
        shelves = Shelf.objects.all()

        closest_shelf = None
        smallest_dist = None

        for shelf in shelves:
            shelf_coords = (shelf.latitude, shelf.longitude)
            distance = geodesic(user_coords, shelf_coords).kilometers

            if smallest_dist is None or distance < smallest_dist:
                closest_shelf = shelf
                smallest_dist = distance

        if closest_shelf is not None:
            response_data = {
                "closest_shelf_name": closest_shelf.name,
                "address": closest_shelf.address,
                "closest_shelf_distance_km": smallest_dist
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No shelves found'}, status=status.HTTP_404_NOT_FOUND)
