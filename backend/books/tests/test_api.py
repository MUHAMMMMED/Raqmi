 
import pytest
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from books.models import Book

# نحدد أن هذه الاختبارات تحتاج قاعدة بيانات
@pytest.mark.django_db
class TestBookAPI:
    """
    مجموعة اختبارات لاختبارات API الخاصة بالـ Book.
    كل اختبار هنا يتعامل مع Book API endpoint فقط:
    - إنشاء كتاب (POST)
    - جلب الكتب (GET)
    - تعديل كتاب (PATCH)
    - حذف كتاب (DELETE)
    """
 
 
    def test_create_book(self, api_client, subject):
      data = {
        "subject": subject.id,
        "title": "كتاب التجارب",
        "description": "تجربة علمية شيقة",
        "pdf": SimpleUploadedFile(
            "test.pdf",
            b"dummy content",  # محتوى الملف
            content_type="application/pdf"
        )
      }
      url = "/api/books/books/"  # URL مرتبط بـ BookViewSet
      response = api_client.post(url, data)
      print(response.data)  # للتأكد من أي خطأ آخر
      assert response.status_code == status.HTTP_201_CREATED





    def test_get_books_list(self, api_client, book):
        """
        اختبار جلب قائمة الكتب عبر الـ API.
        1. نرسل GET request إلى endpoint.
        2. نتحقق من أن الاستجابة 200 OK.
        3. نتحقق من أن البيانات المعادة تطابق الكتب الموجودة في DB.
        """
        url = "/api/books/books/"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["title"] == book.title

    def test_update_book(self, api_client, book):
        """
        اختبار تعديل بيانات كتاب عبر الـ API.
        1. نرسل PATCH request مع بيانات جديدة.
        2. نتحقق من أن الاستجابة 200 OK.
        3. نتحقق من أن البيانات في قاعدة البيانات تم تعديلها فعليًا.
        """
        new_data = {"title": "كتاب العلوم المعدل"}
        url = f"/api/books/books/{book.id}/"
        response = api_client.patch(url, new_data)
        assert response.status_code == status.HTTP_200_OK
        book.refresh_from_db()
        assert book.title == "كتاب العلوم المعدل"

    def test_delete_book(self, api_client, book):
        """
        اختبار حذف كتاب عبر الـ API.
        1. نرسل DELETE request.
        2. نتحقق من أن الاستجابة 204 NO CONTENT.
        3. نتحقق من أن الكتاب تم حذفه من قاعدة البيانات.
        """
        url = f"/api/books/books/{book.id}/"
        response = api_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Book.objects.count() == 0





# •	ده ملف مخصص لاختبارات الـ Book API.
# 	•	أي حاجة فيه بتختبر الـ API endpoints للكتاب (/api/books/) زي:
# 	•	إنشاء كتاب (POST)
# 	•	جلب الكتب (GET)
# 	•	تعديل كتاب (PATCH)
# 	•	حذف كتاب (DELETE)
# 	•	باختصار: كل الاختبارات هنا بتيجي من خلال الـ API، يعني بنبعت request للـ view ونتأكد إن الرد صح والبيانات اتعدلت في الـ database.
# 	•	ده يعتبر اختبار للفيوز (View) بس مركز بس على Book API.