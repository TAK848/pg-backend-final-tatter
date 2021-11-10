from django.shortcuts import get_object_or_404
from like.models import Like
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from tart.models import Tart

from like_api.serializers import LikeSerializer


class CreateLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        tart_id = request.data['tart_id']
        if not tart_id:
            return Response({'detail': 'TartのIDが必須です。'}, status=status.HTTP_400_BAD_REQUEST)
        tart = get_object_or_404(Tart, id=tart_id)
        if Like.objects.filter(user=request.user, tart=tart).exists():
            return Response({'detail': '既にいいね済みです。'}, status=status.HTTP_409_CONFLICT)
        serializer = LikeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(tart=tart, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DestroyLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, tart_id, *args, **kwargs):
        tart = get_object_or_404(Tart, id=tart_id)
        like = get_object_or_404(Like, tart=tart, user=request.user)
        like.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
