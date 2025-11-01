 
def test_book_relations(book):
    # تحقق من اسم الكتاب
    assert book.title == "كتاب العلوم"
    
    # تحقق من علاقة الكتاب بالـ Subject → Program → Grade → Stage
    assert book.subject.name == "العلوم"
    assert book.subject.program.name == "البرنامج العلمي"
    assert book.subject.program.grade.name == "الصف الأول الإعدادي"
    assert book.subject.program.grade.stage.name == "المرحلة الإعدادية"