from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role =='admin'

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'teacher'
    

class IsAdminOrTeacher(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'teacher']   
        
