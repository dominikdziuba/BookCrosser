from django.contrib import admin
from .models import Shelf
from .models import Book


admin.site.register(Shelf)
admin.site.register(Book)
