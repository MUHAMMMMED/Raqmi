# books/tests/test_services.py

 
import pytest
from books.utils.service import increment_counter, double_value, reset_value

@pytest.mark.django_db
class TestBookViewSetSurface:
    def test_increment_counter_function(self):
        """تجربة increment_counter"""
        assert increment_counter(0) == 1
        assert increment_counter(5) == 6
        assert increment_counter(None) == 1

    def test_double_value_function(self):
        """تجربة double_value"""
        assert double_value(2) == 4
        assert double_value(5) == 10
        assert double_value(None) == 2

    def test_reset_value_function(self):
        """تجربة reset_value"""
        assert reset_value(10) == 0
        assert reset_value(0) == 0