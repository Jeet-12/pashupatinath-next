"use client";

import { useState } from 'react';

type Personal = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
};

type AddressType = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

type AddressBook = {
  shipping: AddressType;
  billing: AddressType;
};

type Preferences = {
  newsletter: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  language: string;
  currency: string;
};

type Security = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type UserData = {
  personal: Personal;
  address: AddressBook;
  preferences: Preferences;
  security: Security;
};

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // User data state
  const [userData, setUserData] = useState<UserData>({
    personal: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+91 98765 43210',
      dateOfBirth: '1990-05-15',
      gender: 'male'
    },
    address: {
      shipping: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
        isDefault: true
      },
      billing: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
        isDefault: true
      }
    },
    preferences: {
      newsletter: true,
      smsNotifications: false,
      emailNotifications: true,
      language: 'english',
      currency: 'INR'
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Stats data
  const [stats, _setStats] = useState({
    memberSince: 'January 15, 2024',
    totalOrders: 12,
    completedOrders: 10,
    pendingOrders: 2,
    totalSpent: '₹12,450',
    loyaltyPoints: 1245,
    membershipTier: 'Gold Member'
  });

  // Handle form changes
  const handleInputChange = <K extends keyof UserData, F extends string>(section: K, field: F, value: any) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  // Handle address changes
  const handleAddressChange = <T extends keyof AddressBook, F extends string>(type: T, field: F, value: any) => {
    setUserData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [type]: {
          ...((prev.address as any)[type]),
          [field]: value
        }
      }
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsEditing(false);
    // Here you would typically make an API call to save the data
    console.log('Saving profile:', userData);
  };

  // Change password
  const handleChangePassword = async () => {
    if (userData.security.newPassword !== userData.security.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Reset password fields
    setUserData(prev => ({
      ...prev,
      security: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }));
    
    alert('Password changed successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <span className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white px-4 py-2 rounded-full text-sm font-medium">
                {stats.membershipTier}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {stats.loyaltyPoints} Points
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* User Profile Summary */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#5F3623] to-[#f5821f] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                    JD
                  </div>
                  <button className="absolute bottom-4 right-0 bg-white p-1 rounded-full shadow-lg border border-gray-200">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{userData.personal.firstName} {userData.personal.lastName}</h2>
                <p className="text-gray-600">{userData.personal.email}</p>
                <p className="text-sm text-gray-500 mt-1">Member since {stats.memberSince}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeTab === 'personal'
                      ? 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Personal Info</span>
                </button>

                <button
                  onClick={() => setActiveTab('address')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeTab === 'address'
                      ? 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Address Book</span>
                </button>

                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeTab === 'preferences'
                      ? 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Preferences</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeTab === 'security'
                      ? 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Security</span>
                </button>

                <button
                  onClick={() => setActiveTab('loyalty')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeTab === 'loyalty'
                      ? 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>Loyalty Program</span>
                </button>
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Account Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders:</span>
                    <span className="font-medium text-gray-900">{stats.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium text-green-600">{stats.completedOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-medium text-yellow-600">{stats.pendingOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spent:</span>
                    <span className="font-medium text-gray-900">{stats.totalSpent}</span>
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
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {activeTab === 'personal' && 'Personal Information'}
                    {activeTab === 'address' && 'Address Book'}
                    {activeTab === 'preferences' && 'Preferences'}
                    {activeTab === 'security' && 'Security Settings'}
                    {activeTab === 'loyalty' && 'Loyalty Program'}
                  </h2>
                  {activeTab !== 'loyalty' && activeTab !== 'security' && (
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isEditing
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white hover:opacity-90'
                      }`}
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div className="max-w-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={userData.personal.firstName}
                          onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={userData.personal.lastName}
                          onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={userData.personal.email}
                        onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={userData.personal.phone}
                        onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={userData.personal.dateOfBirth}
                          onChange={(e) => handleInputChange('personal', 'dateOfBirth', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                          value={userData.personal.gender}
                          onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className="px-6 py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Address Book Tab */}
                {activeTab === 'address' && (
                  <div className="space-y-8">
                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                          <input
                            type="text"
                            value={userData.address.shipping.street}
                            onChange={(e) => handleAddressChange('shipping', 'street', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            value={userData.address.shipping.city}
                            onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input
                            type="text"
                            value={userData.address.shipping.state}
                            onChange={(e) => handleAddressChange('shipping', 'state', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            value={userData.address.shipping.zipCode}
                            onChange={(e) => handleAddressChange('shipping', 'zipCode', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                          <input
                            type="text"
                            value={userData.address.shipping.country}
                            onChange={(e) => handleAddressChange('shipping', 'country', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          checked={userData.address.billing.isDefault}
                          onChange={(e) => handleAddressChange('billing', 'isDefault', e.target.checked)}
                          disabled={!isEditing}
                          className="w-4 h-4 text-[#5F3623] border-gray-300 rounded focus:ring-[#5F3623]"
                        />
                        <label className="ml-2 text-sm text-gray-700">Same as shipping address</label>
                      </div>
                      
                      {!userData.address.billing.isDefault && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                            <input
                              type="text"
                              value={userData.address.billing.street}
                              onChange={(e) => handleAddressChange('billing', 'street', e.target.value)}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100"
                            />
                          </div>
                          {/* ... other billing address fields ... */}
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className="px-6 py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="max-w-2xl space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">Email Newsletter</label>
                            <p className="text-sm text-gray-500">Receive updates about new products and offers</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={userData.preferences.newsletter}
                            onChange={(e) => handleInputChange('preferences', 'newsletter', e.target.checked)}
                            disabled={!isEditing}
                            className="w-4 h-4 text-[#5F3623] border-gray-300 rounded focus:ring-[#5F3623] disabled:bg-gray-100"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">SMS Notifications</label>
                            <p className="text-sm text-gray-500">Get order updates via SMS</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={userData.preferences.smsNotifications}
                            onChange={(e) => handleInputChange('preferences', 'smsNotifications', e.target.checked)}
                            disabled={!isEditing}
                            className="w-4 h-4 text-[#5F3623] border-gray-300 rounded focus:ring-[#5F3623] disabled:bg-gray-100"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                            <p className="text-sm text-gray-500">Receive order confirmations and shipping updates</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={userData.preferences.emailNotifications}
                            onChange={(e) => handleInputChange('preferences', 'emailNotifications', e.target.checked)}
                            disabled={!isEditing}
                            className="w-4 h-4 text-[#5F3623] border-gray-300 rounded focus:ring-[#5F3623] disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select
                          value={userData.preferences.language}
                          onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100"
                        >
                          <option value="english">English</option>
                          <option value="hindi">Hindi</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                          value={userData.preferences.currency}
                          onChange={(e) => handleInputChange('preferences', 'currency', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100"
                        >
                          <option value="INR">Indian Rupee (₹)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                          <option value="GBP">British Pound (£)</option>
                        </select>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className="px-6 py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {isLoading ? 'Saving...' : 'Save Preferences'}
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="max-w-2xl space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <input
                            type="password"
                            value={userData.security.currentPassword}
                            onChange={(e) => handleInputChange('security', 'currentPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <input
                            type="password"
                            value={userData.security.newPassword}
                            onChange={(e) => handleInputChange('security', 'newPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={userData.security.confirmPassword}
                            onChange={(e) => handleInputChange('security', 'confirmPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleChangePassword}
                        disabled={isLoading}
                        className="px-6 py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isLoading ? 'Updating...' : 'Change Password'}
                      </button>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-900">Enable 2FA</label>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loyalty Program Tab */}
                {activeTab === 'loyalty' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] rounded-2xl p-8 text-white">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{stats.membershipTier}</h3>
                          <p className="text-orange-100">You have {stats.loyaltyPoints} loyalty points</p>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                          <div className="text-3xl font-bold">{stats.loyaltyPoints}</div>
                          <div className="text-orange-100">Points Available</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                        <div className="text-3xl mb-3">🎁</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Redeem Points</h4>
                        <p className="text-sm text-gray-600 mb-4">Convert points to discount coupons</p>
                        <button className="w-full py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                          Redeem Now
                        </button>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                        <div className="text-3xl mb-3">📈</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Points History</h4>
                        <p className="text-sm text-gray-600 mb-4">View your points earning history</p>
                        <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                          View History
                        </button>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                        <div className="text-3xl mb-3">🏆</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Next Tier</h4>
                        <p className="text-sm text-gray-600 mb-4">500 points to Platinum tier</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] h-2 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Earn Points</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold">+10</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Product Review</div>
                            <div className="text-sm text-gray-600">per review</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">+50</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Refer a Friend</div>
                            <div className="text-sm text-gray-600">per successful referral</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold">+5</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Every ₹100 Spent</div>
                            <div className="text-sm text-gray-600">on purchases</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-semibold">+25</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Birthday Bonus</div>
                            <div className="text-sm text-gray-600">annual bonus</div>
                          </div>
                        </div>
                      </div>
                    </div>
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