# Generated by Django 3.2.8 on 2021-11-03 06:24

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('follow', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='follow',
            name='id',
        ),
        migrations.AddField(
            model_name='follow',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
