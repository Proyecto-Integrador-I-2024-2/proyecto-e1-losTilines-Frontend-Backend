# Generated by Django 5.1.1 on 2024-09-23 04:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_alter_project_status_alter_projectskill_level_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='deliverable',
            name='milestone',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='app.milestone'),
            preserve_default=False,
        ),
    ]