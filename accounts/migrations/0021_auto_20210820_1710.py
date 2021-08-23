# Generated by Django 3.2.6 on 2021-08-20 08:10

import django.core.validators
from django.db import migrations, models
import django.utils.timezone
import re


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0020_auto_20210820_1634'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='is_private',
        ),
        migrations.AddField(
            model_name='customuser',
            name='account_is_hidden',
            field=models.BooleanField(default=False, verbose_name='プロフィール非公開'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='date_joined',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='tart_is_private',
            field=models.BooleanField(default=False, verbose_name='Tart非公開'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='username',
            field=models.CharField(default='pm1dJ2s0AAIV', error_messages={'max_length': '20文字以内で入力してください。', 'unique': '既に登録されたユーザーIDです。'}, help_text='20文字以内の半角英数字と，アンダースコア（_）のみ。', max_length=20, unique=True, validators=[django.core.validators.RegexValidator(flags=re.RegexFlag['ASCII'], message='半角英数字またはアンダースコア（_）のみで入力してください。', regex='^[\\w]+\\Z')], verbose_name='内部ユーザー名'),
        ),
    ]