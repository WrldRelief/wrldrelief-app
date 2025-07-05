// src/entities/disaster/mockOnChainData.ts
import { DisasterData, DisasterStatus } from "./types";

/**
 * 온체인 데이터 구조와 일치하는 재난 목업 데이터
 * DisasterRegistry.sol의 Disaster 구조체와 정확히 일치하는 형태
 */
export const MOCK_ONCHAIN_DISASTERS: DisasterData[] = [
  {
    id: "turkey-earthquake-001",
    name: "Turkey Earthquake 2023",
    description: "A devastating 7.8 magnitude earthquake struck southeastern Turkey near the Syrian border, causing widespread destruction and thousands of casualties.",
    location: "Southeastern Turkey, Syrian border region",
    startDate: 1675641600, // 2023-02-06 (Unix timestamp)
    endDate: 0, // 아직 종료되지 않음
    imageUrl: "/images/mock_turkey_earthquake.jpg",
    externalSource: "https://example.com/turkey-earthquake-2023",
    status: DisasterStatus.ACTIVE,
    createdAt: 1675641600, // 2023-02-06 (Unix timestamp)
    updatedAt: 1675728000, // 2023-02-07 (Unix timestamp)
    createdBy: "0x1234567890123456789012345678901234567890" // 예시 이더리움 주소
  },
  {
    id: "israel-iran-war-001",
    name: "Tehran Airstrikes",
    description: "Israeli airstrikes in Tehran have resulted in hundreds of civilian casualties and mass displacement. Infrastructure and fuel depots have been severely damaged.",
    location: "Tehran, Iran",
    startDate: 1717027200, // 2024-06-01 (Unix timestamp)
    endDate: 0, // 아직 종료되지 않음
    imageUrl: "/images/mock_tehran_conflict.jpg",
    externalSource: "https://example.com/tehran-airstrikes-2024",
    status: DisasterStatus.ACTIVE,
    createdAt: 1717027200, // 2024-06-01 (Unix timestamp)
    updatedAt: 1717113600, // 2024-06-02 (Unix timestamp)
    createdBy: "0x2345678901234567890123456789012345678901" // 예시 이더리움 주소
  },
  {
    id: "israel-iran-war-002",
    name: "Haifa Missile Attack",
    description: "Iranian missile strikes have hit residential areas in Haifa, causing civilian deaths, injuries, and destruction of homes.",
    location: "Haifa, Israel",
    startDate: 1717200000, // 2024-06-03 (Unix timestamp)
    endDate: 0, // 아직 종료되지 않음
    imageUrl: "/images/mock_haifa_attack.jpg",
    externalSource: "https://example.com/haifa-missile-attack-2024",
    status: DisasterStatus.ACTIVE,
    createdAt: 1717200000, // 2024-06-03 (Unix timestamp)
    updatedAt: 1717286400, // 2024-06-04 (Unix timestamp)
    createdBy: "0x3456789012345678901234567890123456789012" // 예시 이더리움 주소
  },
  {
    id: "ukraine-war-001",
    name: "Kremenchuk Energy Attack",
    description: "Russian missile strikes have targeted critical energy infrastructure in Kremenchuk, leaving thousands without power during winter.",
    location: "Kremenchuk, Ukraine",
    startDate: 1717372800, // 2024-06-05 (Unix timestamp)
    endDate: 0, // 아직 종료되지 않음
    imageUrl: "/images/mock_kremenchuk_attack.jpg",
    externalSource: "https://example.com/kremenchuk-energy-attack-2024",
    status: DisasterStatus.ACTIVE,
    createdAt: 1717372800, // 2024-06-05 (Unix timestamp)
    updatedAt: 1717459200, // 2024-06-06 (Unix timestamp)
    createdBy: "0x4567890123456789012345678901234567890123" // 예시 이더리움 주소
  }
];

/**
 * 온체인 데이터와 UI 데이터를 매핑하는 유틸리티 함수
 * 온체인 데이터를 UI에 표시하기 위한 확장 데이터로 변환
 */
export const mapOnChainToUIData = (onChainData: DisasterData[]) => {
  // 여기서 온체인 데이터를 UI 데이터로 변환하는 로직 구현
  // 필요시 구현
};
