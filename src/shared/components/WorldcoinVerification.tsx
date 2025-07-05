import React, { useState, useEffect } from "react";
import { createIncognitoAction, verifyProof } from "@/shared/auth/incognito-actions";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";

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
      const isMiniAppEnv = typeof window !== 'undefined' && 'MiniKit' in window;
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
      await setupAction();
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
    return (
      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID as `app_${string}` || "app_staging_d4f9c8c1c1f0c0a0c0a0c0a0c0a0c0a0"}
        action={actionId || `campaign-verification-${campaignId}`}
        onSuccess={handleVerify}
        action_description={`Verify ${userRole} for campaign ${campaignId}`}
        verification_level={VerificationLevel.Orb}
      >
        {({ open }) => (
          <Button
            onClick={open}
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
      </IDKitWidget>
    );
  }
};

export default WorldcoinVerification;
