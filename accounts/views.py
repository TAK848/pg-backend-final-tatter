from allauth.account.views import LoginView, SignupView
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import UpdateView

from .forms import UserForm


class CustomSignupView(SignupView):
    def dispatch(self, request, *args, **kwargs):
        if (request.method == 'POST' and
                '/signup/' in request.get_full_path(True)):
            self.was_post = True
        else:
            self.was_post = False
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['was_post'] = self.was_post
        return context


class CustomLoginView(LoginView):
    def dispatch(self, request, *args, **kwargs):
        if (request.method == 'POST' and
                '/login/' in request.get_full_path(True)):
            self.was_post = True
        else:
            self.was_post = False
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['was_post'] = self.was_post
        return context


class MypageView(LoginRequiredMixin, UpdateView):
    template_name = 'account/mypage_edit.html'
    model = get_user_model()
    form_class = UserForm
    # fields = ('biography',)
    success_url = reverse_lazy('accounts:mypage_edit')

    def get_object(self):
        return self.request.user

    def form_valid(self, form):
        messages.success(self.request, 'プロフィールを更新しました')
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "プロフィールの更新に失敗しました")
        return super().form_invalid(form)

    # def post(self, request, *args, **kwargs):
    #     if request.user.check_password(request.POST.get('password')):
    #         return super().post(request, *args, **kwargs)
    #     else:
    #         raise ValidationError('パスワードが不一致')

    # def form_valid(self, form):
    #     # formのupdateメソッドにログインユーザーを渡して更新
    #     form.update(user=self.request.user)
    #     return super().form_valid(form)

    # def get_form_kwargs(self):
    #     kwargs = super().get_form_kwargs()
    #     # 更新前のユーザー情報をkwargsとして渡す
    #     # kwargs.update({
    #     #     'biography': self.request.user.biography,
    #     # })
    #     return kwargs
    # def get(self, request):
    #     context = {}
    #     return TemplateResponse(request, 'account/mypage.html', context)

    # def post(self, request):
    #     context = {}
    #     # if request.user.check_password(request.POST.get('password')):
    #     if True:
    #         # user = get_user_model().objects
    #         user = request.user
    #         user.biography = 'aasaa\n\n\n\n\n\na'
    #         if user.is_valid():
    #             user.save()
    #         # request.user.save()
    #         # form = ProfileForm(request.POST)
    #         # if form.is_valid():
    #         #     print('valid')
    #         #     user = form.save(commit=False)
    #         #     print('ok')
    #         #     user.save()
    #         #     print('save')
    #         #     messages.success(request, 'プロフィールを更新しました')
    #         #     # request.user.biography = 'unko'
    #         # else:

    #         #     messages.error(request, 'プロフィール更新失敗?')
    #     else:
    #         context['password_check'] = False
    #         messages.error(request, 'プロフィール更新失敗')

    #     return TemplateResponse(request, 'account/mypage.html', context)
