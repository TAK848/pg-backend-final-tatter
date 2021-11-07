from django.shortcuts import get_object_or_404
from follow.models import Follow
from follow.serializers import FollowSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class CreateFollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        follower_uuid = request.data['follower']
        if str(request.user.uuid) == follower_uuid:
            return Response({'detail': '自分自身をフォローすることはできません。'}, status.HTTP_400_BAD_REQUEST)
        if Follow.objects.filter(followee=request.user.uuid, follower__uuid=follower_uuid).exists():
            return Response({'detail': '既にフォロー済みです。'}, status=status.HTTP_409_CONFLICT)
        serializer = FollowSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(followee=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DestroyFollowView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, follower_uuid, *args, **kwargs):
        follow = get_object_or_404(
            Follow, followee=request.user, follower__uuid=follower_uuid)
        follow.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
