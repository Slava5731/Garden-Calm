# Garden Calm - Чек-лист прогресса

## Фаза 1: Базовая инфраструктура ✅
- [x] Инициализация монорепо
  - [x] Создан файл package.json с pnpm workspaces
  - [x] Создан файл pnpm-workspace.yaml
  - [x] Создан файл turbo.json для монорепо
  - [x] Создан базовый tsconfig.json
  - [x] Создан .gitignore
  - [x] Создан .npmrc
  - [x] Созданы .eslintrc.js + prettier.config.js
  - [x] Создан commitlint.config.js
- [x] Создание структуры пакетов
  - [x] Создана директория apps/web (Next.js 15)
  - [x] Созданы директории packages/ (@gc/types, @gc/domain, @gc/lib-redis, @gc/lib-rabbit, @gc/ui)
  - [x] Созданы директории services/ (emotion-worker, prompt-worker)
  - [x] Созданы директории infra/pulumi, docs/, tests/, scripts/
- [x] Настройка Next.js приложения
  - [x] Настроен Tailwind CSS с успокаивающей цветовой схемой
  - [x] Создана страница /chat с компонентами
  - [x] Реализован Edge Route /api/chat
  - [x] Добавлена стилизация с мягкими тенями и анимациями
- [x] Настройка TypeScript для всех пакетов
  - [x] Создан пакет @gc/types с основными типами

## Фаза 2: Основные компоненты ⬜
- [x] Edge API gateway
- [x] Redis интеграция
- [x] RabbitMQ настройка
- [x] Базовый UI чата
  - [x] ChatHeader (логотип + статус AI)
  - [x] MessageList (список сообщений с анимацией)
  - [x] ChatInput (поле ввода с кнопкой отправки)
  - [x] EmotionIndicator (визуализация текущей эмоции)

## Фаза 3: AI и анализ эмоций ⬜
- [x] Типы для анализа эмоций
  - [x] emotion.types.ts
  - [x] snapshot.types.ts
  - [x] message.types.ts
  - [x] meditation.types.ts
- [x] Доменная логика
  - [x] EmotionAnalyzer - анализ эмоций в сообщениях
  - [x] MeditationRecommender - рекомендации медитаций
  - [x] EmotionSnapshotManager - управление снапшотами
  - [x] Unit-тесты для всех сервисов
- [x] Emotion analyzer worker
  - [x] Структура воркера
  - [x] Интеграция с RabbitMQ
  - [x] Интеграция с Redis
  - [x] Подключение бизнес-логики из @gc/domain
  - [x] Тесты и моки
  - [x] Интеграция с web-приложением
- [x] Prompt builder
  - [x] Структура воркера
  - [x] Сервис генерации промптов
  - [x] Базовые шаблоны для разных эмоциональных состояний
  - [ ] Интеграция с RabbitMQ и Redis (TODO)
  - [ ] Тесты и моки (TODO)
- [ ] Интеграция с AI (mock)
- [ ] Система снапшотов

## Фаза 4: Медитации и рекомендации ⬜
- [ ] База медитаций
- [ ] Алгоритм рекомендаций
- [ ] UI для медитаций
- [ ] Система треккинга прогресса

## Фаза 5: Полировка и деплой ⬜
- [ ] Оптимизация производительности
- [ ] Адаптивный дизайн
- [ ] CI/CD pipeline
- [ ] Документация

## Текущий этап: 3.4 - Prompt builder ✅
## Следующий этап: 3.5 - Интеграция с AI (mock)
