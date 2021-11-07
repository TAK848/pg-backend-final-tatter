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
        context['got_user'] = self.get_user()
        context['follow_mode'] = self.mode
        return context


class FollowingListView(FollowBaseListView):
    mode = 'following'

    def get_queryset(self):
        return User.objects.filter(uuid__in=super().get_user().followee.values_list('follower__uuid'))


class FollowersListView(FollowBaseListView):
    mode = 'followers'

    def get_queryset(self):
        return User.objects.filter(uuid__in=super().get_user().follower.values_list('followee__uuid'))
