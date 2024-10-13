import django_filters
from app.models import User, Area

class WorkerFilter(django_filters.FilterSet):
    company = django_filters.NumberFilter(field_name='usercompany__company__id')
    role = django_filters.CharFilter(field_name='userrole__role__name')
    area = django_filters.NumberFilter(field_name='user_id__usercompany__area_id') 

    class Meta:
        model = User
        fields = ['company', 'role', 'area']