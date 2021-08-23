from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import UpdateView

from .forms import UserForm

User = get_user_model()


class MypageView(LoginRequiredMixin, UpdateView):
    template_name = 'account/mypage_edit.html'
    model = User
    form_class = UserForm
    success_url = reverse_lazy('accounts:mypage_edit')

    def get_object(self):
        return self.request.user

    def form_valid(self, form):
        messages.success(self.request, 'プロフィールを更新しました')
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "プロフィールの更新に失敗しました")
        return super().form_invalid(form)
