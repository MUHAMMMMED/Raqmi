 
def calculate_order_total(order):
    total = sum(item.price * item.quantity for item in order.items)
    return total

def apply_discount(order, discount):
    order.total -= discount
    return order

 

# books/utils/service.py

def increment_counter(value):
    """تزيد القيمة بواحد"""
    if value is None:
        value = 0
    return value + 1


def double_value(value):
    """تضاعف القيمة"""
    if value is None:
        value = 1
    return value * 2


def reset_value(value):
    """تصفير القيمة"""
    return 0