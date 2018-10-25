# finance-sls-lambda-node-stripe

This project works in conjunction with [finance-client]() and [finance-sls-lambda-node-db]().

finance-sls-lambda-node-stripe is a collection of AWS Lambda functions, running Node and managed by Serverless, that handle API calls from a client and then interact with Stripe's Node API library.

Each Lambda function handles an HTTP method API call from AWS API Gateway. API Gateway authenticates using AWS Cognito, checking the idToken provided by the client. Each function, except for the POST method, authenticates with AWS Cognito a second time, verifying the accessToken provided by the client, which is updated much more frequently than idToken.

- /customers

  - POST: signs up a new user;

    - the user's email is checked, using AWS Cogntio, to verify it is not already associated with an account;
    - a new Stripe customer is created and a subscription is added to that customer, billing every quarter and prorating for the first quarter;
    - if provided, a promo code is verified and added to the subscription plan;
    - finally, an SNS message is published to a topic that finance-sls-lambda-node-db subscribes to; finance-sls-lambda-node-db finishes signing up the user

  - GET: retreives the user's Stripe information;

  - PUT: updates the user's Stripe information;

  - DELETE: deletes the user's Stripe information;
