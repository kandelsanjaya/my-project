from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Creates or updates superuser skandel with password kandel@123'

    def handle(self, *args, **options):
        User = get_user_model()
        username = 'skandel'
        password = 'kandel@123'
        email = 'kandelsanjaya7@gmail.com'

        user, created = User.objects.get_or_create(username=username, defaults={'email': email})
        user.email = email
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f'Successfully created superuser "{username}" with password.'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Successfully updated superuser "{username}" password and permissions.'))
