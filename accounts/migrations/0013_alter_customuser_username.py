# Generated by Django 3.2.6 on 2021-08-16 06:09

import django.core.validators
from django.db import migrations, models
import re


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_auto_20210816_1508'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='username',
            field=models.CharField(default='n66ur0g3r840', error_messages={'unique': '既に登録されたユーザーIDです。'}, help_text='必須。20文字以内の半角英数字と，アンダースコア（_）のみ。', max_length=20, unique=True, validators=[django.core.validators.RegexValidator(flags=re.RegexFlag['ASCII'], regex='^[\\w]+\\Z')]),
        ),
    ]
