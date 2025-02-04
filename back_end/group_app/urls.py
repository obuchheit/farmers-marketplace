from django.urls import path
from .views import (
    GroupCreateView,
    GroupDetailView,
    JoinRequestCreateView,
    JoinRequestApproveView,
    JoinRequestDenyView,
    GroupListView,
    GroupDetailPublicView,
    InviteMemberView,
    AcceptInvitationView, 
    RejectInvitationView,
    NotificationListView,
    MarkNotificationAsReadView,
    UserGroupsView,
    GroupJoinRequestsView,
    ListInvitationsView,
)
from post_app.views import AllGroupMemberUserPostsView

urlpatterns = [
    #Public Views of groups
    path('public/', GroupListView.as_view(), name='group-lists'),##
    path('public/<int:pk>/', GroupDetailPublicView.as_view(), name='public-group-detail'),##
    path('create/', GroupCreateView.as_view(), name='create-group'),##

    #Private Group Member views
    path('my-groups/', UserGroupsView.as_view(), name='user_groups'),##
    path('<int:pk>/', GroupDetailView.as_view(), name='group-member-detail'),##
    path('<int:pk>/posts', AllGroupMemberUserPostsView.as_view(), name='group-member-posts'),## 

    #Join Request Views
    path('join-request/create/', JoinRequestCreateView.as_view(), name='join-request-create'),##
    path('<int:pk>/join-requests/', GroupJoinRequestsView.as_view(), name='group-join-requests'),##
    path('join-request/approve/<int:pk>/', JoinRequestApproveView.as_view(), name='join-request-approve'),##
    path('join-request/deny/<int:pk>/', JoinRequestDenyView.as_view(), name='join-request-deny'),##

    #Invitation Views
    path('invite/', InviteMemberView.as_view(), name='invite_member'),##
    path('invite/<int:pk>/accept/', AcceptInvitationView.as_view(), name='accept_invitation'),
    path('invite/<int:pk>/reject/', RejectInvitationView.as_view(), name='reject_invitation'),
    path('invitations/', ListInvitationsView.as_view(), name='list_invitations'),


    #Notification Views
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    path('notifications/<int:pk>/read/', MarkNotificationAsReadView.as_view(), name='mark_notification_as_read'),
]