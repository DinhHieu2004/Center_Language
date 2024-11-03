# forms.py
from django import forms
from .models import Class, Student

class ClassForm(forms.ModelForm):
    class Meta:
        model = Class
        fields = ['name', 'description', 'total_sessions', 'start_date', 'end_date', 'level']

class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ['name', 'email', 'phone']