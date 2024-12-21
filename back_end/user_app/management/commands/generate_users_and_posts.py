import random
from django.core.management.base import BaseCommand
from user_app.models import User
from post_app.models import UserPosts

class Command(BaseCommand):
    help = "Generate users and posts for testing purposes."

    def handle(self, *args, **options):
        # User data
        user_data = [
            {"email": "john.doe@example.com", "first_name": "John", "last_name": "Doe", "address": "Chicago, IL"},
            {"email": "jane.smith@example.com", "first_name": "Jane", "last_name": "Smith", "address": "Chicago, IL"},
            {"email": "michael.jones@example.com", "first_name": "Michael", "last_name": "Jones", "address": "Chicago, IL"},
            {"email": "emily.davis@example.com", "first_name": "Emily", "last_name": "Davis", "address": "Chicago, IL"},
            {"email": "chris.brown@example.com", "first_name": "Chris", "last_name": "Brown", "address": "Chicago, IL"},
        ]

        # Post titles
        post_titles = [
            "Fresh Apples", "Organic Carrots", "Sweet Oranges",
            "Juicy Tomatoes", "Farm Fresh Eggs", "Homemade Jam",
            "Local Honey", "Seasonal Pumpkins", "Freshly Baked Bread",
            "Handmade Cheese"
        ]

        # Generate users
        self.stdout.write("Creating users...")
        for data in user_data:
            user, created = User.objects.get_or_create(
                email=data["email"],
                defaults={
                    "first_name": data["first_name"],
                    "last_name": data["last_name"],
                    "address": data["address"],
                }
            )
            if created:
                user.set_password("Django")
                user.save()
                self.stdout.write(f"Created user: {user.email}")
            else:
                self.stdout.write(f"User already exists: {user.email}")

        # Generate posts
        self.stdout.write("\nCreating posts for each user...")
        for user in User.objects.all():
            num_posts = random.randint(1, 10)  # Randomly assign 1 to 10 posts per user
            for _ in range(num_posts):
                UserPosts.objects.create(
                    user=user,
                    title=random.choice(post_titles),
                    description="A wonderful product from Chicago's local farms.",
                    address="Chicago, IL",
                    is_available=bool(random.randint(0, 1)),
                    is_public=True
                )
            self.stdout.write(f"Generated {num_posts} posts for {user.email}")

        self.stdout.write("\nData generation complete!")
