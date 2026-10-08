from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    """
    Allow anyone to READ (GET, HEAD, OPTIONS).
    Only staff/admin users can WRITE (POST, PUT, PATCH, DELETE).
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_staff


class IsAdmin(BasePermission):
    """Allow access only to admin/staff users."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff
