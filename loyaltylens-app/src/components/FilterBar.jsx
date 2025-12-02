import { X } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, retailers, countries, brands }) => {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: filters.search, // Keep search
      retailer: '',
      country: '',
      loyaltyBrand: '',
      promotionPeriod: '',
      items: '',
      mechanics: '',
    });
  };

  const hasActiveFilters = filters.retailer || filters.country || filters.loyaltyBrand ||
    filters.promotionPeriod || filters.items || filters.mechanics;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Advanced Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Quick Filters (Dropdowns) */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Retailer
          </label>
          <select
            value={filters.retailer}
            onChange={(e) => handleChange('retailer', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Retailers</option>
            {retailers.map(retailer => (
              <option key={retailer} value={retailer}>
                {retailer}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Country
          </label>
          <select
            value={filters.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Loyalty Brand
          </label>
          <select
            value={filters.loyaltyBrand}
            onChange={(e) => handleChange('loyaltyBrand', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Specific Text Filters */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Promotion Period
          </label>
          <input
            type="text"
            value={filters.promotionPeriod}
            onChange={(e) => handleChange('promotionPeriod', e.target.value)}
            placeholder="e.g., Summer, January"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Items
          </label>
          <input
            type="text"
            value={filters.items}
            onChange={(e) => handleChange('items', e.target.value)}
            placeholder="Search items..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Mechanics
          </label>
          <input
            type="text"
            value={filters.mechanics}
            onChange={(e) => handleChange('mechanics', e.target.value)}
            placeholder="e.g., Stickers, Points"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
