FROM python:3.11

WORKDIR /app
COPY ./../app /app
COPY ./../requirements.txt /app

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]