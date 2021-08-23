import random
import re
import uuid
from string import ascii_letters, digits

from django.contrib.auth import get_user_model
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone

from .validate import linebreak_limit_biography

User = get_user_model()


class UserManager(BaseUserManager):

    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(
            email=self.normalize_email(email),
        )
        user.set_random_username()
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(
            email,
            password=password,
        )
        user.is_staff = True
        user.is_superuser = True
        user.tart_is_private = True
        user.account_is_hidden = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    class Meta:
        verbose_name_plural = 'ユーザー'

    uuid = models.UUIDField(
        default=uuid.uuid4,
        primary_key=True,
        editable=False
    )
    email = models.EmailField('メールアドレス', unique=True)

    username = models.CharField(
        '内部ユーザー名',
        max_length=20,
        unique=True,
        help_text='20文字以内の半角英数字と，アンダースコア（_）のみ。',
        validators=[
            RegexValidator(
                regex=r'^[a-z0-9_]+\Z',
                flags=re.ASCII,
                message='半角英語小文字・数字またはアンダースコア（_）のみで入力してください。'
            ),
        ],
        error_messages={
            'unique': "既に登録されたユーザー名です。",
            'max_length': "20文字以内で入力してください。",
        },
    )
    display_username = models.CharField(
        '表示ユーザー名',
        max_length=20,
        unique=True,
        help_text='入力した生のユーザーID（小文字変換なし）。',
        validators=[
            RegexValidator(
                regex=r'^[\w_]+\Z',
                flags=re.ASCII,
                message='半角英数字またはアンダースコア（_）のみで入力してください。'
            ),
        ],
        error_messages={
            'unique': "既に登録されたユーザー名です。",
            'max_length': "20文字以内で入力してください。",
        },
    )
    changed_initial_username = models.BooleanField(
        '初期ユーザー名から変更済',
        default=False,
    )

    handle_name = models.CharField(
        '表示名（ハンドルネーム）',
        max_length=50,
        help_text='公開される表示名。50文字以内。',
        default='匿名ユーザー',
    )
    biography = models.TextField(
        '自己紹介',
        blank=True,
        default='',
        max_length=250,
        validators=[
            linebreak_limit_biography,
        ]
    )

    tart_is_private = models.BooleanField('Tart非公開', default=False)
    account_is_hidden = models.BooleanField('プロフィール非公開', default=False)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField('登録日', default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return f'{self.handle_name}@{self.username}<{self.email}>'

    def set_random_username(self, n=12):
        dat = ascii_letters + digits + '_'
        while True:
            made_username = ''.join([random.choice(dat) for i in range(n)])
            try:
                if User.objects.get(username=made_username.lower()):
                    continue
            except User.DoesNotExist:
                self.username = made_username.lower()
                self.display_username = made_username
                return made_username

    def clean(self):
        super().clean()
        if not self.username == self.display_username.lower():
            if User.objects.filter(username=self.display_username.lower()):
                raise ValidationError('そのユーザー名は既に使用されています。')
            else:
                self.username = self.display_username.lower()

    def set_username(self, username):
        self.username = username.lower()
        self.display_username = username
        if not self.changed_initial_username:
            self.changed_initial_username = True
