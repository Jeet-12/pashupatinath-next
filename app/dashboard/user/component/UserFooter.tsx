"use client";
import React from 'react';

const UserFooter = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-4">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-600">
                        © 2025 Pashupatinath Rudraksh. All rights reserved.
                    </p>
                    <div className="flex space-x-4 mt-2 md:mt-0">
                        <a href="#" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">
                            User Guide
                        </a>
                        <a href="#" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">
                            Support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default UserFooter;