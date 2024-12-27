from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re

def validate_email(value):
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, value):
        raise ValidationError(_('Invalid email address format.'), params={'value': value})

def validate_name(value):
    if not value.isalpha():
        raise ValidationError(_('Name can only contain alphabetic characters.'), params={'value': value})

def validate_city_state_format(value):
    # Regex to match City, State format
    city_state_regex = r'^[a-zA-Z\s]+,\s?[A-Za-z]{2,}$'
    if not re.match(city_state_regex, value):
        raise ValidationError(
            _('Address must be in "City, State" format (e.g., "Chicago, IL" or "St. Louis, Missouri").'),
            params={'value': value}
        )


def validate_password(value):
    """
    Validates a password to ensure it meets the following criteria:
    - At least 8 characters long
    - Contains at least one uppercase letter
    - Contains at least one lowercase letter
    - Contains at least one number
    - Contains at least one special character (!@#$%^&*()_+=-)
    """
    if len(value) < 8:
        raise ValidationError(_("Password must be at least 8 characters long."))
    if not any(char.isupper() for char in value):
        raise ValidationError(_("Password must contain at least one uppercase letter."))
    if not any(char.islower() for char in value):
        raise ValidationError(_("Password must contain at least one lowercase letter."))
    if not any(char.isdigit() for char in value):
        raise ValidationError(_("Password must contain at least one number."))
    if not re.search(r'[!@#$%^&*()_+=\-]', value):
        raise ValidationError(_("Password must contain at least one special character (!@#$%^&*()_+=-)."))
