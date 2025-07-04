import { atom } from 'jotai';
import { UserInfo, initialUserState } from '@/entities/user/types';

// 사용자 정보를 저장하는 atom
export const userAtom = atom<UserInfo>(initialUserState);

// 파생된 atom들 - 필요한 경우 사용
export const isAuthenticatedAtom = atom((get) => get(userAtom).isAuthenticated);

// 주소가 있는 경우에만 값을 반환
export const userAddressAtom = atom((get) => get(userAtom).address || '');

// 표시 이름 우선순위: displayName > address 일부 > 'Anonymous'
export const userDisplayNameAtom = atom((get) => {
  const user = get(userAtom);
  if (user.displayName) return user.displayName;
  if (user.address) return `${user.address.substring(0, 6)}...`;
  return 'Anonymous';
});
