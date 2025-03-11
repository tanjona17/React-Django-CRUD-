from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializer import User_serializer

@api_view(["GET"])

def get_user(req):
   users = User.objects.all()
   serialized_user = User_serializer(users, many = True).data #mamadika anle user ho lasa sous format JSON
   return Response(serialized_user)

@api_view(["POST"])

def create_user(req):
    data = req.data
    serializer = User_serializer( data = data) #avadika json le data avy any am front
 
    if serializer.is_valid():
           serializer.save()
           return Response(serializer.data, status = status.HTTP_201_CREATED)
    return Response(status = status.HTTP_400_BAD_REQUEST)
        
@api_view(["PUT", "DELETE"])

def user_action(req, id):
   try:
      user = User.objects.get(id = id)
   except User.DoesNotExist:
      return Response(status = status.HTTP_404_NOT_FOUND)

   if req.method == "DELETE":
      user.delete()
      return Response(status = status.HTTP_204_NO_CONTENT)
   elif req.method == "PUT":
      data = req.data
      serializer = User_serializer(user, data = data)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data, status = status.HTTP_201_CREATED)
      return Response(status = status.HTTP_400_BAD_REQUEST) 
  
    

   