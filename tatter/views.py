from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.template.response import TemplateResponse
from django.views import View
from django.views.generic import ListView, TemplateView
from follow.models import Follow
from tart.models import Tart

User = get_user_model()


class IndexView(TemplateView):
    template_name = 'tatter/index.html'


class GlobalView(LoginRequiredMixin, TemplateView):
    template_name = 'tatter/global.html'


class UserProfileView(LoginRequiredMixin, View):
    def get(self, request, username):
        context = {
            'search_username': username,
            'is_me': False,
            'profile_user': None,
        }
        try:
            user = User.objects.get(username=username.lower())
            context['exist_user'] = True
        except User.DoesNotExist:
            context['exist_user'] = False
            return TemplateResponse(request, 'tatter/user_profile.html', context)

        if user == request.user:
            context['is_me'] = True
        context['profile_user'] = user
        context['tart_count'] = Tart.objects.filter(user=user).count()
        context['following'] = Follow.objects.filter(
            followee=request.user, follower=user).exists()
        context['followed'] = Follow.objects.filter(
            follower=request.user, followee=user).exists()
        return TemplateResponse(request, 'tatter/user_profile.html', context)


class UserBaseListView(LoginRequiredMixin, ListView):
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['following_list'] = self.request.user.followee.values_list(
            'follower__uuid', flat=True)
        context['followed_list'] = self.request.user.follower.values_list(
            'followee__uuid', flat=True)
        return context


class UserListView(UserBaseListView):
    template_name = 'tatter/user_list.html'
    model = User
