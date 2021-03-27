# Сервис сокращения ссылок

## Установка
Клонируем проект:  
`git clone https://github.com/yapalenov/link_shortener`

Переходим в папку с проектом:  
`cd link_shortener`

Создаем рабочие файлы с переменными окружения:  
`cp .env.example .env && cp _docker/.env.example _docker/.env`

Устанавливаем зависимости:  
`yarn install`

## Запуск в `dev` режиме

Поднимаем контейнеры с базами:  
`docker-compose -f _docker/docker-compose.storages.yml up -d`

Выполняем миграции:  
`yarn run typeorm migration:run`

Запускаем приложение:  
`yarn run start:dev`

## Запуск в `stage` режиме

Поднимаем контейнеры:  
`docker-compose -f _docker/docker-compose.yml up -d`

## Тесты

Запуск `unit` тестов:  
`yarn run test`

Запуск `e2e` тестов ( предварительно поднять контейнеры с базами ):  
`yarn run test:e2e` 

