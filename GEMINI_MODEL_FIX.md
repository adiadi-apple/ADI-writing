# Gemini 1.5 Flash Model Fix

## Problem
Error: `models/gemini-1.5-flash is not found for API version v1, or is not supported for generateContent. Call ListModels to see the list of available models and their supported methods.`

## Root Cause
The original code was using the v1 API endpoint with `gemini-1.5-flash` model, which may not be available or properly supported in that version.

## Solution

### 1. **Updated API Version (api/process.ts)**
- Changed from: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`
- Changed to: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- The v1beta API provides better support for newer models like Gemini 1.5 Flash

### 2. **Added ListModels API Endpoint (api/list-models.ts)**
- New endpoint: `/api/list-models`
- Supports querying available Gemini models
- Can use both v1beta (preferred) and v1 (fallback) endpoints
- Filters models to only return those supporting `generateContent`
- Usage: `GET /api/list-models?apiKey={YOUR_API_KEY}`

### 3. **Frontend Integration (src/services/ai-api.ts)**
- Added `listGeminiModels(apiKey: string)` method
- Allows frontend to query available models
- Useful for dynamic model selection in the future

## Features
- ✅ Lists all available Gemini models
- ✅ Filters by supported methods (generateContent)
- ✅ Graceful fallback from v1beta to v1
- ✅ Error handling with meaningful messages
- ✅ CORS enabled for frontend access

## Testing

### Get Available Models
```bash
curl "http://localhost/api/list-models?apiKey=YOUR_API_KEY"
```

### Response Format
```json
{
  "models": [
    {
      "name": "models/gemini-1.5-flash",
      "displayName": "Gemini 1.5 Flash",
      "description": "...",
      "version": "001",
      "inputTokenLimit": 1000000,
      "outputTokenLimit": 8000,
      "supportedGenerationMethods": ["generateContent", "countTokens"]
    }
  ],
  "timestamp": 1699999999999
}
```

## Migration Notes
- No breaking changes to existing API
- Default Gemini model remains `gemini-1.5-flash`
- Vercel deployment compatible
- Environment variable support: `GEMINI_API_KEY`

## Related Files
- `/api/process.ts` - Updated Gemini API call to v1beta
- `/api/list-models.ts` - New ListModels endpoint
- `/src/services/ai-api.ts` - Added listGeminiModels method
