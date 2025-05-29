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
  - [x] Типы для эмоций (emotion.types.ts)
  - [x] Типы для снапшотов (snapshot.types.ts)
  - [x] Типы для сообщений (message.types.ts)
  - [x] Типы для медитаций (meditation.types.ts)
- [x] Пакет доменной логики @gc/domain
  - [x] EmotionAnalyzer - анализ эмоций в сообщениях
  - [x] MeditationRecommender - рекомендации медитаций
  - [x] EmotionSnapshotManager - управление снапшотами
  - [x] Unit-тесты для всех сервисов
  - [x] Интеграция с Next.js приложением

### 🚧 В процессе:
- [ ] Emotion analyzer worker (Этап 3.3)

### ⏭️ Следующие шаги:
- [ ] Создание воркера для анализа эмоций
- [ ] Интеграция с Redis и RabbitMQ
- [ ] Разработка prompt builder для AI

Последнее обновление: 29 мая 2025 г.
