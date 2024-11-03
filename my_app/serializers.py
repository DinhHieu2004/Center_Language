# serializers.py
from rest_framework import serializers
from .models import Class, User, Student

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name', 'description', 'total_sessions', 'start_date', 'end_date', 'level']
    def create(self, validated_data):
      return Class.objects.create(**validated_data)

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'password', 'full_name', 'email', 'phone', 'role']
    def validate(self, data):
        # Kiểm tra thêm nếu cần
        return data
    
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'full_name', 'email', 'phone']  # Sửa lại 'name' thành 'full_name'
    
    def create(self, validated_data):
        return Student.objects.create(**validated_data)    