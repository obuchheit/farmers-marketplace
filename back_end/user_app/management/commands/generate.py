import random
import os
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from user_app.models import User
from post_app.models import UserPosts
from group_app.models import Group, GroupMember
from django.core.files.storage import default_storage
from marketplace_proj.settings import MEDIA_URL, MEDIA_ROOT


class Command(BaseCommand):
    help = "Generate users, posts, groups, and group members for testing purposes."

    def handle(self, *args, **options):
        chicago_addresses = [
            "Chicago, IL", "Evanston, IL", "Oak Park, IL",
            "Naperville, IL", "Aurora, IL", "Schaumburg, IL",
            "Elgin, IL", "Joliet, IL"
        ]

        users = [
            {"email": "obuchheit45@gmail.com", "first_name": "John", "last_name": "Smith", "address": "Chicago, IL", "bio": "I grow vegetables in my garden without any herbicides."},
            {"email": "aguilar2142@gmail.com", "first_name": "James", "last_name": "Williams", "address": "Evanston, IL", "bio": "I specialize in growing organic heirloom tomatoes."},
            {"email": "jamcrome99@gmail.com", "first_name": "William", "last_name": "Jones", "address": "Oak Park, IL", "bio": "I grow fresh herbs and leafy greens in my backyard."},
            {"email": "trapbyers12@gmail.com", "first_name": "James", "last_name": "Taylor", "address": "Naperville, IL", "bio": "I raise chickens and sell free-range eggs."},
            {"email": "user5@example.com", "first_name": "Michael", "last_name": "Brown", "address": "Aurora, IL", "bio": "I grow berries and make homemade jams."},
            {"email": "user6@example.com", "first_name": "David", "last_name": "Wilson", "address": "Schaumburg, IL", "bio": "I cultivate various root vegetables, including carrots and potatoes."},
            {"email": "user7@example.com", "first_name": "Richard", "last_name": "Moore", "address": "Elgin, IL", "bio": "I grow and sell aromatic flowers like lavender and jasmine."},
            {"email": "user8@example.com", "first_name": "Joseph", "last_name": "Taylor", "address": "Joliet, IL", "bio": "I produce high-quality honey from my bee farm."},
            {"email": "user9@example.com", "first_name": "Daniel", "last_name": "Anderson", "address": "Chicago, IL", "bio": "I grow hot peppers and make homemade spicy sauces."},
            {"email": "user10@example.com", "first_name": "Matthew", "last_name": "Thomas", "address": "Evanston, IL", "bio": "I cultivate mushrooms in an indoor setup."},
            {"email": "user11@example.com", "first_name": "Charles", "last_name": "Jackson", "address": "Oak Park, IL", "bio": "I grow melons and gourds in my backyard."},
            {"email": "user12@example.com", "first_name": "Steven", "last_name": "White", "address": "Naperville, IL", "bio": "I specialize in growing exotic fruits like dragon fruit and passionfruit."},
            {"email": "user13@example.com", "first_name": "Thomas", "last_name": "Harris", "address": "Aurora, IL", "bio": "I grow apples and pears and make fresh cider."},
            {"email": "user14@example.com", "first_name": "Christopher", "last_name": "Martin", "address": "Schaumburg, IL", "bio": "I grow cucumbers and pickling vegetables."},
            {"email": "user15@example.com", "first_name": "Anthony", "last_name": "Garcia", "address": "Elgin, IL", "bio": "I grow pumpkins and squashes for seasonal markets."},
            {"email": "user16@example.com", "first_name": "Mark", "last_name": "Martinez", "address": "Joliet, IL", "bio": "I grow fresh peas and green beans."},
            {"email": "user17@example.com", "first_name": "Paul", "last_name": "Roberts", "address": "Chicago, IL", "bio": "I cultivate ornamental plants for landscaping."},
            {"email": "user18@example.com", "first_name": "Andrew", "last_name": "Clark", "address": "Evanston, IL", "bio": "I grow fresh kale and spinach for local markets."},
            {"email": "user19@example.com", "first_name": "Joshua", "last_name": "Rodriguez", "address": "Oak Park, IL", "bio": "I grow strawberries and blueberries for baking."},
            {"email": "user20@example.com", "first_name": "Kevin", "last_name": "Lewis", "address": "Naperville, IL", "bio": "I raise goats and sell fresh goat milk and cheese."}
        ]

        post_images = [
            "blackberries.jpeg", "apples.jpg", "banana_peppers.jpeg", "cherries.jpeg",
            "cucumber.jpeg", "default_post_image.jpg", "Eggs.jpeg", "farm_eggs.jpeg",
            "Golden_Potatoes.jpeg", "honey.jpeg", "Jalapenos.jpeg", "russet_potatoes.jpeg", "okra.jpeg",
            "oranges.jpeg", "pecans.jpeg", "potatoes.jpeg", "pumpkin.jpeg",
            "romas.jpeg", "spaghetti_squash.jpeg", "strawberries.jpeg",
            "strawberry_jam.jpeg", "sweet_oranges.jpeg", "Tomatoes.jpeg", "watermelon.jpeg", "Cherry_Tomatoes.jpeg", "Sweet_potatoes.jpeg"
        ]

        def generate_post_data(image_name):
            title = image_name.split("/")[-1].split(".")[0].replace("_", " ").capitalize()
            price = random.randint(1, 10)  # Random price between 1 and 10
            post_title = f"{title} ${price}/lb"
            description = f"Freshly harvested {title.lower()} available for purchase."
            return post_title, description

        # Generate Users
        self.stdout.write("Creating users...")
        users_instances = []
        for user_data in users:
            user, created = User.objects.get_or_create(
                email=user_data["email"],
                defaults={
                    "first_name": user_data["first_name"],
                    "last_name": user_data["last_name"],
                    "address": user_data["address"],
                    "bio": user_data["bio"],
                }
            )
            if created:
                user.set_password("DjangoReact1!")
                user.save()
                self.stdout.write(f"Created user: {user.email}")
            else:
                self.stdout.write(f"User already exists: {user.email}")

            users_instances.append(user)

        # Generate Posts
        self.stdout.write("\nCreating posts for each user...")
        for user in users_instances:
            num_posts = random.randint(0, 5)
            for _ in range(num_posts):
                image = random.choice(post_images)
                post_title, description = generate_post_data(image)

                # Create the relative image path (without leading '/')
                image_path = os.path.join('post_images', image)

                # This assumes the image exists in the MEDIA_ROOT/post_images folder
                image_full_path = os.path.join(MEDIA_ROOT, image_path)

                if os.path.exists(image_full_path):
                    with open(image_full_path, 'rb') as img_file:
                        # Using default_storage.save instead of directly passing the file
                        image_name = os.path.basename(image_path)  # Extracts the file name
                        saved_path = default_storage.save(image_path, File(img_file))

                        UserPosts.objects.create(
                            user=user,
                            title=post_title,
                            description=description,
                            address=user.address,
                            image=saved_path,  # Save the file path in the database
                            is_available=True,
                            is_public=True
                        )
                else:
                    self.stdout.write(f"Image not found: {image}")

        # Generate Groups
        self.stdout.write("\nCreating groups...")
        groups = [
            {"name": "Urban Farmers of Chicago", "address": "Chicago, IL", "description": "We are a group of gardeners close to Chicago, IL, that like to trade with each other. Come meet us at the local farmers market on Sunday afternoons."},
            {"name": "Evanston Green Thumbs", "address": "Evanston, IL", "description": "We are a group of gardeners close to Evanston, IL, that like to trade with each other. Come meet us at the local farmers market on Sunday afternoons."},
            {"name": "Oak Park Plant Enthusiasts", "address": "Oak Park, IL", "description": "We are a group of gardeners close to Oak Park, IL, that like to trade with each other. Come meet us at the local farmers market on Sunday afternoons."},
            {"name": "Naperville Growers Exchange", "address": "Naperville, IL", "description": "We are a group of gardeners close to Naperville, IL, that like to trade with each other. Come meet us at the local farmers market on Sunday afternoons."},
            {"name": "Aurora Harvest Club", "address": "Aurora, IL", "description": "We are a group of gardeners close to Aurora, IL, that like to trade with each other. Come meet us at the local farmers market on Sunday afternoons."}
        ]

        # Use the first user from users_instances for the created_by field
        default_user = users_instances[0]

        for group_data in groups:
            group, created = Group.objects.get_or_create(
                name=group_data["name"],
                defaults={
                    "address": group_data["address"],
                    "description": group_data["description"],
                    "created_by": default_user,  # Assign the created_by field
                }
            )
            if created:
                self.stdout.write(f"Created group: {group.name}")

                # Assign admin role to the first 5 users
                for user in users_instances[:5]:
                    GroupMember.objects.create(group=group, user=user, role="admin")
