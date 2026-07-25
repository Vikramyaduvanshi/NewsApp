                ┌─────────────────┐
                │  News APIs      │
                │---------------- │
                │ Finnhub         │
                │ NewsAPI         │
                │ GNews           │
                │ MarketAux       │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ News Cleaner    │
                │ Deduplication   │
                │ Source Ranking  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Economic APIs   │
                │---------------- │
                │ TradingEconomics│
                │ FRED            │
                │ AlphaVantage    │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Technical Engine│
                │ RSI MACD ATR    │
                │ DXY Bond Yield  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Redis Memory    │
                │ Previous Bias   │
                │ Market Regime   │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ AI Analysis     │
                │ Narrative       │
                │ Currency Score  │
                │ Risk Regime     │
                └─────────────────┘


Finnhub
+
MarketAux
+
TradingEconomics
+
AlphaVantage
+
Google RSS
+
FRED
+
Redis
+
OpenAI/Gemini