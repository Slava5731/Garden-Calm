# Garden Calm 🌱

Приложение для медитаций с AI-анализом эмоций.

## 📋 Прогресс разработки

### ✅ Выполнено:
- [x] Инициализация монорепо
  - [x] package.json с pnpm workspaces
  - [x] pnpm-workspace.yaml
  - [x] turbo.json для монорепо
  - [x] tsconfig.json (базовый)
  - [x] .gitignore
  - [x] .npmrc
  - [x] .eslintrc.js + prettier.config.js
  - [x] commitlint.config.js
- [x] Создание структуры пакетов
  - [x] Создана директория apps/web (Next.js 15)
  - [x] Созданы директории packages/ (@gc/types, @gc/domain, @gc/lib-redis, @gc/lib-rabbit, @gc/ui)
  - [x] Созданы директории services/ (emotion-worker, prompt-worker)
  - [x] Созданы директории infra/pulumi, docs/, tests/, scripts/

### 🚧 В процессе:
- [ ] Настройка Next.js приложения с чатом (Этап 2.1)

### ⏭️ Следующие шаги:
- [ ] Создание Next.js 15 приложения с Tailwind CSS
- [ ] Разработка компонентов чата (ChatHeader, MessageList, ChatInput, EmotionIndicator)
- [ ] Создание Edge Route /api/chat
- [ ] Стилизация интерфейса с плавными анимациями

Последнее обновление: 29 мая 2025 г.
