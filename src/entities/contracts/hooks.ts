import { useState, useEffect } from 'react';
import { publicClient, CONTRACT_ADDRESSES } from './config';
import { CampaignData, CampaignStatus } from '../campaign/types';
import { DisasterData } from '../disaster/types';

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
        
        // Get campaign count first
        const campaignCount = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.campaignFactory as `0x${string}`,
          abi: CampaignFactoryABI,
          functionName: 'getTotalCampaignCount',
        }) as bigint;
        
        console.log('Campaign count:', campaignCount);
        
        // Get all campaign IDs from factory by index
        const campaignIds = [];
        for (let i = 0; i < Number(campaignCount); i++) {
          try {
            const id = await publicClient.readContract({
              address: CONTRACT_ADDRESSES.campaignFactory as `0x${string}`,
              abi: CampaignFactoryABI,
              functionName: 'allCampaignIds',
              args: [BigInt(i)],
            }) as bigint;
            
            campaignIds.push(Number(id));
          } catch (err) {
            console.error(`Error fetching campaign ID at index ${i}:`, err);
          }
        }
        
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
              functionName: 'getCampaignInfo',
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
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
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
        
        // Get campaign IDs for the disaster
        const campaignIds = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.campaignFactory as `0x${string}`,
          abi: CampaignFactoryABI,
          functionName: 'getActiveCampaignsByDisaster',
          args: [disasterId],
        }) as bigint[];
        
        // Define the campaign info type based on the contract struct
        type CampaignInfo = {
          campaignAddress: string;
          disasterId: string;
          organizer: string;
          name: string;
          startDate: bigint;
          endDate: bigint;
          createdAt: bigint;
          isActive: boolean;
        };
        
        // Get campaign info for each ID
        const campaignInfos = await Promise.all(
          campaignIds.map(async (id) => {
            const info = await publicClient.readContract({
              address: CONTRACT_ADDRESSES.campaignFactory as `0x${string}`,
              abi: CampaignFactoryABI,
              functionName: 'getCampaignInfo',
              args: [id],
            }) as CampaignInfo;
            return info;
          })
        );
        
        // Get detailed campaign data for each campaign
        const detailedCampaigns = await Promise.all(
          campaignInfos.map(async (info) => {
            try {
              const campaignData = await publicClient.readContract({
                address: info.campaignAddress as `0x${string}`,
                abi: CampaignABI,
                functionName: 'getCampaignInfo',
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
                updatedAt: Number(campaignData[11]), // 업데이트 시간이 없으면 생성 시간과 동일하게 설정
              } as CampaignData;
            } catch (err) {
              console.error(`Error fetching data for campaign at ${info.campaignAddress}:`, err);
              // Return a minimal campaign object with data from campaignInfo
              return {
                id: 0, // We don't have this from campaignInfo
                disasterId: info.disasterId,
                organizer: info.organizer,
                name: info.name,
                description: "", // Not available in campaignInfo
                startDate: Number(info.startDate),
                endDate: Number(info.endDate),
                supportItems: [], // Not available in campaignInfo
                imageUrl: "", // Not available in campaignInfo
                status: info.isActive ? CampaignStatus.ACTIVE : CampaignStatus.ENDED,
                totalDonations: 0, // Not available in campaignInfo
                createdAt: Number(info.createdAt),
                updatedAt: Number(info.createdAt), // 업데이트 시간이 없으면 생성 시간과 동일하게 설정
              } as CampaignData;
            }
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
          functionName: 'getCampaignInfo',
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
        console.log('Starting to fetch disasters from chain...');
        console.log('DisasterRegistry address:', CONTRACT_ADDRESSES.disasterRegistry);
        
        // Try to get active disasters first
        try {
          console.log('Calling getActiveDisasters...');
          // Get active disaster IDs
          const activeDisasterIds = await publicClient.readContract({
            address: CONTRACT_ADDRESSES.disasterRegistry as `0x${string}`,
            abi: DisasterRegistryABI,
            functionName: 'getActiveDisasters',
          }) as string[];
          
          console.log('Active disaster IDs:', activeDisasterIds);
          
          if (activeDisasterIds && activeDisasterIds.length > 0) {
            console.log(`Found ${activeDisasterIds.length} active disasters, fetching details...`);
            // Get disaster details for each ID
            const disasterPromises = activeDisasterIds.map(async (id) => {
              try {
                console.log(`Fetching details for disaster ID: ${id}`);
                const disasterData = await publicClient.readContract({
                  address: CONTRACT_ADDRESSES.disasterRegistry as `0x${string}`,
                  abi: DisasterRegistryABI,
                  functionName: 'disasters',
                  args: [id],
                });
                
                console.log(`Disaster data for ${id}:`, disasterData);
                
                // 배열 형태로 반환되는 경우 처리
                if (Array.isArray(disasterData)) {
                  // 배열 인덱스에 따른 필드 매핑
                  return {
                    id: id,
                    name: disasterData[1] || 'Unknown Disaster',
                    description: disasterData[2] || 'No description available',
                    location: disasterData[3] || 'Unknown location',
                    imageUrl: disasterData[6] || '',
                    startDate: disasterData[4] ? Number(disasterData[4]) : Date.now(),
                    registeredAt: disasterData[9] ? Number(disasterData[9]) : Date.now(),
                    isActive: disasterData[8] === 0, // Assuming 0 is ACTIVE status
                  } as Disaster;
                } else {
                  // 객체 형태로 반환되는 경우 처리 (기존 코드)
                  const typedData = disasterData as { 
                    id: string; 
                    name: string; 
                    description: string; 
                    location: string; 
                    startDate: bigint; 
                    endDate: bigint;
                    imageUrl: string; 
                    externalSource: string;
                    status: number;
                    createdAt: bigint;
                    updatedAt: bigint;
                    createdBy: string;
                  };
                  
                  return {
                    id: id,
                    name: typedData.name || 'Unknown Disaster',
                    description: typedData.description || 'No description available',
                    location: typedData.location || 'Unknown location',
                    imageUrl: typedData.imageUrl || '',
                    startDate: Number(typedData.startDate) || Date.now(),
                    registeredAt: Number(typedData.createdAt) || Date.now(),
                    isActive: typedData.status === 0, // Assuming 0 is ACTIVE status
                  } as Disaster;
                }
              } catch (err) {
                console.warn(`Error fetching disaster ${id}:`, err);
                return null;
              }
            });
            
            const results = await Promise.all(disasterPromises);
            console.log('All disaster results:', results);
            
            const formattedDisasters = results.filter(d => d !== null) as Disaster[];
            console.log('Formatted disasters:', formattedDisasters);
            
            if (formattedDisasters.length > 0) {
              console.log(`Setting ${formattedDisasters.length} on-chain disasters to state`);
              setDisasters(formattedDisasters);
              setLoading(false);
              return; // Exit early if we got disasters
            } else {
              console.log('No formatted disasters after filtering nulls');
            }
          } else {
            console.log('No active disaster IDs returned from contract');
          }
        } catch (err) {
          console.warn('Error fetching active disasters, trying disasterIds fallback:', err);
        }
        
        // Fallback: Try to enumerate disasters using disasterIds array
        try {
          console.log('Trying to enumerate disasters using disasterIds...');
          let index = 0;
          const disasterIds: string[] = [];
          
          // Keep trying to get disaster IDs until we get an error
          while (true) {
            try {
              const disasterId = await publicClient.readContract({
                address: CONTRACT_ADDRESSES.disasterRegistry as `0x${string}`,
                abi: DisasterRegistryABI,
                functionName: 'disasterIds',
                args: [index],
              }) as string;
              
              if (disasterId && disasterId !== '') {
                console.log(`Found disaster ID at index ${index}:`, disasterId);
                disasterIds.push(disasterId);
                index++;
              } else {
                console.log(`No disaster ID at index ${index}, stopping enumeration`);
                break;
              }
            } catch (err) {
              console.log(`Error or end of list at index ${index}:`, err);
              break;
            }
            
            // Safety check to prevent infinite loops
            if (index >= 100) {
              console.log('Reached safety limit of 100 disasters, stopping enumeration');
              break;
            }
          }
          
          console.log(`Found ${disasterIds.length} disaster IDs through enumeration`);
          
          if (disasterIds.length > 0) {
            // Get disaster details for each ID
            const disasterPromises = disasterIds.map(async (id) => {
              try {
                console.log(`Fetching details for disaster ID: ${id}`);
                const disasterData = await publicClient.readContract({
                  address: CONTRACT_ADDRESSES.disasterRegistry as `0x${string}`,
                  abi: DisasterRegistryABI,
                  functionName: 'disasters',
                  args: [id],
                }) as { 
                  id: string; 
                  name: string; 
                  description: string; 
                  location: string; 
                  startDate: bigint; 
                  endDate: bigint;
                  imageUrl: string; 
                  externalSource: string;
                  status: number;
                  createdAt: bigint;
                  updatedAt: bigint;
                  createdBy: string;
                };
                
                console.log(`Disaster data for ${id}:`, disasterData);
                
                return {
                  id: id,
                  name: disasterData.name || 'Unknown Disaster',  // Provide default if name is missing
                  description: disasterData.description || 'No description available',
                  location: disasterData.location || 'Unknown location',
                  imageUrl: disasterData.imageUrl || '',
                  startDate: Number(disasterData.startDate) || Date.now(),
                  registeredAt: Number(disasterData.createdAt) || Date.now(),
                  isActive: disasterData.status === 0, // Assuming 0 is ACTIVE status
                } as Disaster;
              } catch (err) {
                console.warn(`Error fetching disaster ${id}:`, err);
                return null;
              }
            });
            
            const results = await Promise.all(disasterPromises);
            console.log('All disaster results:', results);
            
            const formattedDisasters = results.filter(d => d !== null) as Disaster[];
            console.log('Formatted disasters:', formattedDisasters);
            
            if (formattedDisasters.length > 0) {
              console.log(`Setting ${formattedDisasters.length} on-chain disasters to state`);
              setDisasters(formattedDisasters);
              setLoading(false);
              return; // Exit early if we got disasters
            } else {
              console.log('No formatted disasters after filtering nulls');
            }
          }
        } catch (err) {
          console.warn('Error enumerating disasters, falling back to mock data:', err);
        }
        
        // If we get here, we couldn't fetch disasters from the contract
        // Use mock data as fallback
        console.warn('No disasters found on-chain, using mock data');
        
        // Mock disaster data
        const mockDisasters: Disaster[] = [
          {
            id: 'mock-1',
            name: 'Hurricane Florence',
            description: 'Category 4 hurricane affecting the US East Coast',
            location: 'North Carolina, USA',
            imageUrl: 'https://example.com/hurricane.jpg',
            startDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
            registeredAt: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6 days ago
            isActive: true
          },
          {
            id: 'mock-2',
            name: 'Earthquake in Turkey',
            description: '7.8 magnitude earthquake in southeastern Turkey',
            location: 'Gaziantep, Turkey',
            imageUrl: 'https://example.com/earthquake.jpg',
            startDate: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
            registeredAt: Date.now() - 13 * 24 * 60 * 60 * 1000, // 13 days ago
            isActive: true
          }
        ];
        
        console.log('Setting mock disasters to state:', mockDisasters);
        setDisasters(mockDisasters);
        setLoading(false);
      } catch (err) {
        console.error('Error in disaster fetching process:', err);
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
        }) as { id: string; name: string; description: string; location: string; imageUrl: string; startDate: bigint; registeredAt: bigint; isActive: boolean };
        
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
