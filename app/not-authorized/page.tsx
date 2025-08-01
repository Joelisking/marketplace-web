export default function NotAuthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold mb-4">Not Authorized</h1>
      <p className="text-gray-500 mb-6">
        You do not have permission to access this page.
        <br />
        If you believe this is a mistake, please contact support.
      </p>
      <a
        href="/"
        className="text-blue-600 underline hover:text-blue-800 transition-colors">
        Go back to Home
      </a>
    </div>
  );
}
