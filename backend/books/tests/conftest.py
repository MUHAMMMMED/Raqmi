# conftest.py
import pytest
from rest_framework.test import APIClient
from categories.models import Stage, Grade, Program, Subject
from books.models import Book, BookPart

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def stage(db):
    return Stage.objects.create(name="المرحلة الإعدادية")

@pytest.fixture
def grade(stage):
    return Grade.objects.create(stage=stage, name="الصف الأول الإعدادي")

@pytest.fixture
def program(grade):
    return Program.objects.create(grade=grade, name="البرنامج العلمي") 

@pytest.fixture
def subject(program):
    return Subject.objects.create(program=program, name="العلوم") 

@pytest.fixture
def book(subject):
    return Book.objects.create(
        subject=subject,
        title="كتاب العلوم",
        description="كتاب تعليمي للعلوم"
    )
 

@pytest.fixture
def bookpart(book):
    return BookPart.objects.create(
        book=book,
        title="جزء الكتاب الأول",
        order=1
    )