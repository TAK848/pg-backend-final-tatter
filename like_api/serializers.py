from like.models import Like
from rest_framework.serializers import ModelSerializer, SerializerMethodField


class LikeSerializer(ModelSerializer):
    tart_like_count = SerializerMethodField()

    class Meta:
        model = Like

        fields = ['tart', 'user', 'tart_like_count']
        read_only_fields = ['tart', 'user', 'tart_like_count']

    def get_tart_like_count(self, instance):
        return Like.objects.filter(tart=instance.tart).count()
