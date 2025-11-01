"use client";
import React, { useState, useEffect } from 'react';
import { 
  getUserAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress,
  getCountries,
  getIndianStates,
  Address,
  AddressFormData
} from '../../../libs/api';

export default function UserAddressPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [countries, setCountries] = useState<{ [key: string]: string }>({});
  const [indianStates, setIndianStates] = useState<{ [key: string]: string[] }>({});

  const [newAddress, setNewAddress] = useState<AddressFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: 'India',
    state: '',
    city: '',
    address_line_1: '',
    address_line_2: '',
    postal_code: '',
    address_type: 'home',
    is_default: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAddresses();
    fetchCountries();
    fetchIndianStates();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUserAddresses();
      
      if (response.success) {
        setAddresses(response.data || []);
      } else {
        if (response.message.includes('Authentication') || response.message.includes('login')) {
          setError('Please log in to view your addresses');
        } else {
          setError(response.message || 'Failed to fetch addresses');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    const response = await getCountries();
    if (response.success) {
      setCountries(response.data);
    }
  };

  const fetchIndianStates = async () => {
    const response = await getIndianStates();
    if (response.success) {
      setIndianStates(response.data);
    }
  };

  const handleInputChange = (field: keyof AddressFormData, value: any) => {
    setNewAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStateChange = (stateName: string) => {
    setNewAddress(prev => ({
      ...prev,
      state: stateName,
      city: '' // Reset city when state changes
    }));
  };

  const handleAddAddress = async () => {
    try {
      setActionLoading(-1); // Use -1 for create action
      const response = await createAddress(newAddress);

      if (response.success) {
        await fetchAddresses(); // Refresh the list
        resetForm();
        setActiveTab('list');
      } else {
        setError(response.message || 'Failed to create address');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create address');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateAddress = async () => {
    if (editingId == null) return;

    try {
      setActionLoading(editingId);
      const response = await updateAddress(editingId, newAddress);

      if (response.success) {
        await fetchAddresses(); // Refresh the list
        resetForm();
        setActiveTab('list');
      } else {
        setError(response.message || 'Failed to update address');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update address');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditAddress = (address: Address) => {
    setNewAddress({
      first_name: address.first_name,
      last_name: address.last_name,
      email: address.email,
      phone: address.phone,
      country: address.country,
      state: address.state,
      city: address.city,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      postal_code: address.postal_code,
      address_type: address.address_type,
      is_default: address.is_default
    });
    setIsEditing(true);
    setEditingId(address.id);
    setActiveTab('create');
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      setActionLoading(id);
      const response = await deleteAddress(id);

      if (response.success) {
        await fetchAddresses(); // Refresh the list
      } else {
        setError(response.message || 'Failed to delete address');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete address');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      setActionLoading(id);
      const response = await setDefaultAddress(id);

      if (response.success) {
        await fetchAddresses(); // Refresh the list
      } else {
        setError(response.message || 'Failed to set default address');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set default address');
    } finally {
      setActionLoading(null);
    }
  };

  const resetForm = () => {
    setNewAddress({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      country: 'India',
      state: '',
      city: '',
      address_line_1: '',
      address_line_2: '',
      postal_code: '',
      address_type: 'home',
      is_default: false
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return '🏠';
      case 'work': return '🏢';
      case 'other': return '📍';
      default: return '📍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'home': return 'Home';
      case 'work': return 'Work';
      case 'other': return 'Other';
      default: return 'Other';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            {/* Loading skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="border border-gray-200 rounded-lg p-6">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Address Book</h1>
              <p className="text-gray-600 mt-2">Manage your shipping and billing addresses</p>
            </div>
            <button
              onClick={() => {
                setActiveTab('create');
                resetForm();
              }}
              className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              + Add New Address
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeTab === 'list'
                      ? 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>All Addresses</span>
                  <span className="ml-auto bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {addresses.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('create');
                    resetForm();
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeTab === 'create'
                      ? 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add New Address</span>
                </button>
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Address Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Addresses:</span>
                    <span className="font-medium text-gray-900">{addresses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Default Address:</span>
                    <span className="font-medium text-green-600">
                      {addresses.find(addr => addr.is_default)?.city || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Home Addresses:</span>
                    <span className="font-medium text-gray-900">
                      {addresses.filter(addr => addr.address_type === 'home').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Work Addresses:</span>
                    <span className="font-medium text-gray-900">
                      {addresses.filter(addr => addr.address_type === 'work').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tab Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTab === 'list' && 'Saved Addresses'}
                  {activeTab === 'create' && (isEditing ? 'Edit Address' : 'Add New Address')}
                </h2>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Address List */}
                {activeTab === 'list' && (
                  <div>
                    {addresses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`border-2 rounded-lg p-6 relative ${
                              address.is_default
                                ? 'border-[#5F3623] bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {address.is_default && (
                              <span className="absolute -top-2 left-4 bg-[#5F3623] text-white px-3 py-1 rounded-full text-xs font-medium">
                                Default
                              </span>
                            )}
                            
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{getTypeIcon(address.address_type)}</span>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {address.first_name} {address.last_name}
                                  </h3>
                                  <span className="text-sm text-gray-600 capitalize">
                                    {getTypeLabel(address.address_type)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditAddress(address)}
                                  className="text-blue-600 hover:text-blue-900 transition-colors"
                                  disabled={actionLoading === address.id}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="text-red-600 hover:text-red-900 transition-colors"
                                  disabled={actionLoading === address.id}
                                >
                                  {actionLoading === address.id ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-700">
                              <p>{address.address_line_1}</p>
                              {address.address_line_2 && <p>{address.address_line_2}</p>}
                              <p>
                                {address.city}, {address.state} - {address.postal_code}
                              </p>
                              <p>{address.country}</p>
                              <p className="mt-2">
                                <span className="font-medium">Phone:</span> {address.phone}
                              </p>
                              <p>
                                <span className="font-medium">Email:</span> {address.email}
                              </p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                              {!address.is_default && (
                                <button
                                  onClick={() => handleSetDefault(address.id)}
                                  className="text-[#5F3623] hover:text-[#f5821f] transition-colors text-sm font-medium"
                                  disabled={actionLoading === address.id}
                                >
                                  {actionLoading === address.id ? 'Setting...' : 'Set as Default'}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl text-white">🏠</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses saved</h3>
                        <p className="text-gray-600 mb-6">Add your first address to get started</p>
                        <button
                          onClick={() => setActiveTab('create')}
                          className="px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Add Your First Address
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Create/Edit Address Form */}
                {activeTab === 'create' && (
                  <div className="max-w-2xl">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (isEditing) {
                        handleUpdateAddress();
                      } else {
                        handleAddAddress();
                      }
                    }} className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAddress.first_name}
                              onChange={(e) => handleInputChange('first_name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                              placeholder="Enter first name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAddress.last_name}
                              onChange={(e) => handleInputChange('last_name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              required
                              value={newAddress.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                              placeholder="Enter email address"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              required
                              value={newAddress.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                              placeholder="Enter phone number"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country *
                            </label>
                            <select
                              value={newAddress.country}
                              onChange={(e) => handleInputChange('country', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                            >
                              {Object.entries(countries).map(([code, name]) => (
                                <option key={code} value={name}>{name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State *
                            </label>
                            <select
                              required
                              value={newAddress.state}
                              onChange={(e) => handleStateChange(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                            >
                              <option value="">Select State</option>
                              {Object.keys(indianStates).map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <select
                              required
                              value={newAddress.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              disabled={!newAddress.state}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100"
                            >
                              <option value="">Select City</option>
                              {newAddress.state && indianStates[newAddress.state]?.map(city => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Postal Code *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAddress.postal_code}
                              onChange={(e) => handleInputChange('postal_code', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                              placeholder="Enter postal code"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Line 1 *
                          </label>
                          <input
                            type="text"
                            required
                            value={newAddress.address_line_1}
                            onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                            placeholder="Enter street address, building, etc."
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            value={newAddress.address_line_2}
                            onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                            placeholder="Apartment, suite, unit, etc. (optional)"
                          />
                        </div>
                      </div>

                      {/* Address Type and Default */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Type
                          </label>
                          <select
                            value={newAddress.address_type}
                            onChange={(e) => handleInputChange('address_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newAddress.is_default}
                            onChange={(e) => handleInputChange('is_default', e.target.checked)}
                            className="w-4 h-4 text-[#5F3623] border-gray-300 rounded focus:ring-[#5F3623]"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            Set as default address
                          </label>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-6 border-t border-gray-200">
                        <button
                          type="submit"
                          disabled={actionLoading === (isEditing ? editingId : -1)}
                          className="px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {actionLoading === (isEditing ? editingId : -1) ? 'Saving...' : 
                           (isEditing ? 'Update Address' : 'Save Address')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('list');
                            resetForm();
                          }}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}