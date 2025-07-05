// src/entities/user/mockData.ts
import { UserData, UserRole } from "./types";

/**
 * 온체인 데이터 구조와 일치하는 사용자 목업 데이터
 * WrldReliefUser.sol의 User 구조체와 정확히 일치하는 형태
 */
export const MOCK_ONCHAIN_USERS: UserData[] = [
  {
    worldIdName: "user1.worldcoin.eth",
    worldIdVerified: true,
    activeRoles: {
      [UserRole.DONOR]: true,
      [UserRole.RECIPIENT]: false,
      [UserRole.ORGANIZER]: false
    },
    totalDonations: 5000000000, // wei 단위 (5 ETH)
    totalReceived: 0,
    wrlhTokenBalance: 500, // 500 WRLH 토큰
    createdAt: 1714435200 // 2024-05-01 (Unix timestamp)
  },
  {
    worldIdName: "recipient.worldcoin.eth",
    worldIdVerified: true,
    activeRoles: {
      [UserRole.DONOR]: false,
      [UserRole.RECIPIENT]: true,
      [UserRole.ORGANIZER]: false
    },
    totalDonations: 0,
    totalReceived: 2000000000, // wei 단위 (2 ETH)
    wrlhTokenBalance: 0,
    createdAt: 1717027200 // 2024-06-01 (Unix timestamp)
  },
  {
    worldIdName: "organizer.worldcoin.eth",
    worldIdVerified: true,
    activeRoles: {
      [UserRole.DONOR]: false,
      [UserRole.RECIPIENT]: false,
      [UserRole.ORGANIZER]: true
    },
    totalDonations: 1000000000, // wei 단위 (1 ETH)
    totalReceived: 0,
    wrlhTokenBalance: 1000, // 1000 WRLH 토큰
    createdAt: 1711756800 // 2024-04-01 (Unix timestamp)
  }
];
