# finance-sls-lambda-node-stripe

This project works in conjunction with [finance-client]() and [finance-sls-lambda-node-db](https://github.com/twils0/finance-sls-lambda-node-db).

The overall project allows users to search for equities, by ticker, name, sector/category, or exchange, using PostgreSQL's full text search. Users can subscribe to view an equity's current price and description, provided by IEX, and to receive research emails, relevant to that equity, formatted and forwarded using AWS SES, SNS, and S3. The project includes custom login and sign up forms, using AWS Cogntio under the hood and including MFA and a custom email verification process that sends styled (template) emails with links, through a combination of AWS Lambda functions (Node), RDS, and SES. The sign up process uses a credit card input component from Stripe's React library and AWS Lambda functions (Node) to register the user as a customer with Stripe and to setup a recurring quarterly payment schedule, prorated for the first quarter.

finance-sls-lambda-node-stripe is a collection of AWS Lambda functions, running Node and managed by Serverless, that handle API calls from a client and then interact with Stripe's Node API library.

Each Lambda function handles an API call from a different HTTP method from AWS API Gateway. API Gateway authenticates using AWS Cognito, checking the idToken provided by the client. Each function, except for the POST method, authenticates with AWS Cognito a second time, verifying the accessToken provided by the client, which is updated much more frequently than idToken.

- /customers

  - POST: signs up a new user;

  - GET: retreives the user's Stripe information;

  - PUT: updates the user's Stripe information;

  - DELETE: deletes the user's Stripe information;
