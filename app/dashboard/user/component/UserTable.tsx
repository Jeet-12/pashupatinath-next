"use client";
import React from 'react';

const UserTable = () => {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
        { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'User', status: 'Active', joinDate: '2024-01-10' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Moderator', status: 'Inactive', joinDate: '2024-01-05' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'User', status: 'Active', joinDate: '2024-01-01' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Add New User
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Join Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-800">{user.name}</td>
                                <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                                <td className="py-3 px-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'Moderator' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">{user.joinDate}</td>
                                <td className="py-3 px-4 text-sm">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-500 hover:text-blue-700">Edit</button>
                                        <button className="text-red-500 hover:text-red-700">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;