import { useAtom } from "jotai";
import { userAtom } from "@/shared/lib/store/user";
import { UserInfoExtended, WorldcoinUserInfo } from "@/entities/user/types";
import { MiniKit } from "@worldcoin/minikit-js";

// 사용자 정보 관리를 위한 훅
export const useUserModel = () => {
  const [user, setUser] = useAtom(userAtom);

  // 사용자 정보 설정
  const updateUserInfo = (userInfo: Partial<UserInfoExtended>) => {
    setUser((prev) => ({
      ...prev,
      ...userInfo,
      isAuthenticated: true,
    }));
  };

  // 사용자 정보 초기화 (로그아웃)
  const resetUserInfo = () => {
    setUser({
      isAuthenticated: false,
    });
  };

  // Worldcoin MiniKit에서 사용자 정보 가져오기
  const fetchWorldcoinUserInfo = async (address: string) => {
    try {
      // MiniKit API 호출
      const response = await MiniKit.getUserByAddress(address);
      console.log("MiniKit getUserByAddress response:", response);

      // 응답 데이터 확인
      let profilePictureUrl: string | undefined = undefined;
      let displayName = address.substring(0, 8);

      // 응답이 객체이고 필요한 데이터가 있는지 확인
      if (response && typeof response === "object") {
        // 프로필 이미지 URL 추출 시도
        if ("profilePictureUrl" in response && response.profilePictureUrl) {
          profilePictureUrl = String(response.profilePictureUrl);
        } else if ("profileImageUrl" in response && response.profileImageUrl) {
          profilePictureUrl = String(response.profileImageUrl);
        } else if ("image" in response && response.image) {
          profilePictureUrl = String(response.image);
        } else if ("avatar" in response && response.avatar) {
          profilePictureUrl = String(response.avatar);
        }

        // 이름 추출 시도
        if ("displayName" in response && response.displayName) {
          displayName = String(response.displayName);
        } else if ("name" in response && response.name) {
          displayName = String(response.name);
        } else if ("username" in response && response.username) {
          displayName = String(response.username);
        }
      }

      // 안전하게 WorldcoinUserInfo 타입으로 변환
      const worldcoinInfo: WorldcoinUserInfo = {
        id: address,
        address: address,
        profilePictureUrl,
        displayName,
      };

      updateUserInfo({
        address,
        worldcoinInfo,
      });
      return worldcoinInfo;
    } catch (error) {
      console.error("Failed to fetch user info from Worldcoin:", error);
      // 에러가 발생해도 주소는 설정
      updateUserInfo({ address });
      return null;
    }
  };

  return {
    user,
    updateUserInfo,
    resetUserInfo,
    fetchWorldcoinUserInfo,
  };
};
