from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

"""
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
    ]
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)


    # Add related_name to resolve conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name='custom_user_set',
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_set',
        related_query_name='custom_user',

    class Meta:
        db_table = 'USER'
    )
"""

class User(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
    ]

    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='teacher')

    '''is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)'''


    def __str__(self):
        return self.username

    class Meta:
        db_table = 'USER'


class Class(models.Model):
    LEVEL_CHOICES = [
        ('A1', 'A1'),
        ('A2', 'A2'),
        ('B1', 'B1'),
        ('B2', 'B2'),
        ('C1', 'C1'),
        ('C2', 'C2'),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    total_sessions = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    level = models.CharField(max_length=2, choices=LEVEL_CHOICES)

    def __str__(self):
        return self.name
    class Meta:
        db_table = 'CLASS'

        
class Student(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.full_name
    class Meta:
        db_table = 'STUDENT'

        
class Enrollment(models.Model):
    student = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE,
        db_column='student_id'  # Chỉ định tên cột trong database
    )
    class_enrolled = models.ForeignKey(
        Class, 
        on_delete=models.CASCADE,
        db_column='class_id'    # Chỉ định tên cột trong database
    )
    enrollment_date = models.DateField()

    def __str__(self):
        return f"{self.student.full_name} enrolled in {self.class_enrolled.name}"

    class Meta:
        db_table = 'ENROLLMENT'
class Attendance(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE)
    session_number = models.IntegerField()
    attendance_date = models.DateField()
    is_present = models.BooleanField()

    def __str__(self):
        return f"Attendance for {self.enrollment.student.full_name} - Session {self.session_number}"

    class Meta:
        db_table = 'ATTENDANCE'
    #class Meta:
    #unique_together = ['enrollment', 'session_number']