"""
المسؤول عن توليد صورة الشريحة وتحديد layout النصوص.
"""

from PIL import Image, ImageDraw, ImageFont
import uuid

def generate_slide_design(slide_data):
    """
    - يولد صورة بخلفية ملونة.
    - يضع النصوص بطريقة منظمة.
    - يرجع layout_data + مسار الصورة الناتجة.
    """
    img = Image.new("RGB", (1920, 1080), color=(240, 240, 240))
    draw = ImageDraw.Draw(img)

    # تنسيق النصوص
    font_title = ImageFont.truetype("arial.ttf", 80)
    font_body = ImageFont.truetype("arial.ttf", 40)

    draw.text((100, 100), slide_data["title"], fill=(0, 0, 0), font=font_title)
    draw.text((100, 250), slide_data["body"], fill=(50, 50, 50), font=font_body)

    image_path = f"media/slides/images/{uuid.uuid4()}.jpg"
    img.save(image_path)

    layout_data = {
        "background_color": "#f0f0f0",
        "title_position": (100, 100),
        "body_position": (100, 250),
    }

    return layout_data, image_path