# Generated by Django 5.1.1 on 2024-09-30 04:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='area',
        ),
        migrations.RemoveField(
            model_name='project',
            name='company',
        ),
    ]
