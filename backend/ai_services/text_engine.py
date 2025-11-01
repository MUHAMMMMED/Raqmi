"""
المسؤول عن تحليل النص وتحويله إلى شرائح.
يمكن استخدام OpenAI API أو أي نموذج محلي.
"""

import openai

def parse_lesson_into_slides(text):
    """
    تقسم النص إلى مجموعة من الشرائح {title, body}.
    """
    # طلب من GPT توليد الشرائح
    prompt = f"حلل النص التالي إلى شرائح تعليمية منظمة بعناوين ونصوص:\n\n{text}"
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
    )

    slides = extract_slides_from_response(response.choices[0].message["content"])
    return slides


def extract_slides_from_response(response_text):
    # تحليل النص الناتج إلى قائمة قوامها: [{"title": ..., "body": ...}, ...]
    slides = []
    for block in response_text.split("###"):
        if not block.strip():
            continue
        parts = block.strip().split("\n", 1)
        slides.append({
            "title": parts[0].strip(),
            "body": parts[1].strip() if len(parts) > 1 else ""
        })
    return slides