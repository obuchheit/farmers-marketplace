from django.urls import path
from .views import (
    AllPostsByLocationView,
    SingleUserPostView,
    AllUserPostsView, 
    ManageUserPostView, 
    AllUserSavedPostsView,
    UserSavedPostView,
    )

urlpatterns = [
    #Public Views of User Posts
    path('', AllPostsByLocationView.as_view, name="all-posts-by-location"), 
    path('<int:pk>/', SingleUserPostView.as_view, name="single-post"), 
    
    #Private User Posts Views
    path('user-posts/', AllUserPostsView.as_view(), name="all-user-posts"),
    path('user-posts/<int:post_id>/', ManageUserPostView.as_view(), name='manage-user-posts'),

    #User Saved Posts Views
    path('user-saved-posts/', AllUserSavedPostsView.as_view(), name='all-user-saved-posts'),
    path('user-saved-posts/<int:post_id>', UserSavedPostView.as_view(), name='user-saved-post')
]

