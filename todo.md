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
- [ ] Настройка Next.js приложения
- [ ] Настройка TypeScript для всех пакетов

## Фаза 2: Основные компоненты ⬜
- [ ] Edge API gateway
- [ ] Redis интеграция
- [ ] RabbitMQ настройка
- [ ] Базовый UI чата

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

## Текущий этап: 1.1 - Создание корневой структуры ✅
## Следующий этап: 2.1 - Next.js приложение с чатом
