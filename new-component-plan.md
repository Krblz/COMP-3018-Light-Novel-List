# New Component Plan

## Selected Component: Express-rate-limit for Basic Rate Limiting

## Why

- Is the easiest to implement.
- My API will be having a large amount of data so limiting the rate would allow for  
easier management of data and avoid too many request errors.

## Other Components Considered

- Muter for file uploads for demo reading but may be too much.
- In-memory caching for faster access of existing data.

## Implementation Plan

1. Install express rate limit
2. Create a rate limiter in config
3. Apply middleware to app.ts
4. Add Error 429 for too many requests.

## Integration Plans

- Express-rate-limit is a middleware between incoming request and route handler. So it is  
going to be used to intercept requests and check the how many requests were made within a  
specific time window.  
- I plan to integrate this into app.ts which allows it apply to all existing routes.
