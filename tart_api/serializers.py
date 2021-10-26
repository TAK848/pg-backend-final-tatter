from accounts.serializers import UserSerializer
from rest_framework.serializers import ModelSerializer
from tart.models import Tart


class TartSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Tart

        fields = ['user', 'text', 'id', 'was_edited', 'created_at']
