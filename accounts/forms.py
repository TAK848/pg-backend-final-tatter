import re

from allauth.account.forms import LoginForm, SignupForm
from django import forms
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


class CustomSignupForm(SignupForm):
    handle_name = forms.CharField(
        label='名前（表示名）',
        max_length=50,
    )
    agreement = forms.BooleanField(label='利用規約に同意')

    def clean_agreement(self):
        value = self.cleaned_data.get('agreement')
        if not value:
            forms.ValidationError('同意が必要です。')
        return value

    def clean_handle_name(self):
        value = self.cleaned_data.get('handle_name')
        if not value:
            forms.ValidationError('名前の入力が必要です。')
        return value


class CustomLoginForm(LoginForm):
    def clean_login(self):
        return super().clean_login().lstrip('@').strip()


class UpdateUserProfileForm(forms.ModelForm):
    password = forms.CharField(label='パスワード')
    uuid = forms.CharField()

    class Meta:
        model = User
        fields = (
            'handle_name',
            'display_username',
            'biography',
            'tart_is_private',
            'changed_initial_username',
        )

    def clean_display_username(self):
        cleaned_display_username = self.cleaned_data.get(
            'display_username').strip().lstrip('@').strip()
        if not re.fullmatch(r'^[\w]+\Z$', cleaned_display_username):
            raise ValidationError('半角英数字またはアンダースコア（_）のみで入力してください。')
        return cleaned_display_username

    def clean(self):
        uuid = self.cleaned_data.get('uuid')
        try:
            user = User.objects.get(uuid=uuid)
            if not user.check_password(self.cleaned_data.get('password')):
                raise ValidationError('パスワードが一致しませんでした。')
            display_username = self.cleaned_data.get('display_username')
            if display_username and not user.username == display_username.lower():
                self.cleaned_data['changed_initial_username'] = True
        except User.DoesNotExist:
            raise ValidationError('ユーザー情報を見つけられませんでした')
        return self.cleaned_data
