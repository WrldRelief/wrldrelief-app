// src/entities/sbt/mockData.ts
// 이 파일은 목업 데이터를 사용하지 않고 온체인 데이터만 사용합니다.

import { SBTData } from "./types";

// 목업 데이터는 제거하고 온체인 데이터만 사용합니다.
// 하지만 기존 코드와의 호환성을 위해 빈 배열로 유지합니다.
export const MOCK_ONCHAIN_SBTS: SBTData[] = [];

// 실제 SBT 데이터는 contracts/hooks.ts에서 가져와야 합니다.
