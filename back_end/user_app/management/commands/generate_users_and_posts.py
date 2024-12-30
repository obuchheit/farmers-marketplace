import random
from django.core.management.base import BaseCommand
from user_app.models import User
from post_app.models import UserPosts

class Command(BaseCommand):
    help = "Generate users and posts for testing purposes."

    def handle(self, *args, **options):
        # User data
        user_data = [
            {"email": "obuchheit45@gmail.com", "first_name": "Owen", "last_name": "Buchheit", "address": "Chicago, IL"},
            {"email": "Aguilar2142@gmail.com", "first_name": "Jesus", "last_name": "Aquilar", "address": "Evanston, IL"},
            {"email": "jamcrome99@gmail.com", "first_name": "James", "last_name": "Cromer", "address": "Oak Park, IL"},
            {"email": "trapbyers12@gmail.com", "first_name": "James", "last_name": "Byers", "address": "Naperville, IL"},
            {"email": "gardener1@example.com", "first_name": "Anna", "last_name": "Smith", "address": "Aurora, IL", "bio": "I have a backyard garden. I don't use any herbicides or pesticides."},
            {"email": "urbanfarmer@example.com", "first_name": "Mark", "last_name": "Taylor", "address": "Schaumburg, IL", "bio": "I grow organic vegetables in my urban farm."},
            {"email": "locallygrown@example.com", "first_name": "Linda", "last_name": "Johnson", "address": "Elgin, IL", "bio": "All my produce is freshly harvested and chemical-free."},
            {"email": "freshproduce@example.com", "first_name": "David", "last_name": "Green", "address": "Joliet, IL", "bio": "Dedicated to growing high-quality produce for the community."}
        ]

        # Post images and related titles/descriptions
        post_images = [
            "blackberries.jpeg", "apples.jpg", "banana_peppers.jpeg", "cherries.jpeg",
            "cucumber.jpeg", "default_post_image.jpg", "Eggs.jpeg", "farm_eggs.jpeg",
            "golden.jpeg", "honey.jpeg", "jalap.jpeg", "Maters.jpeg", "okra.jpeg",
            "oranges.jpeg", "pecans.jpeg", "potatoes.jpeg", "pumpkin.jpeg",
            "romas.jpeg", "spaghetti_squash.jpeg", "strawberries.jpeg",
            "strawberry_jam.jpeg", "sweet_oranges.jpeg", "taters.jpeg", "watermelon.jpeg"
        ]

        def generate_post_data(image_name):
            title = image_name.split(".")[0].replace("_", " ").capitalize()
            description = f"Delicious {title.lower()} grown and harvested locally."
            return title, description

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
                user.set_password("DjangoReact1!")
                user.save()
                self.stdout.write(f"Created user: {user.email}")
            else:
                self.stdout.write(f"User already exists: {user.email}")

            # Add bio if available
            if "bio" in data:
                user.bio = data["bio"]
                user.save()

        # Generate posts
        self.stdout.write("\nCreating posts for each user...")
        for user in User.objects.all():
            num_posts = random.randint(1, 5)  # Randomly assign 1 to 5 posts per user
            for _ in range(num_posts):
                image = random.choice(post_images)
                title, description = generate_post_data(image)
                UserPosts.objects.create(
                    user=user,
                    title=title,
                    description=description,
                    address=user.address,
                    is_available=True,
                    is_public=True
                )
            self.stdout.write(f"Generated {num_posts} posts for {user.email}")

        self.stdout.write("\nData generation complete!")
