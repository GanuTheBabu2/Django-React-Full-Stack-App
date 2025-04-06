from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import generics, views
from .serializers import UserSerializer, UserActivitySerializer, RequestsSerializer, ListingSerializer , PublicUserSerializer , ReviewSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import UserActivity, Requests, Listing
from django.utils import timezone
from django.db.models import Count, Q
from datetime import timedelta
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
import random
from .serializers import  UserProfileSerializer
from rest_framework.views import APIView
from .models import Review
from rest_framework import status


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Listing, UserProfile
from django.shortcuts import get_object_or_404

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def claim_listing(request, pk):
    listing = get_object_or_404(Listing, pk=pk)

    if listing.status == 'claimed':
        return Response({'error': 'This listing has already been claimed.'}, status=status.HTTP_400_BAD_REQUEST)

    # Ensure profile exists, create if missing
    profile, _ = UserProfile.objects.get_or_create(user=request.user)

    # Claim the listing
    listing.status = 'claimed'
    listing.claimed_by = request.user
    listing.save()

    # Update carbon footprint (example logic)
    profile.carbon_footprint += listing.carbon_footprint
    profile.save()

    return Response({'message': 'Listing claimed successfully.'})

@api_view(['GET'])
@permission_classes([AllowAny])
def public_user_profile(request, user_id):
    user = get_object_or_404(User, id=user_id)
    profile = get_object_or_404(UserProfile, user=user)
    data = PublicUserSerializer(profile).data
    return Response(data)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            profile = UserProfile.objects.get(user=user)
            user_data = UserSerializer(user).data
            profile_data = UserProfileSerializer(profile).data
            # Combine user and profile data
            combined_data = {**user_data, **profile_data}
            return Response(combined_data)
        except UserProfile.DoesNotExist:
            # Create profile if it doesn't exist
            profile = UserProfile.objects.create(user=user)
            user_data = UserSerializer(user).data
            profile_data = UserProfileSerializer(profile).data
            return Response({**user_data, **profile_data})

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
        data = request.data.copy()  # Make a mutable copy
        data['carbon_footprint'] = round(random.uniform(0.1, 5.0), 2)  # Add random value
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
    
# Get reviews for a specific user
class UserReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Review.objects.filter(reviewed_user_id=user_id)

# Submit a review
class SubmitReviewView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        reviewed_user_id = data.get("reviewed_user")

        # Check for existing review
        if Review.objects.filter(reviewer=request.user, reviewed_user_id=reviewed_user_id).exists():
            return Response(
                {"error": "You have already reviewed this user."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save(reviewer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get current logged-in user
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)