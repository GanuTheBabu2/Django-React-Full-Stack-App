# api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("user/profile/", views.UserProfileView.as_view(), name="user-profile"),
    path("user/stats/", views.UserStatsView.as_view(), name="user-stats"),
    path("requests/create/", views.CreateRequestView.as_view(), name="create-request"),
    path("listings/create/", views.CreateListingView.as_view(), name="create-listing"),
    path("requests/", views.AllRequestsView.as_view(), name="all-requests"),
    path("listings/", views.AllListingsView.as_view(), name="all-listings"),
    path("users/", views.AllUsersView.as_view(), name="all-users"),  # New endpoint
    path("requests/view/<int:pk>/", views.RequestView.as_view(), name="request-view"),
    path("listings/view/<int:pk>/", views.ListingView.as_view(), name="listing-view"),
    path("listings/claim/<int:pk>/", views.claim_listing, name="claim-listing"),

]