# Rate Limit (429) Handling Implementation

## Overview

This document describes the implementation of robust rate limit handling for the H5 AI Writer API. When external AI services (OpenAI, Google Gemini, DeepSeek) respond with HTTP 429 (Too Many Requests) errors, the backend now automatically retries the request using exponential backoff with jitter.

## Problem

Previously, when API providers returned 429 rate limit errors, these errors were immediately returned to the client. This resulted in:
- Poor user experience with immediate failures
- No retry mechanism for transient rate limits
- No respect for `Retry-After` headers sent by providers

## Solution

### Retry Strategy

The implementation uses **exponential backoff with jitter** to automatically retry failed requests:

1. **Initial Attempt**: Send the original request
2. **On Failure**: Check if the error is retryable:
   - HTTP 429 (Rate Limited) ✓ Retryable
   - HTTP 5xx (Server Errors) ✓ Retryable
   - Connection/Timeout Errors ✓ Retryable
   - HTTP 401/403 (Auth Errors) ✗ Not Retryable
   - HTTP 400 (Bad Request) ✗ Not Retryable

3. **Retry Logic**:
   - Maximum 3 retry attempts
   - Initial delay: 1 second
   - Exponential backoff: Double the delay each retry (1s → 2s → 4s)
   - Maximum delay: 15 seconds
   - Jitter: Add random 10% variation to prevent thundering herd

4. **Retry-After Header**: If the API returns a `Retry-After` header (in seconds or HTTP date format), respect that value instead of using exponential backoff

### Implementation Details

#### Core Retry Function

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T>
```

Features:
- Generic type support for any async function
- Configurable retry parameters
- Respects HTTP `Retry-After` header
- Adds jitter to prevent thundering herd problem
- Detailed logging for debugging

#### Applied to All API Providers

The retry logic wraps all external API calls:
- OpenAI (`callOpenAI`)
- Google Gemini (`callGemini`)
- DeepSeek (`callDeepSeek`)
- Custom Services (`callThirdParty`)

Each provider is configured with:
- 3 maximum retries
- 1 second initial delay
- 15 second maximum delay
- 2x exponential backoff multiplier

### Error Handling

If all retries are exhausted:
1. The error is propagated to the error handler
2. The backend returns HTTP 429 with appropriate message
3. The frontend displays: "API 请求过于频繁，请稍后再试" (Too many requests, please try again later)

## Benefits

1. **Improved Reliability**: Handles transient rate limiting gracefully
2. **Better User Experience**: Users don't see immediate failures for temporary issues
3. **API Compliance**: Respects provider rate limit headers and guidelines
4. **Reduced Load**: Jitter prevents multiple clients from retrying simultaneously
5. **Transparent**: Retry logic happens server-side without client knowledge

## Configuration

The retry parameters can be adjusted in the `callOpenAI`, `callGemini`, `callDeepSeek`, and `callThirdParty` functions:

```typescript
{
  maxRetries: 3,              // Number of retry attempts
  initialDelayMs: 1000,       // Starting delay in milliseconds
  maxDelayMs: 15000,          // Maximum delay in milliseconds
  backoffMultiplier: 2,       // Multiplier for exponential backoff
}
```

## Testing

To test rate limit handling:

1. Implement a mock server that returns 429 errors
2. Verify that requests are retried according to the configured delays
3. Check that logs show retry attempts with increasing delays
4. Confirm that after max retries, the error is properly returned

## Monitoring

The implementation includes detailed console logging:
```
Attempt 1 failed. Retrying in 1234ms... [error message]
Attempt 2 failed. Retrying in 2456ms... [error message]
```

These logs help debugging and monitoring in production environments.

## Related Files

- `/api/process.ts` - Backend API handler with retry logic
- `/src/services/ai-api.ts` - Frontend API service (error handling)

## Future Improvements

1. Add circuit breaker pattern for repeated failures
2. Implement adaptive backoff based on provider-specific patterns
3. Add metrics/monitoring for retry statistics
4. Consider client-side retry for certain scenarios
