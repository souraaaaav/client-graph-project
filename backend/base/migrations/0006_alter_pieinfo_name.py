# Generated by Django 4.0.5 on 2022-12-31 11:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_alter_pieinfo_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pieinfo',
            name='name',
            field=models.CharField(max_length=80),
        ),
    ]
