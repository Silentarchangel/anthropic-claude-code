// OpenRouter API integration for image analysis

export const analyzeImage = async (imageData, apiKey) => {
  try {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }

    // Prepare the prompt for extracting loyalty program information
    const prompt = `Analyze this loyalty program display image and extract the following information in JSON format:

{
  "retailer": "Name of the retailer/store",
  "country": "Country where this is located",
  "loyaltyBrand": "Name of the loyalty program or brand",
  "promotionPeriod": "Time period of the promotion (e.g., 'January 2024', 'Summer 2024', etc.)",
  "items": "Description of items included in the promotion",
  "mechanics": "How the loyalty program works (e.g., 'Collect stickers', 'Earn points', etc.)",
  "price": "Price or value information if visible",
  "needsClarification": false
}

IMPORTANT INSTRUCTIONS:
- Extract information ONLY if clearly visible in the image
- Use "Not visible" for any field that cannot be determined from the image
- Set "needsClarification" to true if the image is blurry, ambiguous, or missing key information
- Be specific and accurate
- Return ONLY valid JSON, no additional text or explanation

If this image does not appear to be a loyalty program display, return:
{"error": "This does not appear to be a loyalty program display image"}`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'LoyaltyLens'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free', // Free Gemini model via OpenRouter
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter API key.');
      } else if (response.status === 402) {
        throw new Error('Insufficient credits. Please add credits to your OpenRouter account.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from API');
    }

    const text = data.choices[0].message.content;

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse response from AI. Please try again with a clearer image.');
    }

    const extractedData = JSON.parse(jsonMatch[0]);

    if (extractedData.error) {
      throw new Error(extractedData.error);
    }

    return extractedData;
  } catch (error) {
    console.error('Error analyzing image:', error);

    // Handle specific error types
    if (error.message.includes('API key') || error.message.includes('401')) {
      throw new Error('Invalid API key. Please check your OpenRouter API key.');
    } else if (error.message.includes('credits') || error.message.includes('402')) {
      throw new Error('Insufficient credits. Please add credits to your OpenRouter account.');
    } else if (error.message.includes('rate limit') || error.message.includes('429')) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.message.includes('safety') || error.message.includes('content_policy')) {
      throw new Error('Image was flagged by safety filters. Please try a different image.');
    } else if (error.name === 'SyntaxError') {
      throw new Error('Failed to parse AI response. Please try again.');
    }

    throw error;
  }
};

// Helper function to convert File to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
