"use client";

import React, { useState, useEffect } from "react";
import { useUserRole, UserRole } from "@/context/UserRoleContext";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";

const Profile = () => {
  const { userRole, setUserRole } = useUserRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Reset selected role when userRole changes
  useEffect(() => {
    setSelectedRole(userRole);
  }, [userRole]);

  // Role options with descriptions
  const roleOptions: { role: UserRole; title: string; description: string }[] = [
    {
      role: "recipient",
      title: "Aid Recipient",
      description: "Receive aid and support during disasters"
    },
    {
      role: "donor",
      title: "Donor",
      description: "Contribute funds and resources to aid campaigns"
    },
    {
      role: "organization",
      title: "Organization",
      description: "Manage aid campaigns and coordinate relief efforts"
    }
  ];

  // Handle role change
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
  };

  // Save role changes
  const handleSaveRole = async () => {
    if (selectedRole === userRole) return;
    
    setIsSaving(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the role in context
      setUserRole(selectedRole);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Profile header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-black">Profile</h1>
        <p className="text-sm text-gray-600">Manage your account settings</p>
      </div>

      {/* Role selection section */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <h2 className="text-base font-medium text-black mb-4">Your Role</h2>
        
        {/* Role selection */}
        <div className="space-y-2">
          {roleOptions.map((option) => (
            <div 
              key={option.role}
              onClick={() => handleRoleChange(option.role)}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedRole === option.role 
                ? 'border-black bg-gray-50' 
                : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-black">{option.title}</h3>
                  {selectedRole === option.role && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 13.5L4 10L3 11L7.5 15.5L17.5 5.5L16.5 4.5L7.5 13.5Z" fill="black"/>
                    </svg>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Save button */}
        <div className="mt-6">
          <Button
            onClick={handleSaveRole}
            disabled={selectedRole === userRole || isSaving}
            size="lg"
            variant="primary"
            className={`w-full ${selectedRole === userRole ? 'opacity-50' : ''}`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Success message */}
        {saveSuccess && (
          <div className="mt-4 p-3 border border-gray-200 rounded-lg flex items-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M6 10.8L3.2 8L2.4 8.8L6 12.4L14 4.4L13.2 3.6L6 10.8Z" fill="black"/>
            </svg>
            <span className="text-sm">Your role has been updated successfully!</span>
          </div>
        )}
      </div>

      {/* Current role indicator */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Current Role</h3>
        <div className="flex items-center">
          <div>
            <p className="font-medium text-black">
              {roleOptions.find(option => option.role === userRole)?.title || "User"}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {roleOptions.find(option => option.role === userRole)?.description || ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
