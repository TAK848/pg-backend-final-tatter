from django.contrib.auth import get_user_model
from django.template.response import TemplateResponse
from django.views import View
from django.views.generic import TemplateView
from tart.models import Tart

User = get_user_model()


class IndexView(TemplateView):
    template_name = 'tatter/index.html'


class UserProfileView(View):
    def get(self, request, username):
        context = {
            'search_username': username,
            'is_me': False,
            'got_user': None,
        }
        try:
            user = User.objects.get(username=username.lower())
            context['exist_user'] = True
        except User.DoesNotExist:
            context['exist_user'] = False
            return TemplateResponse(request, 'tatter/user_profile.html', context)

        if user == request.user:
            context['is_me'] = True
        context['got_user'] = user
        context['tart_count'] = Tart.objects.filter(user=user).count()
        return TemplateResponse(request, 'tatter/user_profile.html', context)
