from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import generics, views
from .serializers import UserSerializer, UserActivitySerializer, RequestsSerializer, ListingSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import UserActivity, Requests, Listing
from django.utils import timezone
from django.db.models import Count, Q
from datetime import timedelta
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

class UserProfileView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class UserStatsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        period = request.query_params.get("period", "week")
        user = request.user
        end_date = timezone.now().date()
        if period == "week":
            start_date = end_date - timedelta(days=7)
        elif period == "month":
            start_date = end_date - timedelta(days=30)
        else:  # day
            start_date = end_date - timedelta(days=1)

        stats = (UserActivity.objects
                 .filter(user=user, date__range=[start_date, end_date])
                 .values('date')
                 .annotate(count=Count('id'))
                 .order_by('date'))
        serializer = UserActivitySerializer(stats, many=True)
        return Response(serializer.data)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CreateRequestView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        serializer = RequestsSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class CreateListingView(views.APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        data = request.data
        serializer = ListingSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class AllRequestsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_query = request.query_params.get("q", "")
        requests = Requests.objects.filter(
            Q(request_name__icontains=search_query) |
            Q(description__icontains=search_query)
        )
        serializer = RequestsSerializer(requests, many=True)
        return Response(serializer.data)

class AllListingsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_query = request.query_params.get("q", "")
        listings = Listing.objects.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query)
        )
        serializer = ListingSerializer(listings, many=True)
        return Response(serializer.data)

class AllUsersView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_query = request.query_params.get("q", "")
        users = User.objects.filter(
            Q(username__icontains=search_query) |
            Q(email__icontains=search_query)
        )
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class RequestView(views.APIView):
    permission_classes = [IsAuthenticated]  # Change to AllowAny for public access

    def get(self, request, pk):
        request_obj = get_object_or_404(Requests, pk=pk)
        serializer = RequestsSerializer(request_obj)
        return Response(serializer.data)

class ListingView(views.APIView):
    permission_classes = [IsAuthenticated]  # Change to AllowAny for public access

    def get(self, request, pk):
        listing = get_object_or_404(Listing, pk=pk)
        serializer = ListingSerializer(listing)
        return Response(serializer.data)