# Generated by Django 3.2.7 on 2021-09-06 09:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tart', '0003_alter_tart_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='tart',
            name='is_edited',
            field=models.BooleanField(default=False, verbose_name='編集済'),
        ),
    ]