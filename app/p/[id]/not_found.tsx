export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Paste not found</p>
        <p className="text-gray-500 mb-8">
          This paste may have expired or reached its view limit.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          Create a new paste
        </a>
      </div>
    </div>
  );
}