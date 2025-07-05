import { useState, useEffect } from 'react';
import { publicClient, CONTRACT_ADDRESSES } from './config';

// Import ABIs
import CampaignABI from './abis/Campaign.json';
import CampaignFactoryABI from './abis/CampaignFactory.json';
import DisasterRegistryABI from './abis/DisasterRegistry.json';

// Campaign types
export interface Campaign {
  id: number;
  disasterId: string;
  organizer: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  supportItems: string[];
  imageUrl: string;
  status: number; // CampaignStatus enum value
  totalDonations: number;
  createdAt: number;
  canEdit: boolean;
  // UI-specific fields (optional)
  currentFunding?: number;
  targetFunding?: number;
  currency?: string;
  isRegistered?: boolean;
  registrationStatus?: "pending" | "approved" | "rejected";
  worldcoinVerified?: boolean;
  location?: string;
}

// Disaster types
export interface Disaster {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  startDate: number;
  registeredAt: number;
  isActive: boolean;
}

// Hook to get all campaigns
export function useAllCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        
        // Get all campaign IDs from factory
        const campaignIds = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.campaignFactory as `0x${string}`,
          abi: CampaignFactoryABI,
          functionName: 'allCampaignIds',
        }) as number[];
        
        // Get campaign info for each ID
        const campaignInfos = await Promise.all(
          campaignIds.map(async (id) => {
            const campaignInfo = await publicClient.readContract({
              address: CONTRACT_ADDRESSES.campaignFactory as `0x${string}`,
              abi: CampaignFactoryABI,
              functionName: 'campaigns',
              args: [BigInt(id)],
            });
            
            // Get detailed campaign data from campaign contract
            const campaignData = await publicClient.readContract({
              address: campaignInfo[0] as `0x${string}`, // campaignAddress
              abi: CampaignABI,
              functionName: 'getCampaignData',
            });
            
            return {
              id,
              disasterId: campaignInfo[1], // disasterId
              organizer: campaignInfo[2], // organizer
              name: campaignInfo[3], // name
              description: campaignData[4], // description
              startDate: Number(campaignInfo[4]), // startDate
              endDate: Number(campaignInfo[5]), // endDate
              supportItems: campaignData[7], // supportItems
              imageUrl: campaignData[8], // imageUrl
              status: Number(campaignData[9]), // status
              totalDonations: Number(campaignData[10]), // totalDonations
              createdAt: Number(campaignInfo[6]), // createdAt
              canEdit: campaignData[12], // canEdit
            } as Campaign;
          })
        );
        
        setCampaigns(campaignInfos);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return { campaigns, loading, error };
}

// Hook to get campaigns by disaster ID
export function useCampaignsByDisaster(disasterId: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!disasterId) {
        setCampaigns([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get campaign info for the disaster
        const campaignInfos = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.campaignFactory as `0x${string}`,
          abi: CampaignFactoryABI,
          functionName: 'getCampaignsByDisaster',
          args: [disasterId],
        }) as any[];
        
        // Get detailed campaign data for each campaign
        const detailedCampaigns = await Promise.all(
          campaignInfos.map(async (info) => {
            const campaignData = await publicClient.readContract({
              address: info.campaignAddress as `0x${string}`,
              abi: CampaignABI,
              functionName: 'getCampaignData',
            });
            
            return {
              id: Number(campaignData[0]),
              disasterId: campaignData[1],
              organizer: campaignData[2],
              name: campaignData[3],
              description: campaignData[4],
              startDate: Number(campaignData[5]),
              endDate: Number(campaignData[6]),
              supportItems: campaignData[7],
              imageUrl: campaignData[8],
              status: Number(campaignData[9]),
              totalDonations: Number(campaignData[10]),
              createdAt: Number(campaignData[11]),
              canEdit: campaignData[12],
            } as Campaign;
          })
        );
        
        setCampaigns(detailedCampaigns);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching campaigns for disaster ${disasterId}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [disasterId]);

  return { campaigns, loading, error };
}

// Hook to get a single campaign by ID
export function useCampaign(campaignId: number) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (campaignId === undefined || campaignId === null) {
        setCampaign(null);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get campaign info from factory
        const campaignInfo = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.campaignFactory as `0x${string}`,
          abi: CampaignFactoryABI,
          functionName: 'campaigns',
          args: [BigInt(campaignId)],
        });
        
        if (!campaignInfo || !campaignInfo[0]) {
          throw new Error(`Campaign with ID ${campaignId} not found`);
        }
        
        // Get detailed campaign data from campaign contract
        const campaignData = await publicClient.readContract({
          address: campaignInfo[0] as `0x${string}`, // campaignAddress
          abi: CampaignABI,
          functionName: 'getCampaignData',
        });
        
        setCampaign({
          id: campaignId,
          disasterId: campaignInfo[1], // disasterId
          organizer: campaignInfo[2], // organizer
          name: campaignInfo[3], // name
          description: campaignData[4], // description
          startDate: Number(campaignInfo[4]), // startDate
          endDate: Number(campaignInfo[5]), // endDate
          supportItems: campaignData[7], // supportItems
          imageUrl: campaignData[8], // imageUrl
          status: Number(campaignData[9]), // status
          totalDonations: Number(campaignData[10]), // totalDonations
          createdAt: Number(campaignInfo[6]), // createdAt
          canEdit: campaignData[12], // canEdit
        });
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching campaign ${campaignId}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  return { campaign, loading, error };
}

// Hook to get all disasters
export function useAllDisasters() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        setLoading(true);
        
        // Get all disasters from registry
        const disasterData = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.disasterRegistry as `0x${string}`,
          abi: DisasterRegistryABI,
          functionName: 'getAllDisasters',
        }) as any[];
        
        const formattedDisasters = disasterData.map(disaster => ({
          id: disaster.id,
          name: disaster.name,
          description: disaster.description,
          location: disaster.location,
          imageUrl: disaster.imageUrl,
          startDate: Number(disaster.startDate),
          registeredAt: Number(disaster.registeredAt),
          isActive: disaster.isActive,
        }));
        
        setDisasters(formattedDisasters);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching disasters:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };

    fetchDisasters();
  }, []);

  return { disasters, loading, error };
}

// Hook to get a single disaster by ID
export function useDisaster(disasterId: string) {
  const [disaster, setDisaster] = useState<Disaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDisaster = async () => {
      if (!disasterId) {
        setDisaster(null);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get disaster from registry
        const disasterData = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.disasterRegistry as `0x${string}`,
          abi: DisasterRegistryABI,
          functionName: 'getDisaster',
          args: [disasterId],
        }) as any;
        
        setDisaster({
          id: disasterData.id,
          name: disasterData.name,
          description: disasterData.description,
          location: disasterData.location,
          imageUrl: disasterData.imageUrl,
          startDate: Number(disasterData.startDate),
          registeredAt: Number(disasterData.registeredAt),
          isActive: disasterData.isActive,
        });
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching disaster ${disasterId}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };

    fetchDisaster();
  }, [disasterId]);

  return { disaster, loading, error };
}
