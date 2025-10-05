# AI API Setup Guide for Dorminder

This guide explains how to integrate open-source AI APIs for enhanced financial forecasting and analytics in the Dorminder property management system.

## Overview

The Dorminder AI Analytics system currently uses built-in algorithms for financial forecasting. To enhance the system with external AI APIs, you can integrate various open-source and free AI services.

## Recommended Open Source AI APIs

### 1. Hugging Face Transformers API (Free Tier)

**Description**: Provides access to pre-trained models for time series forecasting and financial analysis.

**Setup Steps**:
1. Create account at [Hugging Face](https://huggingface.co/)
2. Generate API token from your profile settings
3. Add to environment variables:

```bash
# .env file
VITE_HUGGING_FACE_API_KEY=your_api_key_here
```

**Usage Example**:
```javascript
// In aiAnalyticsService.js
const forecastWithHuggingFace = async (data) => {
  const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_HUGGING_FACE_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      inputs: `Forecast revenue for next 6 months based on: ${JSON.stringify(data)}`
    }),
  });
  return response.json();
};
```

### 2. OpenAI API (Paid but has free credits)

**Description**: Advanced language models for financial analysis and forecasting.

**Setup Steps**:
1. Create account at [OpenAI](https://openai.com/)
2. Generate API key from API section
3. Add to environment variables:

```bash
# .env file
VITE_OPENAI_API_KEY=your_api_key_here
```

**Usage Example**:
```javascript
const analyzeWithOpenAI = async (financialData) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Analyze this financial data and provide insights: ${JSON.stringify(financialData)}`
      }]
    })
  });
  return response.json();
};
```

### 3. TensorFlow.js (Client-side ML)

**Description**: Run machine learning models directly in the browser.

**Setup Steps**:
1. Install TensorFlow.js:
```bash
npm install @tensorflow/tfjs
```

2. Create forecasting model:
```javascript
// In aiAnalyticsService.js
import * as tf from '@tensorflow/tfjs';

const createForecastingModel = () => {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [6], units: 64, activation: 'relu' }),
      tf.layers.dense({ units: 32, activation: 'relu' }),
      tf.layers.dense({ units: 12, activation: 'linear' }) // 12 months forecast
    ]
  });
  
  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',
    metrics: ['mae']
  });
  
  return model;
};
```

### 4. Yahoo Finance API (Free)

**Description**: Get market data for economic context in forecasting.

**Setup Steps**:
1. No API key required
2. Use directly in your service:

```javascript
const getMarketData = async () => {
  const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/^GSPC');
  return response.json();
};
```

## Implementation Guide

### Step 1: Environment Setup

Create a `.env` file in your project root:

```bash
# AI API Keys
VITE_HUGGING_FACE_API_KEY=your_hugging_face_key
VITE_OPENAI_API_KEY=your_openai_key

# Optional: Other APIs
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
VITE_FRED_API_KEY=your_fred_key
```

### Step 2: Update AI Analytics Service

Modify `src/services/aiAnalyticsService.js` to include external API calls:

```javascript
// Add at the top
const HUGGING_FACE_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Add new methods
export class AIAnalyticsService {
  // ... existing code ...

  async generateEnhancedForecast(dashboardData, months = 12) {
    try {
      // Use external AI API for enhanced forecasting
      const enhancedForecast = await this.callExternalAI(dashboardData);
      
      // Combine with local algorithms
      const localForecast = this.calculateMonthlyForecast(dashboardData, months);
      
      // Merge results
      return this.mergeForecasts(localForecast, enhancedForecast);
    } catch (error) {
      console.warn('External AI unavailable, using local forecast:', error);
      return this.calculateMonthlyForecast(dashboardData, months);
    }
  }

  async callExternalAI(data) {
    if (HUGGING_FACE_API_KEY) {
      return await this.callHuggingFace(data);
    } else if (OPENAI_API_KEY) {
      return await this.callOpenAI(data);
    } else {
      throw new Error('No AI API keys configured');
    }
  }

  async callHuggingFace(data) {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: `Analyze this property management data and provide financial insights: ${JSON.stringify(data)}`
      }),
    });
    return response.json();
  }

  async callOpenAI(data) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `As a property management AI, analyze this data and provide financial forecasting insights: ${JSON.stringify(data)}`
        }]
      })
    });
    return response.json();
  }
}
```

### Step 3: Update Dashboard Component

Modify `src/components/AIAnalyticsDashboard.jsx` to use enhanced forecasting:

```javascript
// In loadAnalyticsData function
const forecastData = await aiAnalyticsService.generateEnhancedForecast(data);
```

### Step 4: Add Error Handling

Implement fallback mechanisms:

```javascript
const generateForecast = async (data) => {
  try {
    // Try external AI first
    return await aiAnalyticsService.generateEnhancedForecast(data);
  } catch (error) {
    console.warn('External AI failed, using local algorithms:', error);
    // Fallback to local algorithms
    return await aiAnalyticsService.generateFinancialForecast(data);
  }
};
```

## Free AI Services Comparison

| Service | Free Tier | Best For | Setup Difficulty |
|---------|-----------|----------|------------------|
| Hugging Face | 30,000 requests/month | Text analysis, basic forecasting | Easy |
| OpenAI | $5 free credits | Advanced analysis, insights | Easy |
| TensorFlow.js | Unlimited (client-side) | Custom ML models | Medium |
| Yahoo Finance | Unlimited | Market data | Easy |
| Alpha Vantage | 5 calls/minute | Financial data | Easy |

## Security Considerations

1. **API Key Protection**: Never commit API keys to version control
2. **Rate Limiting**: Implement rate limiting to avoid exceeding free tiers
3. **Data Privacy**: Ensure sensitive property data is not sent to external APIs
4. **Fallback Strategy**: Always have local algorithms as backup

## Cost Optimization

1. **Caching**: Cache AI responses to reduce API calls
2. **Batch Processing**: Combine multiple requests when possible
3. **Smart Triggers**: Only call external AI for significant data changes
4. **Local First**: Use local algorithms for simple calculations

## Testing

Create test functions to verify API integrations:

```javascript
// In src/utils/aiTestUtils.js
export const testAIAPIs = async () => {
  console.log('Testing AI API integrations...');
  
  try {
    if (HUGGING_FACE_API_KEY) {
      const hfResult = await testHuggingFace();
      console.log('✅ Hugging Face API working:', hfResult);
    }
    
    if (OPENAI_API_KEY) {
      const openaiResult = await testOpenAI();
      console.log('✅ OpenAI API working:', openaiResult);
    }
  } catch (error) {
    console.error('❌ AI API test failed:', error);
  }
};
```

## Monitoring and Analytics

Track API usage and performance:

```javascript
const trackAPICall = (service, success, responseTime) => {
  // Log to analytics service
  console.log(`AI API Call: ${service}, Success: ${success}, Time: ${responseTime}ms`);
};
```

## Next Steps

1. Choose your preferred AI service(s)
2. Set up API keys in environment variables
3. Implement the enhanced forecasting methods
4. Test with real data
5. Monitor performance and costs
6. Iterate and improve based on results

## Support

For issues with AI API integration:
1. Check API documentation
2. Verify API keys and quotas
3. Review error logs in browser console
4. Test with minimal data first
5. Implement proper error handling

Remember: The current system works without external APIs. Adding them is optional for enhanced capabilities.



