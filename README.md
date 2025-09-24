# AI-Freelance-Manager

**AI Freelance Manager**

Финансово-документальный SaaS для фрилансеров и малого бизнеса.
Трекинг доходов/расходов → CRM клиентов → генерация инвойсов, договоров и предложений (proposal) → AI-помощник для ставок и писем.
PWA: работает в браузере и ставится как приложение.

**🎯 Проблема**

Фрилансерам и самозанятым приходится:

-вести учет доходов/расходов,

-готовить счета и договоры для клиентов,(посмотреть сторонние сервисы stripe , paypal)

-писать предложения (proposals) и сопроводительные письма,( типа счета тольк КП =P)

-ориентироваться в ставках и переговорах. (AI помогает делать промт. узнать среднюю стоимость на рынке)

**👉 Сейчас это делается вручную, в Excel или через дорогие бухгалтерские сервисы.**

**💡 Решение**

AI Freelance Manager — это PWA-приложение, которое:

-ведет учет финансов (доходы/расходы, категории, отчёты),

-хранит клиентов и реквизиты,

-генерирует счета и договоры в PDF,

-помогает с предложениями и письмами через AI,

-подсказывает рекомендованную ставку по проекту,

-работает в браузере и на телефоне (устанавливается как приложение).

**🔑 Основные функции (MVP)**

**1.Финансы**

-Учёт доходов/расходов

-Категории и теги

-Баланс, отчёты по месяцам

-Экспорт CSV

**2.CRM (Клиенты)**

-Список клиентов

-Реквизиты (IBAN, VAT, контакты)

**3.Документы**

-Генерация счетов (Invoice)

-Автоматическая подстановка данных клиента

-PDF-экспорт

**4.AI-помощник**
-генерация proposal по брифу,

-рекомендации почасовой ставки / фикс-прайса,

-переписывание писем в нужном тоне (RU/DE/EN).

**5.Монетизация**

Freemium: до 3 документов/мес.

Pro: 5 €/мес. — безлимит, AI-помощь, брендирование

## Quick start

### Backend (FastAPI)

```bash
# from repo root
source .venv/bin/activate  # if not active
./backend/run_dev.sh       # starts on http://localhost:8000
```

Endpoints:
- `GET /health`
- `POST /categories`, `GET /categories`
- `POST /transactions`, `GET /transactions`
- `GET /balance`
- `GET /report/month?year=2025&month=9`
- `GET /export/csv`

### Frontend (Vite React TS)

```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

Set API base via `.env` in `frontend`:
```
VITE_API_BASE=http://localhost:8000
```

Minimal features:
- Add transactions with amount, note, category
- Seed default categories
- Show recent transactions and current balance
- Monthly pie chart and CSV export
