import { useState } from 'react';
import { Save, X, AlertTriangle } from 'lucide-react';
import { saveEntry } from '../utils/storage';

const ReviewForm = ({ analysisData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    retailer: analysisData.retailer || '',
    country: analysisData.country || '',
    loyaltyBrand: analysisData.loyaltyBrand || '',
    promotionPeriod: analysisData.promotionPeriod || '',
    items: analysisData.items || '',
    mechanics: analysisData.mechanics || '',
    price: analysisData.price || '',
    needsClarification: analysisData.needsClarification || false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const entry = saveEntry({
        ...formData,
        imageData: analysisData.imageData,
      });
      onSave(entry);
    } catch (err) {
      console.error('Error saving entry:', err);
      setError('Failed to save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h2 className="text-2xl font-bold">Review & Edit Analysis</h2>
          <p className="text-blue-100 mt-1">
            Please verify the AI-extracted information and make any necessary corrections
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Image</h3>
            <img
              src={analysisData.imageData}
              alt="Loyalty program display"
              className="w-full rounded-lg shadow-md"
            />
            {formData.needsClarification && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">Needs Clarification</p>
                  <p className="text-xs text-amber-700 mt-1">
                    The AI flagged this entry as ambiguous or unclear. Please review carefully.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retailer *
              </label>
              <input
                type="text"
                value={formData.retailer}
                onChange={(e) => handleChange('retailer', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Woolworths, Coles"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Australia, USA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loyalty Brand *
              </label>
              <input
                type="text"
                value={formData.loyaltyBrand}
                onChange={(e) => handleChange('loyaltyBrand', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Disney+, Marvel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promotion Period
              </label>
              <input
                type="text"
                value={formData.promotionPeriod}
                onChange={(e) => handleChange('promotionPeriod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., January 2024, Summer 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items
              </label>
              <textarea
                value={formData.items}
                onChange={(e) => handleChange('items', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the items included in the promotion"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mechanics
              </label>
              <textarea
                value={formData.mechanics}
                onChange={(e) => handleChange('mechanics', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="How does the loyalty program work?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., $30, £20"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="needsClarification"
                checked={formData.needsClarification}
                onChange={(e) => handleChange('needsClarification', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="needsClarification" className="text-sm text-gray-700">
                This entry needs clarification
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
