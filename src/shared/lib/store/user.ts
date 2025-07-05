import { atom } from 'jotai';
import { UserData, UserInfoExtended, initialUserState } from '@/entities/user/types';

// 사용자 정보를 저장하는 atom - 스마트 컨트랙트와 일치하는 타입 사용
export const userAtom = atom<UserInfoExtended>(initialUserState);

// 스마트 컨트랙트 데이터를 저장하는 atom
export const userContractDataAtom = atom<UserData | null>(null);

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
