# Gemini Model Update - Using gemini-2.0-flash

## Problem
Error: `models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent. Call ListModels to see the list of available models and their supported methods.`

## Root Cause
The `gemini-1.5-flash` model is no longer available in either v1 or v1beta API versions. Google has updated to newer model versions, with `gemini-2.0-flash` being the current recommended model.

## Solution

### 1. **Updated Model to gemini-2.0-flash (api/process.ts)**
- Changed from: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- Changed to: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- gemini-2.0-flash is Google's latest stable model with better performance and capabilities

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
      "name": "models/gemini-2.0-flash",
      "displayName": "Gemini 2.0 Flash",
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
- Default Gemini model updated to `gemini-2.0-flash`
- Vercel deployment compatible
- Environment variable support: `GEMINI_API_KEY`

## Related Files
- `/api/process.ts` - Updated Gemini API call to v1beta
- `/api/list-models.ts` - New ListModels endpoint
- `/src/services/ai-api.ts` - Added listGeminiModels method
