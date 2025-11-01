# class DebugViewSetMixin:
#     """
#     Mixin that prints request data, results, and serializer errors
#     for every create/update/delete operation in a clear way.
#     """

#     def perform_create(self, serializer):
#         print("="*50)
#         print("[CREATE] Incoming data:")
#         print(self.request.data)
#         try:
#             instance = serializer.save()
#             print("[CREATE] Successfully created instance:", instance)
#         except Exception as e:
#             print("[CREATE] Error during creation:", e)
#             if serializer.errors:
#                 print("Serializer Errors:", serializer.errors)
#             raise
#         print("="*50)
#         return instance

#     def perform_update(self, serializer):
#         print("="*50)
#         print("[UPDATE] Incoming data:")
#         print(self.request.data)
#         try:
#             instance = serializer.save()
#             print("[UPDATE] Successfully updated instance:", instance)
#         except Exception as e:
#             print("[UPDATE] Error during update:", e)
#             if serializer.errors:
#                 print("Serializer Errors:", serializer.errors)
#             raise
#         print("="*50)
#         return instance

#     def perform_destroy(self, instance):
#         print("="*50)
#         print("[DELETE] Instance to delete:", instance)
#         try:
#             result = super().perform_destroy(instance)
#             print("[DELETE] Successfully deleted")
#         except Exception as e:
#             print("[DELETE] Error during deletion:", e)
#             raise
#         print("="*50)
#         return result


class DebugViewSetMixin:
    """
    Mixin that prints request data and serializer errors
    for every create/update/delete operation.
    """

    def create(self, request, *args, **kwargs):
        print("=" * 50)
        print("[CREATE] Incoming raw data:", request.data)
        response = super().create(request, *args, **kwargs)
        if hasattr(response, 'data'):
            print("[CREATE] Response data:", response.data)
        print("=" * 50)
        return response

    def update(self, request, *args, **kwargs):
        print("=" * 50)
        print("[UPDATE] Incoming raw data:", request.data)
        response = super().update(request, *args, **kwargs)
        if hasattr(response, 'data'):
            print("[UPDATE] Response data:", response.data)
        print("=" * 50)
        return response

    def perform_create(self, serializer):
        instance = serializer.save()
        print("[PERFORM CREATE] Created instance:", instance)
        return instance

    def perform_update(self, serializer):
        instance = serializer.save()
        print("[PERFORM UPDATE] Updated instance:", instance)
        return instance

    def perform_destroy(self, instance):
        print("[DELETE] Instance to delete:", instance)
        super().perform_destroy(instance)
        print("[DELETE] Successfully deleted")