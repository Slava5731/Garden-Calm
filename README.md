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

### 🚧 В процессе:
- [ ] Пакет типов @gc/types (Этап 3.1)

### ⏭️ Следующие шаги:
- [ ] Создание TypeScript типов для эмоций, снапшотов, сообщений и медитаций
- [ ] Настройка доменной логики
- [ ] Интеграция с Redis и RabbitMQ

Последнее обновление: 29 мая 2025 г.
