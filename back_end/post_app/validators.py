from django.core.exceptions import ValidationError

def validate_title(value):
    if len(value) < 5:
        raise ValidationError('Title must be at least 5 characters long.')
