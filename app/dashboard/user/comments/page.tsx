
import React from 'react';
import Link from 'next/link';

export default function CommentsPage() {
	return (
		<div className="p-6 bg-white rounded-2xl shadow">
			<h1 className="text-xl font-bold text-amber-900 mb-2">User Comments</h1>
			<p className="text-sm text-gray-600">No comments to show right now.</p>
			<div className="mt-4">
				<Link href="/dashboard/user" className="text-amber-600 hover:underline">
					Back to dashboard
				</Link>
			</div>
		</div>
	);
}
