"use client";

import React, { createContext, useState, useContext } from "react";

export type UserRole = "donor" | "organization" | "recipient";

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const UserRoleContext = createContext<UserRoleContextType>({
  userRole: "recipient", // 기본값
  setUserRole: () => {},
});

export const UserRoleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userRole, setUserRole] = useState<UserRole>("recipient");

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

// useUserRole 훅 (Context 사용을 간편하게)
export const useUserRole = () => useContext(UserRoleContext);
