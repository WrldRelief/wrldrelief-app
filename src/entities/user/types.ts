// 사용자 정보 타입 정의

// Worldcoin MiniKit에서 반환하는 사용자 정보 타입
export interface WorldcoinUserInfo {
  id: string;
  address: string;
  profilePictureUrl?: string;
  displayName?: string;
  // 필요한 경우 더 많은 필드 추가 가능
}

export interface UserInfo {
  address?: string;
  profilePictureUrl?: string;
  displayName?: string;
  worldcoinInfo?: WorldcoinUserInfo | null;
  isAuthenticated: boolean;
}

// 초기 사용자 상태
export const initialUserState: UserInfo = {
  isAuthenticated: false,
};
