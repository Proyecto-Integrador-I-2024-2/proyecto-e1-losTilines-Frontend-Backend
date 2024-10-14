import django_filters
from app.models import Project, ProjectFreelancer
from django.db import connection

print(connection.queries)


class ProjectFilter(django_filters.FilterSet):
    #Proyectos de un WORKER
    worker = django_filters.NumberFilter(field_name='user_id')

    area = django_filters.NumberFilter(field_name='user_id__usercompany__area_id')

    freelancer = django_filters.NumberFilter(field_name='projectfreelancer__freelancer__user_id')
   

    class Meta:
        model = Project
        fields = ['worker']

#Filtrar los proyectos relacionados a un freelancer
class ProjectsFreelancerFilter(django_filters.FilterSet):
    #Proyectos de un freelancer
    freelancer = django_filters.NumberFilter(field_name='freelancer_id')

    class Meta:
        model = ProjectFreelancer
        fields = ['freelancer']
