from rest_framework.serializers import ModelSerializer, SerializerMethodField

from follow.models import Follow


class FollowSerializer(ModelSerializer):
    follower_count = SerializerMethodField('get_follower_count')

    class Meta:
        model = Follow

        fields = ['followee', 'follower', 'follower_count']
        read_only_fields = ['followee', 'follower_count']

    def get_follower_count(self, instance):
        return Follow.objects.filter(follower=instance.follower).count()
