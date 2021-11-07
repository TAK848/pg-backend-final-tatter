from follow.models import Follow
from rest_framework.serializers import ModelSerializer, SerializerMethodField


class FollowSerializer(ModelSerializer):
    follower_count = SerializerMethodField('get_follower_count')

    class Meta:
        model = Follow

        fields = ['followee', 'follower', 'follower_count']
        read_only_fields = ['followee', 'follower_count']

    def get_follower_count(self, instance):
        # print(instance)
        print(Follow.objects.filter(follower=instance.follower).count())
        print(instance.follower)
        print('a')
        # # instance.

        # return Follow.objects.filter(follower=obj).count()
        return Follow.objects.filter(follower=instance.follower).count()
