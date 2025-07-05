import { NextRequest, NextResponse } from "next/server";

// Worldcoin API 엔드포인트
// const WORLDCOIN_API_BASE = "https://developer.worldcoin.org/api/v1";

/**
 * 캠페인별 Incognito Action을 자동으로 생성하는 API
 *
 * @param req - 요청 객체 (campaignId, name, description 포함)
 * @returns 생성된 Action 정보
 */
export async function POST(req: NextRequest) {
  try {
    const { campaignId, name, description } = await req.json();

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    // Action ID 형식: campaign_{campaignId}_{timestamp}
    const actionId = `campaign_${campaignId}_${Date.now()}`;

    // Worldcoin API를 사용하여 Incognito Action 생성
    // 실제 구현에서는 Worldcoin Developer Portal API 키가 필요합니다
    // 현재는 시뮬레이션만 수행합니다

    // 실제 API 호출 코드 (API 키가 있을 경우)
    /*
    const response = await fetch(`${WORLDCOIN_API_BASE}/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.WORLDCOIN_API_KEY}`
      },
      body: JSON.stringify({
        action_id: actionId,
        name: name || `Campaign ${campaignId} Verification`,
        description: description || `Verify recipient for campaign ${campaignId}`,
        action_type: "incognito"
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create action: ${JSON.stringify(errorData)}`);
    }
    
    const actionData = await response.json();
    */

    // 시뮬레이션된 응답 (실제 API 구현 전까지 사용)
    const actionData = {
      id: actionId,
      name: name || `Campaign ${campaignId} Verification`,
      description: description || `Verify recipient for campaign ${campaignId}`,
      created_at: new Date().toISOString(),
      status: "active",
    };

    // 데이터베이스에 액션 정보 저장 (실제 구현 필요)
    // await db.actions.create({ actionId, campaignId, ...actionData });

    return NextResponse.json({
      success: true,
      action: actionData,
    });
  } catch (error) {
    console.error("Error creating incognito action:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * 특정 캠페인의 Incognito Action 정보를 조회하는 API
 *
 * @param req - 요청 객체
 * @returns Action 정보
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const campaignId = url.searchParams.get("campaignId");

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    // 데이터베이스에서 캠페인에 연결된 액션 조회 (실제 구현 필요)
    // const action = await db.actions.findFirst({ where: { campaignId } });

    // 시뮬레이션된 응답 (실제 DB 구현 전까지 사용)
    const actionId = `campaign_${campaignId}_${Date.now()}`;
    const action = {
      id: actionId,
      name: `Campaign ${campaignId} Verification`,
      description: `Verify recipient for campaign ${campaignId}`,
      created_at: new Date().toISOString(),
      status: "active",
    };

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      action,
    });
  } catch (error) {
    console.error("Error fetching incognito action:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
