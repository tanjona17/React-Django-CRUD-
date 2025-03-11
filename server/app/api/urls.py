from django.urls import path
from .views import create_user, get_user, user_action

urlpatterns = [
    path("users/", get_user, name = "get_users"),
    path("users/create", create_user, name = "create_user"),
     path("users/<int:id>",user_action, name = "user_action")
]
