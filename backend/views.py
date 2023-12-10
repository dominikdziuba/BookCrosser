from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Book, Shelf, City
from .serializers import BookSerializer, ShelfSerializer, UserSerializer, CitySerialzer
from geopy.distance import geodesic
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerialzer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, )

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class ShelfViewSet(viewsets.ModelViewSet):
    queryset = Shelf.objects.all()
    serializer_class = ShelfSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['GET'])
    def shelves_in_city(self, request):
        city_id = request.GET.get('city_id')  # Pobierz identyfikator miasta z parametru zapytania
        shelves = Shelf.objects.filter(location__id=city_id)
        serializer = ShelfSerializer(shelves, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def books_in_city(self, request):
        city_id = request.GET.get('city_id')
        search_query = request.GET.get('search_query', '')


        city = get_object_or_404(City, id=city_id)
        shelves = Shelf.objects.filter(location=city)


        books = Book.objects.filter(
            shelves__in=shelves,
            title__icontains=search_query
        ) | Book.objects.filter(
            shelves__in=shelves,
            author__icontains=search_query
        )
        print(books)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @action(detail=True, methods=['PUT'], url_path='edit_book_in_shelf/(?P<book_id>\d+)')
    def edit_book_in_shelf(self, request, pk=None, book_id=None):
        user = request.user
        shelf = Shelf.objects.get(id=pk)

        try:
            book = shelf.books.get(id=book_id)
        except Book.DoesNotExist:
            return Response({'message': 'Book not found on the shelf'}, status=status.HTTP_404_NOT_FOUND)

        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(BookSerializer(book).data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'])
    def add_book_to_shelf(self, request, pk=None):
        # user = User.objects.get(id=1)
        user = request.user
        shelf = Shelf.objects.get(id=pk)
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            book = serializer.save(added_by=user)
            shelf.books.add(book)

            return Response(BookSerializer(book).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['PUT'])
    def take_book_from_shelf(self, request, pk=None):
        shelf = self.get_object()
        # user = User.objects.get(id=1)
        user = request.user

        book_id = request.data.get('book_id')

        try:
            book = shelf.books.get(id=book_id)
        except Book.DoesNotExist:
            return Response({'message': 'Book not found on the shelf'}, status=status.HTTP_404_NOT_FOUND)

        book.taken_by = user
        book.save()
        shelf.books.remove(book)

        return Response(BookSerializer(book).data, status=status.HTTP_200_OK)

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
        user_latitude_str = request.GET.get('user_latitude', '')
        user_longitude_str = request.GET.get('user_longitude', '')

        if user_latitude_str is None or user_longitude_str is None:
            return Response({'error': 'User coordinates are missing or invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_latitude = float(user_latitude_str)
            user_longitude = float(user_longitude_str)
        except ValueError:
            return Response({'error': 'Invalid user coordinates.'}, status=status.HTTP_400_BAD_REQUEST)

        user_coords = (user_latitude,user_longitude)
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
                'id': closest_shelf.id,
                "closest_shelf_name": closest_shelf.name,
                "address": closest_shelf.address,
                "closest_shelf_distance_km": smallest_dist
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response( status=status.HTTP_404_NOT_FOUND)
