export * from "./types";
export * from "./mockData";
export * from "./mockOnChainData";

// 이전 DisasterLocation을 DisasterLocationExtended로 재정의하여 기존 코드 호환성 유지
import { DisasterLocationExtended } from "./types";
export type DisasterLocation = DisasterLocationExtended;
