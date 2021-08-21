from django.contrib import messages
from django.contrib.auth import get_user_model
from django.template.response import TemplateResponse
from django.views import View
from django.views.generic import TemplateView


class IndexView(TemplateView):
    template_name = 'tatter/index.html'

    def get_context_data(self):
        messages.success(self.request, 'トップページです！テストメッセージ！')


class UserProfileView(View):
    def get(self, request, username):
        users = get_user_model()
        context = {
            'search_username': username,
        }
        try:
            user = users.objects.get(username=username.lower())
            context['exist_user'] = True
            if user == request.user:
                context['is_me'] = True
            context['got_user'] = user
        except users.DoesNotExist:
            context['exist_user'] = False
        return TemplateResponse(request, 'tatter/user_profile.html', context)
