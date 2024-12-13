from rest_framework import permissions

class IsGroupCreatorOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Check if the user is the creator or an admin of the group
        if request.user == obj.created_by:
            return True
        return obj.members.filter(user=request.user, role='admin').exists()

class IsMemberOfGroup(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Check if the user is an approved member of the group
        return obj.members.filter(user=request.user, is_approved=True).exists()
