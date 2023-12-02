from rest_framework import serializers
from .models import Book, Shelf
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class UserSelializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        token = Token.objects.create(user=user)
        return user


class BookSerializer(serializers.ModelSerializer):
    #added_by = UserSelializer(many=False,read_only=True)
    #taken_by = UserSelializer(many=False,read_only=True)
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'description', 'added_date', 'added_by', 'taken_by']


class ShelfSerializer(serializers.ModelSerializer):
    books = BookSerializer(many=True, read_only=True)

    class Meta:
        model = Shelf
        fields = ['id', 'name', 'address', 'latitude', 'longitude', 'books', 'no_of_books']
