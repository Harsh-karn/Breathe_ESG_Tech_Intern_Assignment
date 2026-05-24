FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ /app/backend/
COPY frontend/dist /app/frontend/dist

WORKDIR /app/backend
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD python manage.py migrate && python manage.py shell -c "from ingestion.models import Tenant; Tenant.objects.get_or_create(name='Acme Corp')" && gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2
