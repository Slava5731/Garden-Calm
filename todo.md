# Garden Calm - Чек-лист прогресса

## Фаза 1: Базовая инфраструктура ⬜
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
- [ ] Настройка TypeScript для всех пакетов

## Фаза 2: Основные компоненты ⬜
- [x] Edge API gateway
- [ ] Redis интеграция
- [ ] RabbitMQ настройка
- [x] Базовый UI чата
  - [x] ChatHeader (логотип + статус AI)
  - [x] MessageList (список сообщений с анимацией)
  - [x] ChatInput (поле ввода с кнопкой отправки)
  - [x] EmotionIndicator (визуализация текущей эмоции)

## Фаза 3: AI и анализ эмоций ⬜
- [ ] Emotion analyzer worker
- [ ] Prompt builder
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

## Текущий этап: 2.1 - Next.js приложение с чатом ✅
## Следующий этап: 3.1 - Пакет типов
