from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserActivity, Requests, Listing

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ['date', 'count']

class RequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requests
        fields = ['request_name', 'description', 'category', 'condition', 'max_price', 'location', 'urgency','created_at']

class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['id','name', 'description', 'quantity', 'cost', 'image', 'category','created_at']
