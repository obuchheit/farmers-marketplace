from django.test import TestCase
from user_app.models import User
from post_app.models import UserPosts
from random import randint

class UserAndPostTestCase(TestCase):
    def setUp(self):
        # User data
        self.users = [
            {
                "email": "john.doe@example.com",
                "password": "password123",
                "first_name": "John",
                "last_name": "Doe",
                "address": "Chicago, IL"
            },
            {
                "email": "jane.smith@example.com",
                "password": "password123",
                "first_name": "Jane",
                "last_name": "Smith",
                "address": "Chicago, IL"
            },
            {
                "email": "michael.jones@example.com",
                "password": "password123",
                "first_name": "Michael",
                "last_name": "Jones",
                "address": "Chicago, IL"
            },
            {
                "email": "emily.davis@example.com",
                "password": "password123",
                "first_name": "Emily",
                "last_name": "Davis",
                "address": "Chicago, IL"
            },
            {
                "email": "chris.brown@example.com",
                "password": "password123",
                "first_name": "Chris",
                "last_name": "Brown",
                "address": "Chicago, IL"
            }
        ]

        # Create users
        for user_data in self.users:
            User.objects.create_user(
                email=user_data["email"],
                password=user_data["password"],
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                address=user_data["address"]
            )

        # Generate posts for each user
        self.generate_posts_for_users()

    def generate_posts_for_users(self):
        titles = [
            "Fresh Apples", "Organic Carrots", "Sweet Oranges",
            "Juicy Tomatoes", "Farm Fresh Eggs", "Homemade Jam",
            "Local Honey", "Seasonal Pumpkins", "Freshly Baked Bread",
            "Handmade Cheese"
        ]

        for user in User.objects.all():
            num_posts = randint(1, 10)  # Randomly assign 1 to 10 posts per user
            for _ in range(num_posts):
                UserPosts.objects.create(
                    user=user,
                    title=titles[randint(0, len(titles) - 1)],
                    description="A wonderful product from Chicago's local farms.",
                    address="Chicago, IL",
                    is_available=bool(randint(0, 1)),
                    is_public=True
                )

    def test_users_and_posts_created(self):
        # Verify users
        self.assertEqual(User.objects.count(), 5)
        for user_data in self.users:
            self.assertTrue(User.objects.filter(email=user_data["email"]).exists())

        # Verify posts
        total_posts = UserPosts.objects.count()
        self.assertTrue(total_posts >= 5)  # At least 1 post per user
        self.assertTrue(total_posts <= 50)  # At most 10 posts per user
        print(f"Total posts created: {total_posts}")

        # Ensure all posts have "Chicago, IL" as the address
        self.assertTrue(all(post.address == "Chicago, IL" for post in UserPosts.objects.all()))
