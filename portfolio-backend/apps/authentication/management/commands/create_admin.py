"""
Management command to create the first CMS admin user.
Usage: python manage.py create_admin
"""

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create the initial CMS admin user'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, default='admin')
        parser.add_argument('--email', type=str, default='admin@portfolio.com')
        parser.add_argument('--password', type=str, default='Admin@123!')
        parser.add_argument('--first-name', type=str, default='Admin')
        parser.add_argument('--last-name', type=str, default='User')

    def handle(self, *args, **options):
        username = options['username']

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'User "{username}" already exists.'))
            return

        user = User.objects.create_superuser(
            username=username,
            email=options['email'],
            password=options['password'],
            first_name=options['first_name'],
            last_name=options['last_name'],
        )
        self.stdout.write(
            self.style.SUCCESS(
                f'Admin user "{user.username}" created successfully.\n'
                f'  Email: {user.email}\n'
                f'  Password: {options["password"]}\n'
                f'  ⚠️  Change the password after first login!'
            )
        )
