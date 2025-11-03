"use client";

import { useState, useEffect } from 'react';

export default function UserCouponsPage() {
  const [activeTab, setActiveTab] = useState('coupons');
  const [coupons, setCoupons] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: '₹0.00',
    successfulReferrals: 0,
    withdrawableAmount: '₹0.00',
    totalReferrals: 0,
    pendingReferrals: 0
  });

  // Mock coupons data
  const mockCoupons = [
    {
      id: 'COUP-001',
      code: 'WELCOME20',
      discount: '20%',
      type: 'percentage',
      description: 'Get 20% off on your first order',
      minAmount: '₹499',
      validUntil: '2024-04-30',
      status: 'active',
      used: false
    },
    {
      id: 'COUP-002',
      code: 'FREESHIP',
      discount: 'Free Shipping',
      type: 'shipping',
      description: 'Free shipping on orders above ₹999',
      minAmount: '₹999',
      validUntil: '2024-05-15',
      status: 'active',
      used: false
    },
    {
      id: 'COUP-003',
      code: 'RUDRA50',
      discount: '₹50',
      type: 'fixed',
      description: 'Flat ₹50 off on Rudraksha products',
      minAmount: '₹299',
      validUntil: '2024-04-20',
      status: 'active',
      used: true
    },
    {
      id: 'COUP-004',
      code: 'SPIRIT100',
      discount: '₹100',
      type: 'fixed',
      description: 'Flat ₹100 off on spiritual items',
      minAmount: '₹799',
      validUntil: '2024-03-31',
      status: 'expired',
      used: false
    },
    {
      id: 'COUP-005',
      code: 'MALA15',
      discount: '15%',
      type: 'percentage',
      description: '15% off on all Mala products',
      minAmount: '₹399',
      validUntil: '2024-05-01',
      status: 'active',
      used: false
    }
  ];

  // Mock referrals data
  const mockReferrals = [
    {
      id: 'REF-001',
      friendName: 'Rajesh Kumar',
      friendEmail: 'rajesh@example.com',
      signupDate: '2024-03-15',
      status: 'successful',
      orderAmount: '₹1,499',
      commission: '₹149',
      completedDate: '2024-03-20'
    },
    {
      id: 'REF-002',
      friendName: 'Priya Sharma',
      friendEmail: 'priya@example.com',
      signupDate: '2024-03-12',
      status: 'pending',
      orderAmount: '-',
      commission: '₹0',
      completedDate: '-'
    },
    {
      id: 'REF-003',
      friendName: 'Amit Patel',
      friendEmail: 'amit@example.com',
      signupDate: '2024-03-10',
      status: 'successful',
      orderAmount: '₹2,999',
      commission: '₹299',
      completedDate: '2024-03-18'
    },
    {
      id: 'REF-004',
      friendName: 'Sneha Reddy',
      friendEmail: 'sneha@example.com',
      signupDate: '2024-03-08',
      status: 'pending',
      orderAmount: '-',
      commission: '₹0',
      completedDate: '-'
    },
    {
      id: 'REF-005',
      friendName: 'Vikram Singh',
      friendEmail: 'vikram@example.com',
      signupDate: '2024-03-05',
      status: 'failed',
      orderAmount: '-',
      commission: '₹0',
      completedDate: '-'
    }
  ];

  useEffect(() => {
    // Simulate API calls
    setCoupons(mockCoupons);
    setReferrals(mockReferrals);
    setStats({
      totalEarnings: '₹448.00',
      successfulReferrals: 2,
      withdrawableAmount: '₹448.00',
      totalReferrals: 5,
      pendingReferrals: 2
    });
    // mockCoupons and mockReferrals are stable local constants used only to seed state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter coupons by status
  const activeCoupons = coupons.filter(coupon => coupon.status === 'active' && !coupon.used);
  const usedCoupons = coupons.filter(coupon => coupon.used);
  const expiredCoupons = coupons.filter(coupon => coupon.status === 'expired');

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'successful': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Copy coupon code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // You can add a toast notification here
    // alert(`Coupon code ${code} copied to clipboard!`);
  };

  // Share referral link
  const shareReferral = () => {
    const referralLink = 'https://pashupatinathrudraksh.com/ref/JohnDoe123';
    navigator.clipboard.writeText(referralLink);
    // alert('Referral link copied to clipboard! Share it with your friends.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Coupons & Referrals</h1>
          <p className="text-gray-600 mt-2">Manage your coupons and earn through referrals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successfulReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Withdrawable Amount</p>
                <p className="text-2xl font-bold text-gray-900">{stats.withdrawableAmount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Banner */}
        <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-2xl font-bold mb-2">Refer Friends & Earn Rewards</h2>
              <p className="text-orange-100 mb-4">
                Get 10% commission when your friends make their first purchase
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>₹100 minimum commission</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>No limit on referrals</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={shareReferral}
                className="px-6 py-3 bg-white text-[#5F3623] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Copy Referral Link
              </button>
              <button className="px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
                Share on Social
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('coupons')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'coupons'
                    ? 'border-[#5F3623] text-[#5F3623]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Coupons
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {coupons.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('referrals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'referrals'
                    ? 'border-[#5F3623] text-[#5F3623]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Referral History
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {referrals.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'withdraw'
                    ? 'border-[#5F3623] text-[#5F3623]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Withdraw Earnings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Coupons Tab */}
            {activeTab === 'coupons' && (
              <div>
                {/* Coupon Categories */}
                <div className="flex space-x-4 mb-6">
                  <button className="px-4 py-2 bg-[#5F3623] text-white rounded-lg text-sm font-medium">
                    All Coupons
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Active ({activeCoupons.length})
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Used ({usedCoupons.length})
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Expired ({expiredCoupons.length})
                  </button>
                </div>

                {/* Coupons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coupons.map((coupon) => (
                    <div key={coupon.id} className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#5F3623] transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(coupon.status)}`}>
                            {coupon.used ? 'Used' : coupon.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{coupon.discount}</div>
                          <div className="text-sm text-gray-600">OFF</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{coupon.description}</h3>
                        <p className="text-sm text-gray-600">Min. order: {coupon.minAmount}</p>
                        <p className="text-sm text-gray-600">Valid until: {new Date(coupon.validUntil).toLocaleDateString()}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <code className="text-lg font-mono font-bold text-gray-900">{coupon.code}</code>
                          <button
                            onClick={() => copyToClipboard(coupon.code)}
                            className="text-[#5F3623] hover:text-[#f5821f] transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        disabled={coupon.used || coupon.status === 'expired'}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          coupon.used || coupon.status === 'expired'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white hover:opacity-90'
                        }`}
                      >
                        {coupon.used ? 'Already Used' : coupon.status === 'expired' ? 'Expired' : 'Copy Code'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* No Coupons */}
                {coupons.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-white">🎫</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No coupons available</h3>
                    <p className="text-gray-600 mb-6">You don't have any active coupons at the moment.</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity">
                      Explore Offers
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Referrals Tab */}
            {activeTab === 'referrals' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Friend
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Signup Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Commission
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {referrals.map((referral) => (
                        <tr key={referral.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{referral.friendName}</div>
                              <div className="text-sm text-gray-500">{referral.friendEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(referral.signupDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                              {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {referral.orderAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {referral.commission}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* No Referrals */}
                {referrals.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-white">👥</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No referrals yet</h3>
                    <p className="text-gray-600 mb-6">Start referring friends to earn commissions!</p>
                    <button
                      onClick={shareReferral}
                      className="px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Get Referral Link
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Withdraw Tab */}
            {activeTab === 'withdraw' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] rounded-2xl p-8 text-white mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{stats.withdrawableAmount}</div>
                    <p className="text-orange-100">Available for withdrawal</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Earnings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Amount</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          type="number"
                          max={parseFloat(stats.withdrawableAmount.replace('₹', '').replace(',', ''))}
                          placeholder="Enter amount"
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Maximum: {stats.withdrawableAmount}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#5F3623] transition-colors text-center">
                          <div className="text-2xl mb-2">🏦</div>
                          <div className="font-medium text-gray-900">Bank Transfer</div>
                        </button>
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#5F3623] transition-colors text-center">
                          <div className="text-2xl mb-2">📱</div>
                          <div className="font-medium text-gray-900">UPI</div>
                        </button>
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#5F3623] transition-colors text-center">
                          <div className="text-2xl mb-2">💳</div>
                          <div className="font-medium text-gray-900">PayPal</div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Details</label>
                      <input
                        type="text"
                        placeholder="Enter account number or UPI ID"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
                      />
                    </div>

                    <button className="w-full py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                      Request Withdrawal
                    </button>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm text-yellow-800">
                          Withdrawal requests are processed within 3-5 business days. Minimum withdrawal amount is ₹100.
                        </p>
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
  );
}