# ⚠️ AI API Security Notes

## Current Implementation

The current implementation uses Anthropic SDK directly in the browser with `dangerouslyAllowBrowser: true`. This works for development and learning, but **exposes your API key** in the browser.

## Security Risk

**API keys in browser code are visible to anyone:**
- Users can see your API key in browser DevTools
- API keys can be extracted and misused
- You'll be charged for unauthorized API usage

## Recommended Production Solution

### Option 1: Backend API Proxy (Recommended)

Create a backend API endpoint that calls Anthropic:

**Backend (Node.js/Express example):**
```javascript
// server/api/ai.js
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Server-side only
});

app.post('/api/ai/recommendations', async (req, res) => {
  try {
    const { movies, userPreferences } = req.body;
    // Call Anthropic API
    const recommendations = await getPersonalizedRecommendations({
      movies,
      userPreferences,
    });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Frontend:**
```typescript
// src/services/aiService.ts
export async function getPersonalizedRecommendations(request: AIRecommendationRequest) {
  const response = await axios.post('/api/ai/recommendations', request);
  return response.data;
}
```

### Option 2: Rate Limiting & API Key Rotation

If you must use browser-side API calls:
1. **Use environment variables** (already done)
2. **Implement rate limiting** in your app
3. **Rotate API keys regularly**
4. **Monitor API usage** for unusual patterns
5. **Set spending limits** in Anthropic dashboard

### Option 3: Use Anthropic's Browser SDK (if available)

Check if Anthropic provides a browser-specific SDK with better security.

## Current Setup (Development Only)

For now, the code uses `dangerouslyAllowBrowser: true` which:
- ✅ Works for development and learning
- ✅ Allows testing AI features
- ❌ **NOT suitable for production**
- ❌ Exposes API key to users

## Migration Path

When ready for production:
1. Create backend API endpoints
2. Move AI service calls to backend
3. Remove `dangerouslyAllowBrowser: true`
4. Keep API key server-side only
5. Add authentication/rate limiting

## Best Practices

1. **Never commit API keys** to Git
2. **Use environment variables** for all secrets
3. **Implement rate limiting** on API calls
4. **Monitor usage** regularly
5. **Set budget alerts** in Anthropic dashboard

