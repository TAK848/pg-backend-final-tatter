import random
from string import ascii_letters, digits

from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


def make_random_tart_id(n=15):
    dat = ascii_letters + digits + '-_'
    print(ascii_letters)
    while True:
        made_id = ''.join([random.choice(dat) for i in range(n)])
        if not Tart.objects.filter(id=made_id).exists():
            return made_id


class Tart(models.Model):
    id = models.CharField(
        default=make_random_tart_id,
        primary_key=True,
        editable=False,
        max_length=15,
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
    )
    created_at = models.DateTimeField('作成日', auto_now_add=True)
    updated_at = models.DateTimeField('更新日', auto_now=True)
    was_edited = models.BooleanField('編集済', default=False)
