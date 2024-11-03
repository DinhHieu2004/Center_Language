from typing import Any
from django.http import HttpRequest
from django.http.response import HttpResponse, HttpResponseRedirect
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .models import Class, User, Student
from .serializers import ClassSerializer, TeacherSerializer, StudentSerializer
from rest_framework.permissions import AllowAny
from django.shortcuts import render, redirect
# from django.contrib.auth.mixins import LoginRequiredMixin
# from .permissions import IsAdmin, IsTeacher, IsAdminOrTeacher
from rest_framework.permissions import IsAuthenticated
from django.views.generic import TemplateView
# from django.contrib.auth import authenticate, login
from django.contrib import messages
# from django.contrib.auth.decorators import login_required

"""
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            # Kiểm tra vai trò và chuyển hướng sau khi đăng nhập
            if user.role == 'admin':
                return redirect('admin_home')  # Chuyển đến trang của admin
            elif user.role == 'teacher':
                return redirect('teacher_home')  # Chuyển đến trang của teacher
        else:
            messages.error(request, 'Tên đăng nhập hoặc mật khẩu không đúng.')
    return render(request, 'login.html')

# @login_required
def admin_home(request):
    # Trang admin cho các chức năng quản lý
    return render(request, 'Class.html')

# @login_required
def teacher_home(request):
    # Trang cho teacher chỉ để xem
    return render(request, 'teacher_home.html')"""

# Danh sách và tạo lớp học
class ClassListCreateAPIView(generics.ListCreateAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    # permission_classes = [AllowAny] 
    # Custom GET method (có thể không cần thiết nếu dùng mặc định)

    def get_permissions(self):
        # if self.request.method == "POST":
        #     return [IsAuthenticated(), IsAdmin()]
        return [AllowAny()]  # Tạm thời cho phép tất cả

    def get(self, request, *args, **kwargs):
        try:
            self.check_permissions(request)

            return self.list(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Custom POST method để tạo lớp học mới
    def post(self, request, *args, **kwargs):
        try:
            self.check_permissions(request)
            return self.create(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Xử lý khi tạo lớp học
    def perform_create(self, serializer):
        instance = serializer.save()  # Lưu instance vào database
        print(f"Created class: {instance}")  # In ra log hoặc làm gì đó sau khi tạo
        return instance

# Chi tiết, cập nhật và xóa lớp học
class ClassRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    # permission_classes = [AllowAny] 

    def get_permissions(self):
        # if self.request.method in ['PUT', 'PATCH', 'DELETE']:
        #     return [IsAuthenticated(), IsAdmin()]
        return [AllowAny()]  # Tạm thời cho phép tất cả

    # Custom GET method để lấy chi tiết lớp học
    def get(self, request, *args, **kwargs):
        try:
            self.check_permissions(request)
            return self.retrieve(request, *args, **kwargs)
        except Class.DoesNotExist:
            return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Custom PUT method để cập nhật lớp học
    def put(self, request, *args, **kwargs):
        try:
            self.check_permissions(request)
            return self.update(request, *args, **kwargs)
        except Class.DoesNotExist:
            return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Custom DELETE method để xóa lớp học
    def delete(self, request, *args, **kwargs):
        try:
            self.check_permissions(request)
            return self.destroy(request, *args, **kwargs)
        except Class.DoesNotExist:
            return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StudentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [AllowAny] 

    # Custom GET method (có thể không cần thiết nếu dùng mặc định)
    def get(self, request, *args, **kwargs):
        try:
            return self.list(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Custom POST method để tạo lớp học mới
    def post(self, request, *args, **kwargs):
        try:
            return self.create(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Xử lý khi tạo lớp học
    def perform_create(self, serializer):
        instance = serializer.save()  # Lưu instance vào database
        print(f"Created student: {instance}")  # In ra log hoặc làm gì đó sau khi tạo
        return instance

# Chi tiết, cập nhật và xóa lớp học
class StudentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [AllowAny] 

    # Custom GET method để lấy chi tiết lớp học
    def get(self, request, *args, **kwargs):
        try:
            return self.retrieve(request, *args, **kwargs)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Custom PUT method để cập nhật lớp học
    def put(self, request, *args, **kwargs):
        try:
            return self.update(request, *args, **kwargs)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Custom DELETE method để xóa lớp học
    def delete(self, request, *args, **kwargs):
        try:
            return self.destroy(request, *args, **kwargs)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class TeacherListCreateAPIView(generics.ListCreateAPIView):
    queryset = User.objects.filter(role='teacher')
    serializer_class = TeacherSerializer
    permission_classes = [AllowAny]  # Tạm thời cho phép tất cả

    # Custom GET method (lấy danh sách giáo viên)
    def get(self, request, *args, **kwargs):
        try:
            self.check_permissions(request)

            return self.list(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset(self):
        """
        Lọc chỉ lấy những người dùng có role là 'teacher'
        """
        return User.objects.filter(role='teacher')

    # Custom POST method để tạo giáo viên mới
    def post(self, request, *args, **kwargs):
        try:
            self.check_permissions(request)

            # Kiểm tra trùng lặp username
            if 'username' in request.data and User.objects.filter(username=request.data['username']).exists():
                return Response({"error": "Username đã được sử dụng"}, status=status.HTTP_400_BAD_REQUEST)

            # Kiểm tra trùng lặp email
            if 'email' in request.data and User.objects.filter(email=request.data['email']).exists():
                return Response({"error": "Email đã được sử dụng"}, status=status.HTTP_400_BAD_REQUEST)

            # Kiểm tra trùng lặp phone
            if 'phone' in request.data and User.objects.filter(phone=request.data['phone']).exists():
                return Response({"error": "Số điện thoại đã được sử dụng"}, status=status.HTTP_400_BAD_REQUEST)

            # Tạo mới giáo viên nếu không có lỗi trùng lặp
            serializer = TeacherSerializer(data=request.data)
            if serializer.is_valid():
                teacher = serializer.save()  # Lưu giáo viên mới
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            # Nếu dữ liệu không hợp lệ
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class TeacherRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.filter(role='teacher')
    serializer_class = TeacherSerializer
    # permission_classes = [AllowAny] 

    def get(self, request, *args, **kwargs):
        try:
            self.check_permissions(request)

            return self.retrieve(request, *args, **kwargs)
        except User.DoesNotExist:
            return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        try:
            self.check_permissions(request)

            return self.update(request, *args, **kwargs)
        except User.DoesNotExist:
            return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            self.check_permissions(request)

            return self.destroy(request, *args, **kwargs)
        except User.DoesNotExist:
            return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
