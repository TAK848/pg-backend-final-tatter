import uuid

from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Follow(models.Model):
    uuid = models.UUIDField(
        default=uuid.uuid4,
        primary_key=True,
        editable=False,
    )
    followee = models.ForeignKey(
        User,
        related_name='followee',
        on_delete=models.CASCADE,
    )
    follower = models.ForeignKey(
        User,
        related_name='follower',
        on_delete=models.CASCADE,
    )

    followed_at = models.DateTimeField('フォロー日時', auto_now_add=True)

    class Meta:
        models.UniqueConstraint(
            fields=['followee', 'follower'],
            name="followee_follower_unique",
        )

    def __str__(self):
        return f'@{self.followee.display_username} -> @{self.follower.display_username}'
