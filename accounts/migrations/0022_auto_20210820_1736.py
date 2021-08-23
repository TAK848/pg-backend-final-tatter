# Generated by Django 3.2.6 on 2021-08-20 08:36

import django.core.validators
from django.db import migrations, models
import re


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0021_auto_20210820_1710'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='is_initial_username',
            field=models.BooleanField(default=False, verbose_name='初期ユーザー名'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='email',
            field=models.EmailField(max_length=254, unique=True, verbose_name='メールアドレス'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='username',
            field=models.CharField(error_messages={'max_length': '20文字以内で入力してください。', 'unique': '既に登録されたユーザーIDです。'}, help_text='20文字以内の半角英数字と，アンダースコア（_）のみ。', max_length=20, unique=True, validators=[django.core.validators.RegexValidator(flags=re.RegexFlag['ASCII'], message='半角英数字またはアンダースコア（_）のみで入力してください。', regex='^[a-z0-9_]+\\Z')], verbose_name='内部ユーザー名'),
        ),
    ]