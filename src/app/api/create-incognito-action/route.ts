import { NextRequest, NextResponse } from "next/server";

// Worldcoin API 엔드포인트
const WORLDCOIN_API_BASE = "https://developer.worldcoin.org/api/v1";

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
    let actionData;
    
    // API 키가 있는 경우 실제 API 호출
    if (process.env.WORLDCOIN_API_KEY) {
      try {
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
        
        actionData = await response.json();
        console.log("Action created successfully:", actionData);
      } catch (apiError) {
        console.error("Error calling Worldcoin API:", apiError);
        // API 호출 실패 시 시뮬레이션된 응답으로 폴백
        actionData = {
          id: actionId,
          name: name || `Campaign ${campaignId} Verification`,
          description: description || `Verify recipient for campaign ${campaignId}`,
          created_at: new Date().toISOString(),
          status: "active",
        };
      }
    } else {
      // API 키가 없는 경우 시뮬레이션된 응답 사용
      actionData = {
        id: actionId,
        name: name || `Campaign ${campaignId} Verification`,
        description: description || `Verify recipient for campaign ${campaignId}`,
        created_at: new Date().toISOString(),
        status: "active",
      };
    }

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

    // 사용자가 이미 생성한 Incognito Action의 identifier 사용
    const actionId = "claim-aid";
    
    // Worldcoin API를 사용하여 액션 조회 또는 생성
    let action;
    
    if (process.env.WORLDCOIN_API_KEY) {
      try {
        // 먼저 액션이 존재하는지 확인
        const checkResponse = await fetch(`${WORLDCOIN_API_BASE}/action/${actionId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${process.env.WORLDCOIN_API_KEY}`
          }
        });
        
        if (checkResponse.ok) {
          // 액션이 존재하면 반환
          action = await checkResponse.json();
          console.log("Existing action found:", action);
        } else {
          // 액션이 없으면 새로 생성
          const createResponse = await fetch(`${WORLDCOIN_API_BASE}/action`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.WORLDCOIN_API_KEY}`
            },
            body: JSON.stringify({
              action_id: actionId,
              name: `Campaign ${campaignId} Verification`,
              description: `Verify recipient for campaign ${campaignId}`,
              action_type: "incognito"
            })
          });
          
          if (!createResponse.ok) {
            throw new Error(`Failed to create action: ${await createResponse.text()}`);
          }
          
          action = await createResponse.json();
          console.log("New action created:", action);
        }
      } catch (apiError) {
        console.error("Error with Worldcoin API:", apiError);
        // API 호출 실패 시 시뮬레이션된 응답으로 폴백
        action = {
          id: actionId,
          name: `Campaign ${campaignId} Verification`,
          description: `Verify recipient for campaign ${campaignId}`,
          created_at: new Date().toISOString(),
          status: "active",
        };
      }
    } else {
      // API 키가 없는 경우 시뮬레이션된 응답 사용
      action = {
        id: actionId,
        name: `Campaign ${campaignId} Verification`,
        description: `Verify recipient for campaign ${campaignId}`,
        created_at: new Date().toISOString(),
        status: "active",
      };
    }

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
