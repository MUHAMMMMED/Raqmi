FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN apt-get update && apt-get install -y ffmpeg imagemagick
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENV PYTHONUNBUFFERED=1

CMD ["sh", "-c", "python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:8000"]