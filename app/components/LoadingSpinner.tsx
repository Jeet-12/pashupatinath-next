
export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#5F3623] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading sacred content...</p>
      </div>
    </div>
  );
}