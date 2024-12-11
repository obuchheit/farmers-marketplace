from django.urls import path
from .views import (
    AllUserPostsView, 
    ManageUserPostView, 
    AllUserSavedPostsView,
    UserSavedPostDetailView,
    UserSavedPostsCreateDeleteView,
    )

urlpatterns = [
    path('', AllUserPostsView.as_view(), name='user-posts'),
    path('<int:post_id>/', ManageUserPostView.as_view(), name='manage-user-post'),
    path('saved-posts/', AllUserSavedPostsView.as_view(), name='user-saved-posts'),
    path('saved-posts/<int:pk>/', UserSavedPostDetailView.as_view(), name='user-saved-post-details'),
    path('saved-posts/modify/<int:post_id>', UserSavedPostsCreateDeleteView.as_view(), name='add-delete-saved-post'),
]