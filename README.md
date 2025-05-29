Вот обновленный README:

```markdown
# Garden Calm 🌱

Приложение для медитаций с AI-анализом эмоций. Использует двухуровневую систему AI для мгновенных ответов и глубокого анализа эмоционального состояния.

## 🧠 Архитектура v2

### Механизм анализа эмоций
- **Claude Haiku 3.5** - моментальные ответы (< 100ms)
- **DeepSeek R1** - глубокий анализ эмоций в фоне
- **Система снапшотов** - накопление понимания о пользователе

### Как это работает
```
Пользователь → Edge API → Haiku (быстрый ответ)
                    ↓
              emotion-worker → DeepSeek R1 (анализ)
                    ↓
              Обновление снапшота → Умнее следующий ответ
```

## 🚀 Быстрый старт

### Требования
- Node.js 20+
- pnpm 8.x
- API ключи (см. `.env.example`)

### Установка и запуск
```bash
# Клонирование репозитория
git clone https://github.com/Slava5731/Garden-Calm.git
cd Garden-Calm

# Установка зависимостей
pnpm install

# Копирование примера окружения
cp .env.example .env.local

# Запуск в режиме разработки (с моками)
pnpm dev

# Запуск с реальными сервисами
ENABLE_REDIS=true ENABLE_RABBITMQ=true pnpm dev
```

### Переменные окружения
```env
# AI сервисы
ANTHROPIC_API_KEY=sk-ant-...    # Claude API для Haiku
DEEPSEEK_API_KEY=sk-...         # DeepSeek для анализа

# Инфраструктура (опционально)
REDIS_URL=redis://...           # Для продакшена
RABBITMQ_URL=amqp://...        # Для продакшена

# Режим работы
ENABLE_MOCKS=true              # Использовать моки вместо реальных сервисов
```

## 📋 Прогресс разработки

### ✅ Выполнено:
- [x] Инициализация монорепо
  - [x] package.json с pnpm workspaces
  - [x] pnpm-workspace.yaml
  - [x] turbo.json для монорепо
  - [x] tsconfig.json (базовый)
  - [x] .gitignore, .npmrc, .eslintrc.js, prettier.config.js, commitlint.config.js
- [x] Создание структуры пакетов
  - [x] Директории apps/web, packages/@gc/*, services/*, infra/pulumi, docs/, tests/, scripts/
- [x] Next.js приложение с чатом
  - [x] Tailwind CSS с успокаивающей цветовой схемой
  - [x] Страница /chat с компонентами (ChatHeader, MessageList, ChatInput, EmotionIndicator)
  - [x] Edge Route /api/chat с mock-ответами
  - [x] Стилизация с мягкими тенями и плавными анимациями
- [x] Пакет типов @gc/types
  - [x] Типы для эмоций, снапшотов, сообщений и медитаций
- [x] Пакет доменной логики @gc/domain
  - [x] EmotionAnalyzer, MeditationRecommender, EmotionSnapshotManager
  - [x] Unit-тесты для всех сервисов
- [x] Emotion analyzer worker
  - [x] Структура воркера и интеграция с RabbitMQ и Redis
  - [x] Подключение бизнес-логики из @gc/domain
  - [x] Тесты и моки для всех сервисов
- [x] Prompt builder
  - [x] Структура воркера
  - [x] Сервис генерации промптов на основе эмоционального состояния
  - [x] Базовые шаблоны для разных эмоциональных состояний

### 🚧 В процессе:
- [ ] Интеграция с Claude API (Haiku 3.5)
- [ ] Интеграция с DeepSeek API (R1)
- [ ] Реализация двухуровневого механизма ответов
- [ ] Система снапшотов с накоплением знаний

### ⏭️ Следующие шаги:
- [ ] Claude-proxy для управления AI моделями
- [ ] Полная интеграция воркеров
- [ ] База медитаций (50+ медитаций)
- [ ] Система рекомендаций на основе анализа
- [ ] Визуализация эмоциональной динамики
- [ ] Подготовка к Telegram Mini App

## 📁 Структура проекта

```
apps/
└── web/                    # Next.js 15 приложение
    └── app/
        └── api/chat/       # Edge API для быстрых ответов

packages/
├── @gc/types/             # TypeScript типы
├── @gc/domain/            # Бизнес-логика
├── @gc/claude-proxy/      # Обертка для Claude API
└── @gc/lib-*/             # Вспомогательные библиотеки

services/
├── emotion-worker/        # DeepSeek анализ эмоций
└── prompt-worker/         # Генерация промптов

docs/                      # Документация
tests/                     # Тесты
scripts/                   # Скрипты
```

## 🤝 Для разработчиков

### Где находится основной механизм
- **Анализ эмоций**: `packages/@gc/domain/src/emotion-analyzer.ts`
- **AI интеграция**: `apps/web/app/api/chat/route.ts`
- **Фоновая обработка**: `services/emotion-worker/`

### Как добавить новую медитацию
1. Добавить в `data/meditations.json`
2. Указать теги эмоций для matching
3. Протестировать рекомендации

### Как подключить другую AI модель
1. Обновить `packages/@gc/claude-proxy`
2. Добавить новый адаптер
3. Изменить конфиг в `.env`

Последнее обновление: 29 мая 2025 г.
```

Теперь README отражает реальную архитектуру v2 и дает четкое понимание проекта! 🚀
