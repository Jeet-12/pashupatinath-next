"use client";

import { useState } from 'react';

type AddressForm = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
};

type Address = AddressForm & { id: number };

export default function UserAddressPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+91 98765 43210',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      addressLine1: '123 Main Street, Andheri East',
      addressLine2: 'Near Metro Station, Building A',
      postalCode: '400069',
      isDefault: true,
      type: 'home'
    },
    {
      id: 2,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+91 98765 43210',
      country: 'India',
      state: 'Gujarat',
      city: 'Ahmedabad',
      addressLine1: '456 Business Park',
      addressLine2: 'Corporate Office, Floor 3',
      postalCode: '380009',
      isDefault: false,
      type: 'work'
    },
    {
      id: 3,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+91 98765 43210',
      country: 'India',
      state: 'Rajasthan',
      city: 'Jaipur',
      addressLine1: '789 Heritage Street',
      addressLine2: 'Near City Palace',
      postalCode: '302001',
      isDefault: false,
      type: 'other'
    }
  ]);

  const [newAddress, setNewAddress] = useState<AddressForm>({
    firstName: '',
    lastName: '',
    email: 'pashupatinathrudraksh@gmail.com',
    phone: '',
    country: 'India',
    state: '',
    city: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    isDefault: false,
    type: 'home'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Indian states and cities data
  const states = [
    { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'] },
    { name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'] },
    { name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'] },
    { name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'] },
    { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'] },
    { name: 'Delhi', cities: ['New Delhi', 'Delhi Cantonment'] },
    { name: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Allahabad'] }
  ];

  const handleInputChange = (field: keyof AddressForm, value: AddressForm[keyof AddressForm]) => {
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

  const handleAddAddress = () => {
    const newId = Date.now();
    if (newAddress.isDefault) {
      // Remove default from other addresses
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
      setAddresses([...updatedAddresses, { ...(newAddress as AddressForm), id: newId }]);
    } else {
      setAddresses([...addresses, { ...(newAddress as AddressForm), id: newId }]);
    }

    // Reset form
    setNewAddress({
      firstName: '',
      lastName: '',
      email: 'pashupatinathrudraksh@gmail.com',
      phone: '',
      country: 'India',
      state: '',
      city: '',
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      isDefault: false,
      type: 'home'
    });

    setActiveTab('list');
  };

  const handleUpdateAddress = () => {
    if (editingId == null) return;

    const updatedAddresses: Address[] = addresses.map(addr => {
      if (addr.id === editingId) {
        // merge while keeping the existing id
        return { ...addr, ...(newAddress as AddressForm), id: addr.id } as Address;
      }
      return addr;
    });

    // Ensure only one default address
    if (newAddress.isDefault) {
      const finalAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === editingId
      }));
      setAddresses(finalAddresses);
    } else {
      setAddresses(updatedAddresses);
    }

    // Reset editing state
    setIsEditing(false);
    setEditingId(null);
    setNewAddress({
      firstName: '',
      lastName: '',
      email: 'pashupatinathrudraksh@gmail.com',
      phone: '',
      country: 'India',
      state: '',
      city: '',
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      isDefault: false,
      type: 'home'
    });
    setActiveTab('list');
  };

  const handleEditAddress = (address: Address) => {
    setNewAddress(address);
    setIsEditing(true);
    setEditingId(address.id);
    setActiveTab('create');
  };

  const handleDeleteAddress = (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    const addressToDelete = addresses.find(addr => addr.id === id);
    if (!addressToDelete) return;

    const newAddresses = addresses.filter(addr => addr.id !== id);

    // If deleting default address, set the first remaining address as default
    if (addressToDelete.isDefault && newAddresses.length > 0) {
      newAddresses[0] = { ...newAddresses[0], isDefault: true };
    }

    setAddresses(newAddresses);
  };

  const handleSetDefault = (id: number) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updatedAddresses);
  };

  const getTypeIcon = (type: Address['type']) => {
    switch (type) {
      case 'home': return '🏠';
      case 'work': return '🏢';
      case 'other': return '📍';
      default: return '📍';
    }
  };

  const getTypeLabel = (type: Address['type']) => {
    switch (type) {
      case 'home': return 'Home';
      case 'work': return 'Work';
      case 'other': return 'Other';
      default: return 'Other';
    }
  };

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
                setIsEditing(false);
                setEditingId(null);
                setNewAddress({
                  firstName: '',
                  lastName: '',
                  email: 'pashupatinathrudraksh@gmail.com',
                  phone: '',
                  country: 'India',
                  state: '',
                  city: '',
                  addressLine1: '',
                  addressLine2: '',
                  postalCode: '',
                  isDefault: false,
                  type: 'home'
                });
              }}
              className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              + Add New Address
            </button>
          </div>
        </div>

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
                  onClick={() => setActiveTab('create')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeTab === 'create'
                      ? 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{isEditing ? 'Edit Address' : 'Add New Address'}</span>
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
                      {addresses.find(addr => addr.isDefault)?.city || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Home Addresses:</span>
                    <span className="font-medium text-gray-900">
                      {addresses.filter(addr => addr.type === 'home').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Work Addresses:</span>
                    <span className="font-medium text-gray-900">
                      {addresses.filter(addr => addr.type === 'work').length}
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
                              address.isDefault
                                ? 'border-[#5F3623] bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {address.isDefault && (
                              <span className="absolute -top-2 left-4 bg-[#5F3623] text-white px-3 py-1 rounded-full text-xs font-medium">
                                Default
                              </span>
                            )}
                            
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{getTypeIcon(address.type)}</span>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {address.firstName} {address.lastName}
                                  </h3>
                                  <span className="text-sm text-gray-600 capitalize">
                                    {getTypeLabel(address.type)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditAddress(address)}
                                  className="text-blue-600 hover:text-blue-900 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="text-red-600 hover:text-red-900 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-700">
                              <p>{address.addressLine1}</p>
                              {address.addressLine2 && <p>{address.addressLine2}</p>}
                              <p>
                                {address.city}, {address.state} - {address.postalCode}
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
                              {!address.isDefault && (
                                <button
                                  onClick={() => handleSetDefault(address.id)}
                                  className="text-[#5F3623] hover:text-[#f5821f] transition-colors text-sm font-medium"
                                >
                                  Set as Default
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
                              value={newAddress.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
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
                              value={newAddress.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                              <option value="India">India</option>
                              <option value="United States">United States</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Canada">Canada</option>
                              <option value="Australia">Australia</option>
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
                              {states.map((state) => (
                                <option key={state.name} value={state.name}>
                                  {state.name}
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
                              {newAddress.state && states
                                .find(state => state.name === newAddress.state)
                                ?.cities.map(city => (
                                  <option key={city} value={city}>
                                    {city}
                                  </option>
                                ))
                              }
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Postal Code *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAddress.postalCode}
                              onChange={(e) => handleInputChange('postalCode', e.target.value)}
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
                            value={newAddress.addressLine1}
                            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
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
                            value={newAddress.addressLine2}
                            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
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
                            value={newAddress.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
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
                            checked={newAddress.isDefault}
                            onChange={(e) => handleInputChange('isDefault', e.target.checked)}
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
                          className="px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                          {isEditing ? 'Update Address' : 'Save Address'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('list');
                            setIsEditing(false);
                            setEditingId(null);
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