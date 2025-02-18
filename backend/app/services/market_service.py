import ccxt

exchange = ccxt.binance()


def get_tiker_list(quote: str) -> list:
    markets = exchange.fetch_markets()
    if quote:
        tickers = [market["symbol"] for market in markets if market["quote"] == quote]
    else:
        tickers = [market["symbol"] for market in markets]

    return tickers
