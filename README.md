## Gold and Bitcoin Price tracker

Price fetching App built using Node.js and Express framework
Application allows fetching of current and historical prices of gold and current price of Bitcoin

To run application and fetch desired price, following pipeline should be used:

1. Starting the app - following 3 commands can be used

```markdown
nodemon server.js
```

```markdown
npm start
```

```markdown
node server.js
```

2. Fetching gold prices

Current price:

```markdown
localhost:3000/prices/v1/gold
```

Historic price - Requires historic(boolean), date(YYYY-MM-DD format) and currency(String) URL variables:

```markdown
localhost:3000/prices/v1/gold/true/2005-12-10/USD
```

Both requests require special header called "x-access-token" whose values is an API key that can be obtained on https://www.goldapi.io

3. Fetching bitcoin price

Current price:

```markdown
localhost:3000/prices/v1/bitcoin
```

Request requires special header called "X-Api-Key" whose value is an API key that can be obtained on https://api-ninjas.com
