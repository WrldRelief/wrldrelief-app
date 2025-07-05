import React, { useState, useEffect } from "react";
import { createIncognitoAction, verifyProof } from "@/shared/auth/incognito-actions";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import dynamic from "next/dynamic";

// IDKit 위젯을 클라이언트 사이드에서만 렌더링하도록 설정
const DynamicIDKitWidget = dynamic(
  () => import("@worldcoin/idkit").then((mod) => mod.IDKitWidget),
  { ssr: false }
);

interface WorldcoinVerificationProps {
  campaignId: number | string;
  onSuccess: () => void;
  onError?: (error: Error) => void;
  buttonText?: string;
  className?: string;
  userRole?: string; // 사용자 역할 (recipient, donor, organization)
}

/**
 * A component for Worldcoin identity verification using automatically generated Incognito Actions
 * Optimized for both Mini Apps and regular web environments
 */
const WorldcoinVerification: React.FC<WorldcoinVerificationProps> = ({
  campaignId,
  onSuccess,
  onError,
  buttonText = "Verify Identity",
  className = "",
  userRole = "recipient", // 기본값은 recipient
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [isMiniApp, setIsMiniApp] = useState<boolean>(false);
  
  // 컴포넌트 마운트 시 환경 확인 및 액션 생성
  useEffect(() => {
    // 미니 앱 환경인지 확인 (window.MiniKit이 있는지)
    const checkEnvironment = () => {
      // 테스트를 위해 현재는 미니 앱 환경이 아닌 것으로 설정
      // 실제 미니 앱에서는 window.MiniKit을 확인해야 함
      const isMiniAppEnv = false;
      console.log("미니 앱 환경 감지:", isMiniAppEnv);
      setIsMiniApp(isMiniAppEnv);
      return isMiniAppEnv;
    };
    
    // 캠페인에 대한 Incognito Action 생성 또는 조회
    const setupAction = async () => {
      try {
        // 액션 생성 또는 조회
        const action = await createIncognitoAction(
          campaignId,
          `Campaign ${campaignId} Verification for ${userRole}`,
          `Verify ${userRole} for campaign ${campaignId}`
        );
        
        setActionId(action.id);
        return action.id;
      } catch (error) {
        console.error("Failed to setup action:", error);
        return null;
      }
    };
    
    const init = async () => {
      const isMinApp = checkEnvironment();
      console.log("액션 설정 시작");
      const actionResult = await setupAction();
      console.log("액션 설정 완료:", actionResult);
    };
    
    init();
  }, [campaignId, userRole]);
  
  // IDKit 위젯에서 검증 성공 시 호출되는 함수
  const handleVerify = async (proof: ISuccessResult) => {
    try {
      setIsVerifying(true);
      
      // 백엔드에서 검증
      await verifyProof(proof, campaignId);
      
      // 성공 콜백 호출
      onSuccess();
    } catch (error) {
      console.error("Verification failed:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsVerifying(false);
    }
  };
  
  // 미니 앱 환경에서 직접 검증 처리
  const handleMiniAppVerification = async () => {
    try {
      setIsVerifying(true);
      
      // 미니 앱 환경에서는 이미 인증되어 있으므로 직접 검증 처리
      // 실제 구현에서는 백엔드와 통신하여 검증 상태 확인 필요
      
      // 시뮬레이션된 지연 시간
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 성공 콜백 호출
      onSuccess();
    } catch (error) {
      console.error("Verification failed:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // 환경에 따라 다른 컴포넌트 렌더링
  console.log("현재 환경:", isMiniApp ? "미니 앱" : "웹", "액션 ID:", actionId);
  if (isMiniApp) {
    // 미니 앱 환경에서는 직접 버튼 사용
    return (
      <Button
        onClick={handleMiniAppVerification}
        className={className}
        size="lg"
        disabled={isVerifying}
      >
        <div className="flex items-center justify-center">
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="12" cy="12" r="5" fill="currentColor" />
          </svg>
          {isVerifying ? "Verifying..." : buttonText}
        </div>
      </Button>
    );
  } else {
    // 일반 웹 환경에서는 IDKit 위젯 사용
    // 디버깅 정보 출력
    console.log("IDKit 설정 준비:", {
      action: actionId || `campaign-verification-${campaignId}`,
      appId: process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID
    });
    
    // 테스트를 위한 고정 액션 ID
    const testActionId = "wld_staging_1234567890";
    
    return (
      <>
        <DynamicIDKitWidget
          action={testActionId} // 테스트를 위해 고정 값 사용
          app_id="app_staging_d4f9c8c1c1f0c0a0c0a0c0a0c0a0c0a0" // 테스트를 위한 고정 값
          onSuccess={handleVerify}
          action_description={`Verify ${userRole} for campaign ${campaignId}`}
          verification_level={"orb" as VerificationLevel}
          signal="campaign_verification"
        >
          {({ open }) => (
            <Button
              onClick={() => {
                console.log("IDKit 열기 시도");
                // 직접 열기 시도
                try {
                  open();
                } catch (error) {
                  console.error("IDKit 열기 오류:", error);
                }
              }}
              className={className}
              size="lg"
              disabled={isVerifying || !actionId}
            >
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="12" r="5" fill="currentColor" />
                </svg>
                {isVerifying ? "Verifying..." : buttonText}
              </div>
            </Button>
          )}
        </DynamicIDKitWidget>
        {/* 디버깅 정보 표시 */}
        <div className="text-xs text-gray-400 mt-1">
          Action ID: {actionId || "로딩 중..."}
        </div>
      </>
    );
  }
};

export default WorldcoinVerification;
