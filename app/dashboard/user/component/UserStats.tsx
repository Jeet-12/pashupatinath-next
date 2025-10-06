"use client";
import React from 'react';

const UserStats = () => {
    const userStats = [
        { title: 'Total Users', value: '1,847', icon: '👥', change: '+12%', color: 'blue' },
        { title: 'Active Users', value: '1,234', icon: '✅', change: '+8%', color: 'green' },
        { title: 'New Users', value: '156', icon: '🆕', change: '+5%', color: 'purple' },
        { title: 'Pending', value: '23', icon: '⏳', change: '-2%', color: 'orange' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {userStats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            <p className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'} mt-2`}>
                                {stat.change} from last week
                            </p>
                        </div>
                        <div className={`text-3xl p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-500`}>
                            {stat.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserStats;