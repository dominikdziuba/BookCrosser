from django.db import models
from django.contrib.auth.models import User


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    description = models.TextField()
    added_date = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='added', blank=True, null=True)
    taken_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='taken', blank=True, null=True)

    def __str__(self):
        return self.title


class City(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Shelf(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    books = models.ManyToManyField('Book', related_name='books', blank=True, )
    location = models.ForeignKey(City, on_delete=models.CASCADE, default=1, null=True)

    def __str__(self):
        return self.name

    def no_of_books(self):
        books = Book.objects.filter(shelves=self)
        return len(books)
