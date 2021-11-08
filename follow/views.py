from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from tatter.views import UserBaseListView

User = get_user_model()


class FollowBaseListView(UserBaseListView):
    template_name = 'follow/followlist.html'

    def get_user(self):
        username = self.kwargs['username'].lower()
        return get_object_or_404(User, username=username)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['profile_user'] = self.get_user()
        context['follow_mode'] = self.mode
        return context


class FollowingListView(FollowBaseListView):
    mode = 'following'

    def get_queryset(self):
        following_list = super().get_user().followee.values_list('follower__uuid')
        return User.objects.filter(uuid__in=following_list)


class FollowersListView(FollowBaseListView):
    mode = 'followers'

    def get_queryset(self):
        followed_list = super().get_user().follower.values_list('followee__uuid')
        return User.objects.filter(uuid__in=followed_list)
