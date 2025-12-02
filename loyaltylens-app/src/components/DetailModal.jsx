import { useState } from 'react';
import { X, Edit2, Save, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-react';
import { updateEntry, toggleHidden, deleteEntry } from '../utils/storage';

const DetailModal = ({ entry, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...entry });
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateEntry(entry.id, editedData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Failed to update entry');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleHidden = async () => {
    try {
      await toggleHidden(entry.id);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error toggling hidden status:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      try {
        await deleteEntry(entry.id);
        onUpdate();
        onClose();
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry');
      }
    }
  };

  const handleCancel = () => {
    setEditedData({ ...entry });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Edit Entry' : 'Entry Details'}
            </h2>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleToggleHidden}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title={entry.hidden ? 'Unhide' : 'Hide'}
                  >
                    {entry.hidden ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={isEditing ? handleCancel : onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Image */}
              <div>
                <img
                  src={entry.imageData}
                  alt={entry.retailer}
                  className="w-full rounded-lg shadow-lg"
                />
                {editedData.needsClarification && (
                  <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">Needs Clarification</p>
                      <p className="text-xs text-amber-700 mt-1">
                        This entry has been flagged as ambiguous or unclear.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    {/* Edit Mode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Retailer *
                      </label>
                      <input
                        type="text"
                        value={editedData.retailer || ''}
                        onChange={(e) => handleChange('retailer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={editedData.country || ''}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loyalty Brand *
                      </label>
                      <input
                        type="text"
                        value={editedData.loyaltyBrand || ''}
                        onChange={(e) => handleChange('loyaltyBrand', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Promotion Period
                      </label>
                      <input
                        type="text"
                        value={editedData.promotionPeriod || ''}
                        onChange={(e) => handleChange('promotionPeriod', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Items
                      </label>
                      <textarea
                        value={editedData.items || ''}
                        onChange={(e) => handleChange('items', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mechanics
                      </label>
                      <textarea
                        value={editedData.mechanics || ''}
                        onChange={(e) => handleChange('mechanics', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="text"
                        value={editedData.price || ''}
                        onChange={(e) => handleChange('price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="edit-needs-clarification"
                        checked={editedData.needsClarification || false}
                        onChange={(e) => handleChange('needsClarification', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="edit-needs-clarification" className="text-sm text-gray-700">
                        This entry needs clarification
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                      >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* View Mode */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Retailer</h3>
                      <p className="text-lg font-semibold text-gray-800">{entry.retailer}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Country</h3>
                      <p className="text-gray-800">{entry.country}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Loyalty Brand</h3>
                      <p className="text-lg font-semibold text-blue-600">{entry.loyaltyBrand}</p>
                    </div>

                    {entry.promotionPeriod && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Promotion Period</h3>
                        <p className="text-gray-800">{entry.promotionPeriod}</p>
                      </div>
                    )}

                    {entry.items && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Items</h3>
                        <p className="text-gray-800 whitespace-pre-wrap">{entry.items}</p>
                      </div>
                    )}

                    {entry.mechanics && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Mechanics</h3>
                        <p className="text-gray-800 whitespace-pre-wrap">{entry.mechanics}</p>
                      </div>
                    )}

                    {entry.price && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
                        <p className="text-gray-800">{entry.price}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                      <div className="flex gap-2">
                        {entry.hidden && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                            Hidden
                          </span>
                        )}
                        {entry.needsClarification && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                            Needs Clarification
                          </span>
                        )}
                        {!entry.hidden && !entry.needsClarification && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    {entry.createdAt && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                        <p className="text-gray-800 text-sm">
                          {new Date(entry.createdAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
