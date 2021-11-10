from accounts.serializers import UserSerializer
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from tart.models import Tart


class TartSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    like_count = SerializerMethodField('get_like_count')
    liked = SerializerMethodField('get_liked')

    class Meta:
        model = Tart

        fields = [
            'user',
            'text',
            'id',
            'was_edited',
            'created_at',
            'like_count',
            'liked',
        ]

    def update(self, instance, validated_data):
        instance.was_edited = True
        return super().update(instance, validated_data)

    def get_like_count(self, instance):
        return instance.like_set.count()

    def get_liked(self, instance):
        request_user = self.context['request_user']
        return instance.like_set.filter(user=request_user).exists()
