import { useState, useRef } from 'react';
import { Upload, Camera, Loader2, AlertCircle } from 'lucide-react';
import { analyzeImage, fileToBase64 } from '../utils/gemini';

const ImageUpload = ({ onAnalysisComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openrouter_api_key') || '');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processImage(file);
  };

  const processImage = async (file) => {
    if (!apiKey) {
      setError('Please enter your OpenRouter API key first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Save API key to localStorage
      localStorage.setItem('openrouter_api_key', apiKey);

      // Convert file to base64
      const base64Image = await fileToBase64(file);

      // Analyze image with OpenRouter
      const analysisResult = await analyzeImage(base64Image, apiKey);

      // Pass results to parent component along with the image
      onAnalysisComplete({
        ...analysisResult,
        imageData: base64Image,
      });
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Loyalty Program Display</h2>

        {/* API Key Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OpenRouter API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter your OpenRouter API key"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from{' '}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenRouter
            </a>
            {' '}(Uses free Gemini 2.0 Flash model)
          </p>
        </div>

        {/* Upload Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || !apiKey}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="font-medium">Upload from Files</span>
          </button>

          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={loading || !apiKey}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Camera className="w-5 h-5" />
            <span className="font-medium">Take Photo</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-6 flex items-center justify-center gap-3 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing image with AI...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Tips for best results:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Ensure the image is clear and well-lit</li>
            <li>Capture all relevant text and details</li>
            <li>Avoid blurry or obstructed images</li>
            <li>Include pricing and promotion period information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
