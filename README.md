# Garden Calm 🌱

Приложение для медитаций с AI-анализом эмоций.

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
- [ ] Интеграция Prompt builder с RabbitMQ и Redis
- [ ] Тесты для Prompt builder

### ⏭️ Следующие шаги:
- [ ] Интеграция с AI (mock)
- [ ] Система снапшотов эмоций
- [ ] База медитаций и рекомендации

Последнее обновление: 29 мая 2025 г.
