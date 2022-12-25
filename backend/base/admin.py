from django.contrib import admin

from .models import PieInfo, User

# Register your models here.
admin.site.register(User)
admin.site.register(PieInfo)
