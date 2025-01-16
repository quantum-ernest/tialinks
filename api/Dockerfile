FROM python:3.11-alpine

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt \
    && rm -rf /root/.cache/pip

COPY . /app/

EXPOSE 8000

CMD ["sh", "api_starter.sh"]
