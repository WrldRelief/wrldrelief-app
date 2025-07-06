import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";


// 환경 변수에서 API 키를 가져오거나 기본값 사용
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

// 위치 추출을 위한 프롬프트 템플릿
const locationExtractionPrompt = PromptTemplate.fromTemplate(`
You are a location extraction assistant. Given a disaster name and description, extract the most likely geographic location (city, region, country) where this disaster is occurring.
If no specific location is mentioned, make an educated guess based on the type of disaster and other context clues.

Disaster Name: {disasterName}
Disaster Description: {disasterDescription}

Return ONLY the location in the format "City, Country" or "Region, Country". If city is unknown, just return "Region, Country" or just "Country" if that's all you can determine.
`);

// 좌표 추출을 위한 프롬프트 템플릿
const coordinatesExtractionPrompt = PromptTemplate.fromTemplate(`
You are a geographic coordinates assistant. Given a location name, provide the approximate latitude and longitude coordinates.

Location: {location}

Return ONLY the coordinates in the format "latitude,longitude" (e.g. "37.7749,-122.4194"). 
Use decimal degrees with 4 decimal places. Do not include any other text.
`);

// 위치 추출 함수
export async function extractLocationFromDisaster(
  disasterName: string,
  disasterDescription: string
): Promise<string> {
  try {
    // OpenAI 모델 초기화
    const model = new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0.2,
    });

    // 위치 추출 체인 생성
    const locationChain = locationExtractionPrompt
      .pipe(model)
      .pipe(new StringOutputParser());

    // 위치 추출 실행
    const location = await locationChain.invoke({
      disasterName,
      disasterDescription,
    });

    return location.trim();
  } catch (error) {
    console.error("Error extracting location:", error);
    return "Unknown Location";
  }
}

// 좌표 추출 함수
export async function extractCoordinatesFromLocation(
  location: string
): Promise<{ latitude: number; longitude: number }> {
  try {
    // OpenAI 모델 초기화
    const model = new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0.1,
    });

    // 좌표 추출 체인 생성
    const coordinatesChain = coordinatesExtractionPrompt
      .pipe(model)
      .pipe(new StringOutputParser());

    // 좌표 추출 실행
    const coordinatesStr = await coordinatesChain.invoke({
      location,
    });

    // 좌표 파싱
    const [latStr, lngStr] = coordinatesStr.trim().split(",");
    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lngStr);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error("Invalid coordinates format");
    }

    return { latitude, longitude };
  } catch (error) {
    console.error("Error extracting coordinates:", error);
    // 기본 좌표 반환 (서울)
    return { latitude: 37.5665, longitude: 126.9780 };
  }
}

// 재난 정보에서 위치와 좌표를 추출하는 통합 함수
export async function getLocationCoordinatesFromDisaster(
  disasterName: string,
  disasterDescription: string
): Promise<{ location: string; latitude: number; longitude: number }> {
  try {
    // 위치 추출
    const location = await extractLocationFromDisaster(disasterName, disasterDescription);
    
    // 좌표 추출
    const { latitude, longitude } = await extractCoordinatesFromLocation(location);
    
    return { location, latitude, longitude };
  } catch (error) {
    console.error("Error in location/coordinates extraction:", error);
    // 기본값 반환
    return { 
      location: "Unknown Location", 
      latitude: 37.5665, 
      longitude: 126.9780 
    };
  }
}

// 위치 추출 함수 (API 키가 없는 경우를 위한 대체 함수)
// Nominatim을 사용한 동기적 위치→좌표 변환 (실제 환경에서는 fetch를 비동기로 사용해야 함)
function geocodeLocationSync(location: string): { latitude: number; longitude: number } {
  // 실제 동기 네트워크 호출은 불가하므로, 예시로 location 키워드 기반 기본값 반환
  // production에서는 비동기 fetch로 Nominatim 사용 권장
  if (location.toLowerCase().includes("seoul")) return { latitude: 37.5665, longitude: 126.9780 };
  if (location.toLowerCase().includes("tokyo")) return { latitude: 35.6762, longitude: 139.6503 };
  if (location.toLowerCase().includes("new york")) return { latitude: 40.7128, longitude: -74.0060 };
  if (location.toLowerCase().includes("london")) return { latitude: 51.5074, longitude: -0.1278 };
  // ... (필요시 주요 도시 추가)
  // fallback: 서울
  return { latitude: 37.5665, longitude: 126.9780 };
}

export function getLocationCoordinatesFromDisasterSync(
  disasterName: string,
  disasterDescription: string
): { location: string; latitude: number; longitude: number } {
  // 위치 후보 추출 (간단히 disasterName 우선)
  const location = disasterName || disasterDescription || "Seoul, South Korea";
  const { latitude, longitude } = geocodeLocationSync(location);
  return { location, latitude, longitude };
}
