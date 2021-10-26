# Generated by Django 3.2.7 on 2021-09-06 09:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import tart.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Tart',
            fields=[
                ('id', models.CharField(default=tart.models.make_random_tart_id, editable=False, max_length=15, primary_key=True, serialize=False)),
                ('text', models.CharField(max_length=140, verbose_name='Tart内容')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='作成日')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新日')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='ユーザー')),
            ],
        ),
    ]