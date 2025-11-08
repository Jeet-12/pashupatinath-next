"use client";
import { useState, useEffect } from 'react';
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  UserProfile, 
  UserStats,
  UpdateProfileData,
  ChangePasswordData
} from '../../../libs/api';

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
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // User data state
  const [userData, setUserData] = useState<UserData>({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'prefer-not-to-say'
    },
    address: {
      shipping: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        isDefault: true
      },
      billing: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
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

  const [stats, setStats] = useState({
    memberSince: 'Loading...',
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSpent: '₹0',
    loyaltyPoints: 0,
    membershipTier: 'Loading...'
  });

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      setError(null);
      
      const response = await getUserProfile();
      
      if (response.success && response.data) {
        const { profile, stats: profileStats } = response.data;
        
        // Update user data from API
        const nameParts = profile.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        setUserData(prev => ({
          ...prev,
          personal: {
            firstName,
            lastName,
            email: profile.email,
            phone: profile.mobile || '',
            dateOfBirth: profile.date_of_birth || '',
            gender: profile.gender || 'prefer-not-to-say'
          }
        }));

        // Update stats from API
        setStats({
          memberSince: profileStats.member_since,
          totalOrders: profileStats.total_orders,
          completedOrders: profileStats.completed_orders,
          pendingOrders: profileStats.pending_orders,
          totalSpent: `₹${profileStats.total_spent.toLocaleString()}`,
          loyaltyPoints: profileStats.loyalty_points,
          membershipTier: profileStats.membership_tier
        });
      } else {
        setError(response.message || 'Failed to load profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProfileLoading(false);
    }
  };

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
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const updateData: UpdateProfileData = {
        name: `${userData.personal.firstName} ${userData.personal.lastName}`.trim(),
        email: userData.personal.email,
        mobile: userData.personal.phone,
        date_of_birth: userData.personal.dateOfBirth,
        gender: userData.personal.gender
      };

      const response = await updateUserProfile(updateData);

      if (response.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        // Refresh profile data
        await fetchUserProfile();
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (userData.security.newPassword !== userData.security.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const passwordData: ChangePasswordData = {
        current_password: userData.security.currentPassword,
        new_password: userData.security.newPassword,
        new_password_confirmation: userData.security.confirmPassword
      };

      const response = await changePassword(passwordData);

      if (response.success) {
        setSuccess('Password changed successfully!');
        
        // Reset password fields
        setUserData(prev => ({
          ...prev,
          security: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
        }));
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    const { firstName, lastName } = userData.personal;
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            {/* Loading skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
                <div className="lg:col-span-3">
                  <div className="bg-gray-200 rounded-lg h-96"></div>
                </div>
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
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>
            {/* <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <span className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white px-4 py-2 rounded-full text-sm font-medium">
                {stats.membershipTier}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {stats.loyaltyPoints} Points
              </span>
            </div> */}
          </div>
        </div>

        {/* Error and Success Messages */}
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

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-600 mt-1">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="ml-auto text-green-400 hover:text-green-600"
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
              {/* User Profile Summary */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#5F3623] to-[#f5821f] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                    {getInitials()}
                  </div>
                  <button className="absolute bottom-4 right-0 bg-white p-1 rounded-full shadow-lg border border-gray-200">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {userData.personal.firstName} {userData.personal.lastName}
                </h2>
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

                {/* ... other navigation buttons remain the same ... */}
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={userData.personal.lastName}
                          onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
                      />
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <input
                            type="password"
                            value={userData.security.newPassword}
                            onChange={(e) => handleInputChange('security', 'newPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={userData.security.confirmPassword}
                            onChange={(e) => handleInputChange('security', 'confirmPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent text-black"
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