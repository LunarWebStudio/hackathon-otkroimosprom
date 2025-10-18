# Запуск:

1. Хостим postgres

1. Хостим redis

1. Хостим s3 compatible storage (например minio)

1. Заполняем env в docker-compose.yml

VITE_SERVER_URL: домен бека публичный с протоколом
VITE_SERVER_URL_INTERNAL: домен бека внутренний (например в этом compose будет http://server:3000)
DATABASE_URL: postgresql://postgres:postgres@localhost:5432/postgres
REDIS_URL: redis://default:password@localhost:6379/0
S3_ACCESS_KEY: access_key s3
S3_BUCKET: s3 bucket
S3_ENDPOINT: s3 endpoint
S3_REGION: s3 region
S3_SECRET_KEY: s3 secret key
CORS_ORIGIN: домен фронта с протоколом
BETTER_AUTH_SECRET: ключ для jwt (любая строка)
BETTER_AUTH_URL: домен публичный с протоколом
MAIN_ADMIN_EMAIL: почта админа
MAIN_ADMIN_PASSWORD: пароль админа

3. Добавить файл .env в packages/database/.env
Туда вставить DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres" - данные от postgres заменить

4. установить https://bun.sh

1. в корне проекта написать bun install

2. затем написать bun run db:push

1. запустить compose через команду docker compose up

1. готово
