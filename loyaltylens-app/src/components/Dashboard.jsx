import { useState, useEffect } from 'react';
import { Eye, EyeOff, Search, Filter } from 'lucide-react';
import Masonry from 'react-masonry-css';
import { getEntries, toggleHidden } from '../utils/storage';
import FilterBar from './FilterBar';
import DetailModal from './DetailModal';
import './Dashboard.css';

const Dashboard = ({ refreshTrigger }) => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    retailer: '',
    country: '',
    loyaltyBrand: '',
    promotionPeriod: '',
    items: '',
    mechanics: '',
  });

  // Load entries from localStorage
  useEffect(() => {
    loadEntries();
  }, [refreshTrigger]);

  // Apply filters whenever entries or filters change
  useEffect(() => {
    applyFilters();
  }, [entries, filters, showHidden]);

  const loadEntries = () => {
    const data = getEntries();
    setEntries(data);
  };

  const applyFilters = () => {
    let filtered = [...entries];

    // Filter by hidden status
    if (!showHidden) {
      filtered = filtered.filter(entry => !entry.hidden);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.retailer?.toLowerCase().includes(searchLower) ||
        entry.loyaltyBrand?.toLowerCase().includes(searchLower) ||
        entry.items?.toLowerCase().includes(searchLower)
      );
    }

    // Apply dropdown filters
    if (filters.retailer) {
      filtered = filtered.filter(entry =>
        entry.retailer?.toLowerCase().includes(filters.retailer.toLowerCase())
      );
    }
    if (filters.country) {
      filtered = filtered.filter(entry =>
        entry.country?.toLowerCase().includes(filters.country.toLowerCase())
      );
    }
    if (filters.loyaltyBrand) {
      filtered = filtered.filter(entry =>
        entry.loyaltyBrand?.toLowerCase().includes(filters.loyaltyBrand.toLowerCase())
      );
    }

    // Apply advanced filters
    if (filters.promotionPeriod) {
      filtered = filtered.filter(entry =>
        entry.promotionPeriod?.toLowerCase().includes(filters.promotionPeriod.toLowerCase())
      );
    }
    if (filters.items) {
      filtered = filtered.filter(entry =>
        entry.items?.toLowerCase().includes(filters.items.toLowerCase())
      );
    }
    if (filters.mechanics) {
      filtered = filtered.filter(entry =>
        entry.mechanics?.toLowerCase().includes(filters.mechanics.toLowerCase())
      );
    }

    setFilteredEntries(filtered);
  };

  const handleToggleHidden = async (entryId, e) => {
    e.stopPropagation();
    try {
      toggleHidden(entryId);
      loadEntries();
    } catch (error) {
      console.error('Error toggling hidden status:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const breakpointColumns = {
    default: 4,
    1536: 3,
    1024: 2,
    640: 1,
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (field) => {
    const values = entries.map(entry => entry[field]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search and Filters */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search retailer, brand, or items..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle & Show Hidden */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>

              <button
                onClick={() => setShowHidden(!showHidden)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showHidden
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showHidden ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                {showHidden ? 'Hide' : 'Show'} Hidden
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          {showFilters && (
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              retailers={getUniqueValues('retailer')}
              countries={getUniqueValues('country')}
              brands={getUniqueValues('loyaltyBrand')}
            />
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-sm text-gray-600">
          Showing {filteredEntries.length} of {entries.length} entries
          {showHidden && ` (including hidden)`}
        </p>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No entries found</p>
            <p className="text-gray-400 text-sm mt-2">
              {entries.length === 0
                ? 'Upload your first loyalty program display to get started'
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {filteredEntries.map(entry => (
              <div
                key={entry.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setSelectedEntry(entry)}
              >
                <img
                  src={entry.imageData}
                  alt={entry.retailer}
                  className="w-full h-auto object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {entry.retailer}
                    </h3>
                    <button
                      onClick={(e) => handleToggleHidden(entry.id, e)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {entry.hidden ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    {entry.loyaltyBrand}
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📍 {entry.country}</p>
                    {entry.promotionPeriod && (
                      <p>📅 {entry.promotionPeriod}</p>
                    )}
                    {entry.mechanics && (
                      <p className="line-clamp-2">🎯 {entry.mechanics}</p>
                    )}
                  </div>
                  {entry.needsClarification && (
                    <div className="mt-3 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                      Needs Clarification
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Masonry>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEntry && (
        <DetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onUpdate={loadEntries}
        />
      )}
    </div>
  );
};

export default Dashboard;
