# Generated by Django 3.2.7 on 2021-09-06 09:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tart', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tart',
            name='text',
            field=models.TextField(max_length=140, verbose_name='Tart内容'),
        ),
    ]
