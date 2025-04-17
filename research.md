### What is a Cloudflare Worker?
A Cloudflare Worker is a serverless JavaScript function that runs on Cloudflare's edge network around the world, allowing developers to run code in reaction to HTTP requests without having to manage servers.

### How does a Worker handle HTTP requests and return responses?
When there is an incoming HTTP request, the Worker detects and takes in the request event, runs custom code like routing logic or database queries, and returns an HTTP Response object back to the client.

### What is Cloudflare D1? What are some pros and cons of it?
Cloudflare D1 is an edge‑distributed, serverless, SQLite‑based database which enables Workers to store and query relational data with low latency. Benefits include zero-effort global distribution and seamless integration with Workers but the drawbacks are limitations on supporting complex queries and database size compared to traditional RDBMS.

### How does client-side JavaScript call an external API?
Client-side JavaScript typically uses the Fetch API (or libraries like Axios) to send asynchronous HTTP requests to an API endpoint and process the returned JSON or text response.

### What is the benefit of having APIs hosted on the edge compared to traditional servers?
Deploying APIs to the edge reduces latency by serving requests on nodes closest to the users which increases scalability and availability, and avoids the requirement for centralized server architecture to handle traffic from around the world.
