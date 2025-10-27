import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export function useRequireAuth() {
  const { isSignedIn, isLoaded } = useUser();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [promptFeature, setPromptFeature] = useState('tính năng này');

  const requireAuth = (callback: () => void, feature?: string) => {
    if (!isLoaded) return;

    if (isSignedIn) {
      callback();
    } else {
      setPromptFeature(feature || 'tính năng này');
      setShowSignInPrompt(true);
    }
  };

  return {
    requireAuth,
    showSignInPrompt,
    setShowSignInPrompt,
    promptFeature,
    isSignedIn,
    isLoaded,
  };
}
