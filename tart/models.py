import random
from string import ascii_letters, digits

from django.contrib.auth import get_user_model
from django.db import models

from .validators import linebreak_limit_tart

User = get_user_model()
MAX_TART_ID_LENGTH = 15


def make_random_tart_id(n=MAX_TART_ID_LENGTH):
    dat = ascii_letters + digits + '-_'
    while True:
        made_id = ''.join([random.choice(dat) for i in range(n)])
        if not Tart.objects.filter(id=made_id).exists():
            return made_id


class Tart(models.Model):
    id = models.CharField(
        default=make_random_tart_id,
        primary_key=True,
        editable=False,
        max_length=MAX_TART_ID_LENGTH,
    )
    user = models.ForeignKey(
        User,
        verbose_name='ユーザー',
        on_delete=models.SET_NULL,
        null=True,
    )
    text = models.TextField(
        'Tart内容',
        max_length=140,
        validators=[
            linebreak_limit_tart,
        ]
    )
    created_at = models.DateTimeField('作成日時', auto_now_add=True)
    updated_at = models.DateTimeField('更新日時', auto_now=True)
    was_edited = models.BooleanField('編集済', default=False)
    was_deleted = models.BooleanField('削除済', default=False)
