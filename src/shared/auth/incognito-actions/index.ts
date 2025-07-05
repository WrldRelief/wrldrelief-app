import { ISuccessResult } from "@worldcoin/idkit";

// Define the IDKit configuration type based on the actual package
interface IDKitConfig {
  app_id: string;
  action: string;
  onSuccess: (result: ISuccessResult) => void;
  action_description?: string;
  nullifier_nonce?: string;
  verification_level?: "orb" | "device";
}

// 자동 생성된 Incognito Action 정보 타입
export interface IncognitoAction {
  id: string;
  name: string;
  description: string;
  created_at: string;
  status: string;
}

// 액션 생성 응답 타입
interface CreateActionResponse {
  success: boolean;
  action?: IncognitoAction;
  error?: string;
}

// 액션 조회 응답 타입
interface GetActionResponse {
  success: boolean;
  action?: IncognitoAction;
  error?: string;
}

/**
 * Generates a unique action ID for a specific campaign
 * This ensures each campaign has its own verification flow
 *
 * @param campaignId - The unique identifier for the campaign
 * @returns A string action ID in the format 'campaign-verification-{campaignId}'
 */
export const generateActionId = (campaignId: number | string): string => {
  return `campaign-verification-${campaignId}`;
};

/**
 * 특정 캠페인에 대한 Incognito Action을 자동으로 생성
 * 해당 캠페인에 대한 액션이 없는 경우에만 새로 생성
 *
 * @param campaignId - 캠페인 ID
 * @param name - 액션 이름 (선택적)
 * @param description - 액션 설명 (선택적)
 * @returns 생성된 액션 정보
 */
export const createIncognitoAction = async (
  campaignId: number | string,
  name?: string,
  description?: string
): Promise<IncognitoAction> => {
  try {
    // 먼저 해당 캠페인에 대한 액션이 이미 존재하는지 확인
    const existingAction = await getIncognitoAction(campaignId);
    if (existingAction) {
      return existingAction;
    }

    // 새 액션 생성
    const response = await fetch("/api/create-incognito-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaignId,
        name: name || `Campaign ${campaignId} Verification`,
        description:
          description || `Verify recipient for campaign ${campaignId}`,
      }),
    });

    const data = (await response.json()) as CreateActionResponse;

    if (!data.success || !data.action) {
      throw new Error(data.error || "Failed to create incognito action");
    }

    return data.action;
  } catch (error) {
    console.error("Error creating incognito action:", error);
    throw error;
  }
};

/**
 * 특정 캠페인에 대한 Incognito Action 정보 조회
 *
 * @param campaignId - 캠페인 ID
 * @returns 액션 정보 또는 null (액션이 없는 경우)
 */
export const getIncognitoAction = async (
  campaignId: number | string
): Promise<IncognitoAction | null> => {
  try {
    const response = await fetch(
      `/api/create-incognito-action?campaignId=${campaignId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = (await response.json()) as GetActionResponse;

    if (!data.success || !data.action) {
      return null;
    }

    return data.action;
  } catch (error) {
    console.error("Error fetching incognito action:", error);
    return null;
  }
};

/**
 * Creates configuration for Worldcoin's IDKit with Incognito Actions
 * 자동으로 생성된 액션 ID를 사용하거나, 없는 경우 생성
 *
 * @param campaignId - The unique identifier for the campaign
 * @param onSuccess - Callback function to execute when verification succeeds
 * @returns IDKitConfig object for the IDKit component
 */
export const createIncognitoActionConfig = async (
  campaignId: number | string,
  onSuccess: () => void
): Promise<IDKitConfig> => {
  // 해당 캠페인에 대한 액션을 가져오거나 생성
  let action: IncognitoAction;
  try {
    action = await createIncognitoAction(campaignId);
  } catch (error) {
    console.error("Failed to create/get action, using fallback:", error);
    // 실패 시 기본 액션 ID 사용
    return {
      app_id:
        process.env.NEXT_PUBLIC_APP_ID ||
        "app_staging_d4f9c8c1c1f0c0a0c0a0c0a0c0a0c0a0",
      action: generateActionId(campaignId),
      onSuccess,
      action_description: `Verify for aid distribution in campaign #${campaignId}`,
      nullifier_nonce: `campaign-${campaignId}`,
    };
  }

  return {
    app_id:
      process.env.NEXT_PUBLIC_APP_ID ||
      "app_staging_d4f9c8c1c1f0c0a0c0a0c0a0c0a0c0a0",
    action: action.id, // 자동 생성된 액션 ID 사용
    onSuccess,
    // Enable Incognito Actions mode
    action_description: action.description,
    // Use nullifier_nonce to prevent duplicate verifications for the same user in the same campaign
    nullifier_nonce: `campaign-${campaignId}`,
  };
};

/**
 * Verifies a proof from Worldcoin's IDKit
 * 자동 생성된 액션 ID를 사용하여 검증
 *
 * @param proof - The proof object from IDKit
 * @param campaignId - The campaign ID associated with this verification
 * @returns Promise resolving to verification result
 */
export const verifyProof = async (
  proof: ISuccessResult,
  campaignId: number | string
) => {
  try {
    // 해당 캠페인의 액션 정보 조회
    let actionId: string;
    try {
      const action = await getIncognitoAction(campaignId);
      actionId = action?.id || generateActionId(campaignId);
    } catch (error) {
      // 액션 조회 실패 시 기본 ID 사용
      actionId = generateActionId(campaignId);
    }

    // Call your backend API to verify the proof
    const response = await fetch("/api/verify-incognito-proof", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proof,
        action: actionId,
        campaignId, // 캠페인 ID도 함께 전송
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify proof");
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying proof:", error);
    throw error;
  }
};

/**
 * 특정 사용자가 특정 캠페인에 대해 인증되었는지 확인
 *
 * @param userId - 사용자 ID 또는 식별자
 * @param campaignId - 캠페인 ID
 * @returns 인증 여부
 */
export const checkUserVerification = async (
  userId: string,
  campaignId: number | string
): Promise<boolean> => {
  try {
    // 실제 구현에서는 백엔드 API를 호출하여 사용자 인증 상태 확인
    // 현재는 시뮬레이션만 수행
    return true;
  } catch (error) {
    console.error("Error checking user verification:", error);
    return false;
  }
};
