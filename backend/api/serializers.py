from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserActivity, Requests, Listing
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['carbon_footprint']

from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # 🔐 HASHING password
        user.save()
        return user


class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ['date', 'count']

class RequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requests
        fields = ['id','request_name', 'description', 'category', 'condition', 'max_price', 'location', 'urgency','created_at']
class ListingSerializer(serializers.ModelSerializer):
    claimed_by = serializers.StringRelatedField(read_only=True)  # Optional: show username

    class Meta:
        model = Listing
        fields = ['id', 'name', 'description', 'quantity', 'cost', 'image', 'category', 'created_at', 'carbon_footprint', 'status', 'claimed_by']
