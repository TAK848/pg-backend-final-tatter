import uuid

from django.contrib.auth import get_user_model
from django.db import models
from tart.models import Tart

User = get_user_model()


class Like(models.Model):
    uuid = models.UUIDField(
        default=uuid.uuid4,
        primary_key=True,
        editable=False,
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    tart = models.ForeignKey(
        Tart,
        on_delete=models.CASCADE,
    )
    liked_at = models.DateTimeField('いいね日時', auto_now_add=True)

    class Meta:
        models.UniqueConstraint(
            fields=['user', 'tart'],
            name="user_tart_unique",
        )
