from django.apps import AppConfig


class GroupAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'group_app'

    def ready(self):
        import group_app.signals
