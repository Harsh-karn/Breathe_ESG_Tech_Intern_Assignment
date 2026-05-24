# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Python backend and serve
FROM python:3.12-slim
WORKDIR /app

# Install sqlite3 for the prototype
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ /app/backend/

# Copy the built frontend from the builder stage
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

WORKDIR /app/backend
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD python manage.py migrate && python manage.py shell -c "from ingestion.models import Tenant; Tenant.objects.get_or_create(name='Acme Corp')" && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2
