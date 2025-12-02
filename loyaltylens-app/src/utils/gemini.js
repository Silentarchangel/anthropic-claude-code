// Google Gemini API integration for image analysis

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
let genAI = null;

export const initializeGemini = (apiKey) => {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }
  genAI = new GoogleGenerativeAI(apiKey);
};

export const analyzeImage = async (imageData, apiKey) => {
  try {
    // Initialize if not already done
    if (!genAI && apiKey) {
      initializeGemini(apiKey);
    }

    if (!genAI) {
      throw new Error('Gemini API not initialized. Please provide an API key.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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

    // Convert image data to the format Gemini expects
    const imagePart = {
      inlineData: {
        data: imageData.split(',')[1], // Remove the data:image/...;base64, prefix
        mimeType: imageData.split(';')[0].split(':')[1],
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse response from AI');
    }

    const data = JSON.parse(jsonMatch[0]);

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Error analyzing image:', error);

    // Handle specific error types
    if (error.message.includes('API key')) {
      throw new Error('Invalid API key. Please check your Gemini API key.');
    } else if (error.message.includes('safety')) {
      throw new Error('Image was flagged by safety filters. Please try a different image.');
    } else if (error.message.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
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
