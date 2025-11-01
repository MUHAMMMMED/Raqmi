from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    """
    السماح بالقراءة للجميع، والتعديل فقط للمالك.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        return obj.owner == request.user
    

    