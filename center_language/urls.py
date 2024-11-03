"""
URL configuration for center_language project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from my_app.views import ClassListCreateAPIView, ClassRetrieveUpdateDestroyAPIView, TeacherListCreateAPIView, TeacherRetrieveUpdateDestroyAPIView
#from my_app.views import AdminDashboardView, TeacherDashboardView, UserRedirectView, login_view, admin_home, teacher_home
from my_app.views import ClassListCreateAPIView, ClassRetrieveUpdateDestroyAPIView,StudentListCreateAPIView,StudentRetrieveUpdateDestroyAPIView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/classes/', ClassListCreateAPIView.as_view(), name='class-list-create'),
    path('api/classes/<int:pk>/', ClassRetrieveUpdateDestroyAPIView.as_view(), name='class_detail'),
    path('api/teachers/', TeacherListCreateAPIView.as_view(), name='teacher-list-create'),
    path('api/teachers/<int:pk>/', TeacherRetrieveUpdateDestroyAPIView.as_view(), name='teacher_detail'),
    #path('teacher/',teacher_home, name='teacher_home'),
    path('api/students/', StudentListCreateAPIView.as_view(), name='student-list-create'),
    path('api/students/<int:pk>/', StudentRetrieveUpdateDestroyAPIView.as_view(), name='student_detail'),
  
]
