# Generated by Django 5.2 on 2025-04-06 02:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_listing_claimed_by_listing_status_userprofile'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userprofile',
            old_name='carbon_footprint',
            new_name='footprint',
        ),
        migrations.AddField(
            model_name='userprofile',
            name='rank',
            field=models.CharField(default='Newbie', max_length=100),
        ),
    ]
