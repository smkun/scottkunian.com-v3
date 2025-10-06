import React from 'react';
import { signInWithGoogle, logout } from '../lib/auth';
import { useAuth } from '../hooks/useAuth';

const FirebaseTest: React.FC = () => {
  const { user, loading } = useAuth();

  const handleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result) {
      console.log('Sign in successful:', result);
    } else {
      console.log('Sign in failed');
    }
  };

  const handleSignOut = async () => {
    const success = await logout();
    if (success) {
      console.log('Sign out successful');
    } else {
      console.log('Sign out failed');
    }
  };

  if (loading) {
    return <div className="p-4">Loading authentication...</div>;
  }

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Firebase Authentication Test</h2>

      {user ? (
        <div className="space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800">✅ Authenticated</p>
            <p className="text-sm text-green-600 mt-1">
              Welcome, {user.displayName || user.email}
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800">⚠️ Not authenticated</p>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Sign In with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default FirebaseTest;