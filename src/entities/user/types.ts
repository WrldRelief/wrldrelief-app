/**
 * User 엔티티 타입 정의
 * 스마트 컨트랙트 WrldReliefUser.sol의 User 구조체와 정확히 일치
 */

// 스마트 컨트랙트의 enum과 일치하는 타입 정의
export enum UserRole {
  DONOR = 0,
  RECIPIENT = 1,
  ORGANIZER = 2
}

// 스마트 컨트랙트의 RoleTransition 구조체와 일치하는 인터페이스
export interface RoleTransition {
  fromRole: UserRole;
  toRole: UserRole;
  timestamp: number; // uint256 in Solidity, Unix timestamp
  triggeredBy: string; // address in Solidity, 이더리움 주소 형식의 문자열
  reason: string;
}

// 스마트 컨트랙트의 User 구조체와 일치하는 인터페이스
export interface UserData {
  worldIdName: string;
  worldIdVerified: boolean;
  activeRoles: Record<UserRole, boolean>; // mapping(UserRole => bool) in Solidity
  totalDonations: number; // uint256 in Solidity
  totalReceived: number; // uint256 in Solidity
  wrlhTokenBalance: number; // uint256 in Solidity
  createdAt: number; // uint256 in Solidity, Unix timestamp
}

// Worldcoin MiniKit에서 반환하는 사용자 정보 타입
export interface WorldcoinUserInfo {
  id: string;
  address: string;
  profilePictureUrl?: string;
  displayName?: string;
  // 필요한 경우 더 많은 필드 추가 가능
}

// 프론트엔드 확장 타입 - 원래 사용하던 UserInfo 인터페이스
export interface UserInfoExtended {
  address?: string;
  profilePictureUrl?: string;
  displayName?: string;
  worldcoinInfo?: WorldcoinUserInfo | null;
  isAuthenticated: boolean;
  
  // 스마트 컨트랙트 필드와 매핑할 수 있는 추가 필드
  worldIdName?: string;
  worldIdVerified?: boolean;
  activeRoles?: Record<UserRole, boolean>;
  totalDonations?: number;
  totalReceived?: number;
  wrlhTokenBalance?: number;
  createdAt?: number;
}

// 초기 사용자 상태
export const initialUserState: UserInfoExtended = {
  isAuthenticated: false,
};
