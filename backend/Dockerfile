FROM python:3.12.0

RUN pip install --upgrade pip && pip install poetry

WORKDIR /app/src

COPY pyproject.toml poetry.lock /app

RUN poetry config virtualenvs.create false

RUN poetry install --no-root --no-dev

COPY . .

ENV PYTHONPATH=/app/src

CMD ["gunicorn", "-w", "1", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "src.main:app"]
