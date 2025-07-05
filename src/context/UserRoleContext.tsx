"use client";

import React, { createContext, useState, useContext } from "react";

export type UserRole = "donor" | "organization" | "recipient";

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

// Default context value with error handling for setUserRole
export const UserRoleContext = createContext<UserRoleContextType>({
  userRole: "donor", // 기본값
  setUserRole: () => {
    throw new Error(
      "UserRoleContext not initialized - role should be updated when calling setUserRole"
    );
  },
});

// Storage key for localStorage
const USER_ROLE_STORAGE_KEY = "wrldrelief-user-role";

export const UserRoleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Initialize state with value from localStorage if available, otherwise use default
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem(USER_ROLE_STORAGE_KEY);
      // Validate that the saved role is a valid UserRole type
      if (
        savedRole === "donor" ||
        savedRole === "organization" ||
        savedRole === "recipient"
      ) {
        return savedRole;
      }
    }
    return "donor"; // Default role
  });

  // Custom setUserRole function that updates both state and localStorage
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_ROLE_STORAGE_KEY, role);
    }
  };

  // Context value with userRole state and setUserRole function
  const contextValue = {
    userRole,
    setUserRole,
  };

  return (
    <UserRoleContext.Provider value={contextValue}>
      {children}
    </UserRoleContext.Provider>
  );
};

// Custom hook for easy context usage
export const useUserRole = () => useContext(UserRoleContext);
