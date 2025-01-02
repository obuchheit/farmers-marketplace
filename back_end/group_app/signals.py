from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import JoinRequest, GroupMember, Invitation, Notification

@receiver(post_save, sender=JoinRequest)
def notify_group_admins_on_join_request(sender, instance, created, **kwargs):
    if created:
        group = instance.group
        admins = group.members.filter(role='admin', is_approved=True).values_list('user', flat=True)
        for admin_id in admins:
            Notification.objects.create(
                user_id=admin_id,
                message=f"A new join request has been sent to the group: {group.name}."
            )

@receiver(post_save, sender=GroupMember)
def notify_group_on_new_member(sender, instance, created, **kwargs):
    if created and instance.is_approved:
        group = instance.group
        members = group.members.exclude(user=instance.user).values_list('user', flat=True)
        for member_id in members:
            Notification.objects.create(
                user_id=member_id,
                message=f"{instance.user.first_name} {instance.user.last_name} has joined the group: {group.name}."
            )

@receiver(post_save, sender=Invitation)
def notify_user_on_invitation(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.invitee,
            message=f"You have been invited to join the group: {instance.group.name} by {instance.invited_by.first_name} {instance.invited_by.last_name}."
        )

@receiver(post_save, sender=GroupMember)
def notify_user_on_request_approval(sender, instance, created, **kwargs):
    if created and instance.is_approved:
        Notification.objects.create(
            user=instance.user,
            message=f"Your request to join the group: {instance.group.name} has been approved."
        )
