from django.urls import path
from .views import (
    SignupView,
    SignInView,
    SignOutView,
    UserProfileView,
    UpdateUserProfileView,
    AdminProfileView,
    UpdateAdminProfileView,
    UserProfilePublicView,
    UserSearchView,
)

urlpatterns = [
    #Auth endpoints
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('auth/signin/', SignInView.as_view(), name='signin'),
    path('auth/signout/', SignOutView.as_view(), name='signout'),

    #View for token generation
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    #User Personal endpoint for CRUD
    path('profile/update/', UpdateUserProfileView.as_view(), name='update-user-profile'),

    #admin profile endpoints
    path('admin/profile/', AdminProfileView.as_view(), name='admin-profile'),
    path('admin/profile/update/', UpdateAdminProfileView.as_view(), name='update-admin-profile'),

    #User profile public view endpoint
    path('user/<int:user_id>/', UserProfilePublicView.as_view(), name='user-profile'),

    #Search Users endpoint
    path('search/', UserSearchView.as_view(), name='user-search')

]
