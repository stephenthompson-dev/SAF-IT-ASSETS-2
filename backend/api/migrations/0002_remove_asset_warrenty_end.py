# Generated by Django 5.1.1 on 2024-09-22 15:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='asset',
            name='warrenty_end',
        ),
    ]
