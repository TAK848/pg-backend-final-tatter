from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer

User = get_user_model()


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['handle_name', 'display_username']
        extra_kwargs = {
            'handle_name': {
                'read_only': True,
            },
            'display_username': {
                'read_only': True,
            },
        }
