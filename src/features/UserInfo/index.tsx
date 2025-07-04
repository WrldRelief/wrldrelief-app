'use client';
import { CircularIcon, Marble } from '@worldcoin/mini-apps-ui-kit-react';
import { CheckCircleSolid } from 'iconoir-react';
import { usePrivy } from '@privy-io/react-auth';
import { MiniKit } from '@worldcoin/minikit-js';
import { useEffect, useState } from 'react';

/**
 * Minikit is only available on client side. Thus user info needs to be rendered on client side.
 * UserInfo component displays user information including profile picture, username, and verification status.
 * It uses the Marble component from the mini-apps-ui-kit-react library to display the profile picture.
 * This version uses Privy authentication instead of Next Auth.
 * The component is client-side rendered.
 */
export const UserInfo = () => {
  // Fetching the user state from Privy
  const { user, authenticated } = usePrivy();
  // Define proper type for Worldcoin user
  interface WorldcoinUserInfo {
    username?: string;
    profilePictureUrl?: string;
    walletAddress?: string;
  }
  
  const [worldcoinUser, setWorldcoinUser] = useState<WorldcoinUserInfo | null>(null);
  
  // Fetch additional user info from Worldcoin if we have a wallet address
  useEffect(() => {
    const fetchWorldcoinUserInfo = async () => {
      if (authenticated && user?.wallet?.address) {
        try {
          const userInfo = await MiniKit.getUserByAddress(user.wallet.address);
          setWorldcoinUser(userInfo);
        } catch (error) {
          console.error('Failed to fetch Worldcoin user info:', error);
        }
      }
    };
    
    fetchWorldcoinUserInfo();
  }, [authenticated, user?.wallet?.address]);

  // Extract user display data from either Privy or Worldcoin
  const displayName = worldcoinUser?.username || user?.wallet?.address?.substring(0, 8) || 'Anonymous';
  const profilePicture = worldcoinUser?.profilePictureUrl || undefined;
  
  return (
    <div className="flex flex-row items-center justify-start gap-4 rounded-xl w-full border-2 border-gray-200 p-4">
      <Marble src={profilePicture} className="w-14" />
      <div className="flex flex-row items-center justify-center">
        <span className="text-lg font-semibold capitalize">
          {displayName}
        </span>
        {authenticated && (
          <CircularIcon size="sm" className="ml-0">
            <CheckCircleSolid className="text-blue-600" />
          </CircularIcon>
        )}
      </div>
    </div>
  );
};
