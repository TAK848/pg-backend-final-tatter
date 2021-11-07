from django.contrib.auth import get_user_model
from follow.models import Follow
from rest_framework.serializers import ModelSerializer, SerializerMethodField

User = get_user_model()


class UserSerializer(ModelSerializer):
    follower_count = SerializerMethodField('get_follower_count')

    class Meta:
        model = User
        fields = ('handle_name', 'display_username', 'uuid', 'follower_count')
        read_only_fields = (
            'handle_name', 'display_username', 'uuid', 'follower_count')

    def get_follower_count(self, obj):
        return Follow.objects.filter(follower=obj).count()
