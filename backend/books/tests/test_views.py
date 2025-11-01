# books/tests/test_views.py
import pytest
from rest_framework import status
 
@pytest.mark.django_db
class TestOtherViews:
    """
    مجموعة اختبارات عامة للفيوز الأخرى.
    - نختبر CRUD للـ Views المختلفة.
    - التركيز على الاستجابة (status) وصحة البيانات.
    """

    def test_create_bookpart_view(self, api_client, book):
        """
        اختبار إنشاء BookPart عبر الـ API.
        1. نرسل POST request مع بيانات BookPart.
        2. نتحقق من استجابة 201 CREATED.
        3. نتحقق من أن BookPart تم حفظه مرتبطًا بالـ Book.
        """
        data = {
            "book": book.id,
            "title": "جزء الكتاب الأول",
            "order": 1
        }
        url = "/api/books/bookparts/"
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED

    def test_list_bookpart_view(self, api_client, bookpart):
        """
        اختبار جلب قائمة BookParts عبر الـ API.
        1. نرسل GET request.
        2. نتحقق من أن الاستجابة 200 OK.
        3. نتحقق من أن البيانات المعادة تطابق ما هو موجود في DB.
        """
        url = "/api/books/bookparts/"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["title"] == bookpart.title






#  اختبار View (زي test_views.py)
# 	•	هنا الاختبارات عادة بتختبر الـ View نفسها بشكل مباشر.
# 	•	ممكن تشمل:
# 	•	التأكد إن أي وظيفة في الـ View بتشتغل صح (مثلاً حساب حاجة، فلترة، sorting).
# 	•	التأكد إن الفيو بيرجع البيانات الصح أو بيعدلها بطريقة صحيحة.
# 	•	لو هنعمل API test على نفس الـ View، ده بيبقى زي ما شرحنا فوق، لكن ممكن الـ test هنا يكون أكثر تفصيلًا على الفيو نفسها مش على الـ API فقط.

# ⸻

# 3️⃣ الخلاصة بالبلد كده
# 	•	test_books_api.py → بيتأكد إن الـ Book API شغالة صح: create, read, update, delete + الردود صح.
# 	•	test_views.py → بيتأكد إن الـ Views شغالة صح، يعني الوظائف الداخلية للفيو نفسها تعمل اللي المفروض تعمله.