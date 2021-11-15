from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from follow.models import Follow
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from tart.models import Tart

from .serializers import TartSerializer

User = get_user_model()


class RetrieveTartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        tart = get_object_or_404(Tart, id=pk)
        if tart.user is None:
            return Response({'detail': 'ユーザーが存在しません。'}, status=status.HTTP_404_NOT_FOUND)
        if tart.was_deleted:
            return Response({'detail': 'このTartは，削除されました。'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TartSerializer(
            instance=tart,
            context={'request_user': request.user},
        )
        return Response(serializer.data, status.HTTP_200_OK)


def get_tartlist_query_set(request, request_mode):
    id_date__gt = request.query_params.get('id_date__gt')
    id_date__lt = request.query_params.get('id_date__lt')
    page_mode = request.query_params.get('mode')
    user_uuid = request.query_params.get('userUuid')
    tart_query_set = Tart.objects.exclude(user=None).exclude(
        was_deleted=True).order_by('-created_at')
    if user_uuid:
        user = get_object_or_404(User, uuid=user_uuid)
        if page_mode == 'profile':
            tart_query_set = tart_query_set.filter(user=user)
        elif page_mode == 'profile_likes':
            tart_query_set = tart_query_set.filter(like__user=user)
    elif user_uuid == '':
        raise User.DoesNotExist()
    if page_mode == 'home':
        following_user = Follow.objects.filter(
            followee=request.user).values_list('follower')
        tart_query_set = tart_query_set.filter(
            Q(user__in=following_user) | Q(user=request.user))
    if id_date__gt:
        base_tart = get_object_or_404(Tart, id=id_date__gt)
        tart_query_set = tart_query_set.filter(
            created_at__gt=base_tart.created_at)
    elif id_date__lt and request_mode == 'list':
        base_tart = get_object_or_404(Tart, id=id_date__lt)
        tart_query_set = tart_query_set.filter(
            created_at__lt=base_tart.created_at)
    return tart_query_set


class ListTartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        max_results = request.query_params.get('max_results')
        if max_results:
            try:
                max_results = int(max_results)
            except ValueError:
                return Response({'detail': '不正な入力形式です。'}, status.HTTP_400_BAD_REQUEST)
        else:
            max_results = 10
        tart_query_set = Tart.objects.exclude(user=None).exclude(
            was_deleted=True).order_by('-created_at')
        try:
            tart_query_set = get_tartlist_query_set(request, 'list')
        except User.DoesNotExist:
            return Response({'detail': 'このアカウントは存在しません。'}, status=status.HTTP_404_NOT_FOUND)
        tart_query_set = tart_query_set[:max_results]
        serializer = TartSerializer(
            instance=tart_query_set,
            many=True,
            context={'request_user': request.user},
        )
        return Response(serializer.data, status.HTTP_200_OK)


class CreateTartView(CreateAPIView):
    serializer_class = TartSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request_user'] = self.request.user
        return context

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UpdateTartView(APIView):
    serializer_class = TartSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk, *args, **kwargs):
        tart = get_object_or_404(Tart, id=pk)
        if(request.user == tart.user):
            serialier = TartSerializer(
                instance=tart,
                data=request.data,
                partial=True,
                context={'request_user': request.user},
            )
            serialier.is_valid(raise_exception=True)
            serialier.save()
            return Response(serialier.data, status.HTTP_200_OK)
        else:
            return Response({'detail': '作成した本人のみ編集できます'}, status=status.HTTP_403_FORBIDDEN)


class DeleteTartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, *args, **kwargs):
        tart = get_object_or_404(Tart, id=pk)
        if(request.user == tart.user):
            tart.text = 'deleted'
            tart.user = None
            tart.was_deleted = True
            tart.save()
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': '作成した本人のみ削除できます'}, status=status.HTTP_403_FORBIDDEN)


class CheckUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        tart_query_set = Tart.objects.exclude(user=None)
        try:
            tart_query_set = get_tartlist_query_set(request, 'check_update')
        except User.DoesNotExist:
            return Response({'detail': 'このアカウントは存在しません。'}, status=status.HTTP_404_NOT_FOUND)
        count = tart_query_set.count()
        return Response({'count': count}, status.HTTP_200_OK)
