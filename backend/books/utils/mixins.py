 
# class DebugViewSetMixin:
#     """
#     Mixin that prints request data and serializer errors
#     for every create/update/delete operation.
#     """

#     def create(self, request, *args, **kwargs):
#         print("=" * 50)
#         print("[CREATE] Incoming raw data:", request.data)
#         response = super().create(request, *args, **kwargs)
#         if hasattr(response, 'data'):
#             print("[CREATE] Response data:", response.data)
#         print("=" * 50)
#         return response

#     def update(self, request, *args, **kwargs):
#         print("=" * 50)
#         print("[UPDATE] Incoming raw data:", request.data)
#         response = super().update(request, *args, **kwargs)
#         if hasattr(response, 'data'):
#             print("[UPDATE] Response data:", response.data)
#         print("=" * 50)
#         return response

#     def perform_create(self, serializer):
#         instance = serializer.save()
#         print("[PERFORM CREATE] Created instance:", instance)
#         return instance

#     def perform_update(self, serializer):
#         instance = serializer.save()
#         print("[PERFORM UPDATE] Updated instance:", instance)
#         return instance

#     def perform_destroy(self, instance):
#         print("[DELETE] Instance to delete:", instance)
#         super().perform_destroy(instance)
#         print("[DELETE] Successfully deleted")


class DebugViewSetMixin:
    """
    Mixin that prints request data and serializer errors
    for every create/update/delete operation.
    """

    def create(self, request, *args, **kwargs):
        print("=" * 50)
        print("[CREATE] Incoming raw data:", request.data)
        try:
            response = super().create(request, *args, **kwargs)
        except Exception as e:
            print("[CREATE] Exception:", str(e))
            raise
        if hasattr(response, 'data'):
            print("[CREATE] Response data:", response.data)
            if getattr(response, 'status_code', None) and response.status_code >= 400:
                print("[CREATE] Errors:", getattr(response, 'data', None))
        print("=" * 50)
        return response

    def update(self, request, *args, **kwargs):
        print("=" * 50)
        print("[UPDATE] Incoming raw data:", request.data)
        try:
            response = super().update(request, *args, **kwargs)
        except Exception as e:
            print("[UPDATE] Exception:", str(e))
            raise
        if hasattr(response, 'data'):
            print("[UPDATE] Response data:", response.data)
            if getattr(response, 'status_code', None) and response.status_code >= 400:
                print("[UPDATE] Errors:", getattr(response, 'data', None))
        print("=" * 50)
        return response

    def perform_create(self, serializer):
        try:
            instance = serializer.save()
        except Exception as e:
            print("[PERFORM CREATE] Serializer errors:", serializer.errors)
            raise
        print("[PERFORM CREATE] Created instance:", instance)
        return instance

    def perform_update(self, serializer):
        try:
            instance = serializer.save()
        except Exception as e:
            print("[PERFORM UPDATE] Serializer errors:", serializer.errors)
            raise
        print("[PERFORM UPDATE] Updated instance:", instance)
        return instance

    def perform_destroy(self, instance):
        print("[DELETE] Instance to delete:", instance)
        super().perform_destroy(instance)
        print("[DELETE] Successfully deleted")