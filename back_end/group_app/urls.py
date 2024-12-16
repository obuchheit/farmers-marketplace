from django.urls import path
from .views import (
    GroupCreateView,
    GroupDetailView,
    JoinRequestCreateView,
    JoinRequestApproveView,
    JoinRequestDenyView,
    GroupListView,
    GroupDetailPublicView,
)
from post_app.views import AllGroupMemberUserPostsView

urlpatterns = [
    #Public Views of groups
    path('public/', GroupListView.as_view(), name='group-lists'),
    path('public/<int:pk>/', GroupDetailPublicView.as_view(), name='public-group-detail'),
    path('create/', GroupCreateView.as_view(), name='create-group'),

    #Private Group Member views
    path('<int:pk>/', GroupDetailView.as_view(), name='group-member-detail'),
    path('<int:pk>/posts', AllGroupMemberUserPostsView.as_view(), name='group-member-posts'), #Shows all group members posts requardless if is_public or is_available is False

    #Join Request Views
    path('join-request/create/', JoinRequestCreateView.as_view(), name='join-request-create'),
    path('join-request/approve/<int:pk>/', JoinRequestApproveView.as_view(), name='join-request-approve'),
    path('join-request/deny/<int:pk>/', JoinRequestDenyView.as_view(), name='join-request-deny'),
]