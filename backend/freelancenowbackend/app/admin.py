from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(UserRole)
admin.site.register(Notification)
admin.site.register(UserNotification)
admin.site.register(UserCompany)
admin.site.register(Company)
admin.site.register(Area)
admin.site.register(Freelancer)
admin.site.register(Status)
admin.site.register(FreelancerSkill)
admin.site.register(Experience)
admin.site.register(SkillType)
admin.site.register(Skill)
admin.site.register(Comment)
admin.site.register(Project)
admin.site.register(ProjectFreelancer)
admin.site.register(ProjectSkill)
admin.site.register(Milestone)
admin.site.register(Deliverable)
admin.site.register(Payment)