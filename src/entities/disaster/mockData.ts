// src/entities/disaster/mockData.ts

import { DisasterLocation } from "./types";

/**
 * @constant MOCK_DISASTER_LOCATIONS
 * @description 재난 지역을 시뮬레이션하기 위한 목(Mock) 데이터 배열입니다.
 * 실제 지도에 빨간 점으로 표시될 위치 정보를 포함합니다.
 */
export const MOCK_DISASTER_LOCATIONS: DisasterLocation[] = [
  {
    id: "la-wildfire-001",
    name: "Los Angeles Wildfire Emergency",
    latitude: 34.0522, // LA 위도
    longitude: -118.2437, // LA 경도
    type: "wildfire",
    urgency: "critical",
    affectedPeople: 18000,
    predictedNeeds: {
      foodPacks: 25000,
      medicalKits: 7000,
      shelterUnits: 5000,
    },
    description:
      "A massive wildfire has swept through the outskirts of Los Angeles, destroying homes and infrastructure. Thousands have been evacuated and urgent relief is needed for shelter, food, and medical support.",
    imageUrl: "", // public 폴더에 이미지 준비
  },
  {
    id: "iran-israel-war-001",
    name: "Tehran Missile Strikes",
    latitude: 35.6892,
    longitude: 51.389,
    type: "conflict",
    urgency: "critical",
    affectedPeople: 50000,
    predictedNeeds: {
      foodPacks: 40000,
      medicalKits: 10000,
      shelterUnits: 8000,
    },
    description:
      "Israeli airstrikes in Tehran have resulted in hundreds of civilian casualties and mass displacement. Infrastructure and fuel depots have been severely damaged.",
    imageUrl: "/images/mock_tehran_conflict.jpg",
  },
  {
    id: "israel-iran-war-002",
    name: "Haifa Missile Attack",
    latitude: 32.794,
    longitude: 34.9896,
    type: "conflict",
    urgency: "critical",
    affectedPeople: 12000,
    predictedNeeds: {
      foodPacks: 8000,
      medicalKits: 2000,
      shelterUnits: 2500,
    },
    description:
      "Iranian missile strikes have hit residential areas in Haifa, causing civilian deaths, injuries, and destruction of homes.",
    imageUrl: "/images/mock_haifa_attack.jpg",
  },
  {
    id: "ukraine-war-001",
    name: "Kremenchuk Energy Attack",
    latitude: 49.068,
    longitude: 33.417,
    type: "conflict",
    urgency: "high",
    affectedPeople: 15000,
    predictedNeeds: {
      foodPacks: 12000,
      medicalKits: 3500,
      shelterUnits: 4000,
    },
    description:
      "Russian missile and drone attacks damaged energy facilities in Kremenchuk, leading to power outages and displacement.",
    imageUrl: "/images/mock_kremenchuk_attack.jpg",
  },
  {
    id: "ukraine-war-002",
    name: "Zaporizhzhia Shelling",
    latitude: 47.8378,
    longitude: 35.1383,
    type: "conflict",
    urgency: "high",
    affectedPeople: 8000,
    predictedNeeds: {
      foodPacks: 7000,
      medicalKits: 2000,
      shelterUnits: 1500,
    },
    description:
      "Industrial facilities in Zaporizhzhia were set on fire after Russian shelling. No casualties reported, but significant economic impact.",
    imageUrl: "/images/mock_zaporizhzhia_shelling.jpg",
  },
  {
    id: "myanmar-eq-001",
    name: "Mandalay Earthquake Recovery",
    latitude: 21.9162,
    longitude: 95.956,
    type: "earthquake",
    urgency: "high",
    affectedPeople: 117000,
    predictedNeeds: {
      foodPacks: 60000,
      medicalKits: 25000,
      shelterUnits: 20000,
    },
    description:
      "Aftershocks continue to affect Mandalay. Over 117,000 people have received some assistance, but shelter and livelihood recovery remain critical.",
    imageUrl: "/images/mock_mandalay_earthquake.jpg",
  },
  {
    id: "bangladesh-fl-001",
    name: "Sylhet Flood Emergency",
    latitude: 24.8949,
    longitude: 91.8687,
    type: "flood",
    urgency: "critical",
    affectedPeople: 66000,
    predictedNeeds: {
      foodPacks: 50000,
      medicalKits: 15000,
      shelterUnits: 12000,
    },
    description:
      "Heavy monsoon rains have caused severe flooding and landslides in Sylhet and surrounding districts, displacing thousands.",
    imageUrl: "/images/mock_sylhet_flood.jpg",
  },
  {
    id: "pakistan-fl-001",
    name: "Karachi Prison Earthquake",
    latitude: 24.8607,
    longitude: 67.0011,
    type: "earthquake",
    urgency: "medium",
    affectedPeople: 5000,
    predictedNeeds: {
      foodPacks: 3000,
      medicalKits: 800,
      shelterUnits: 1000,
    },
    description:
      "Earthquake swarm in Karachi led to prison wall collapse, causing casualties and panic among inmates.",
    imageUrl: "/images/mock_karachi_earthquake.jpg",
  },
  {
    id: "turkey-eq-001",
    name: "Muğla Earthquake",
    latitude: 37.2154,
    longitude: 28.3636,
    type: "earthquake",
    urgency: "high",
    affectedPeople: 4000,
    predictedNeeds: {
      foodPacks: 3000,
      medicalKits: 1000,
      shelterUnits: 1200,
    },
    description:
      "A magnitude 5.8 earthquake in Muğla caused building collapses and casualties.",
    imageUrl: "/images/mock_mugla_earthquake.jpg",
  },
  {
    id: "chile-eq-001",
    name: "Atacama Earthquake",
    latitude: -27.3668,
    longitude: -70.3314,
    type: "earthquake",
    urgency: "high",
    affectedPeople: 3000,
    predictedNeeds: {
      foodPacks: 2500,
      medicalKits: 700,
      shelterUnits: 1000,
    },
    description:
      "A 6.4 magnitude earthquake in Atacama caused landslides, power outages, and infrastructure damage.",
    imageUrl: "/images/mock_atacama_earthquake.jpg",
  },
  {
    id: "colombia-eq-001",
    name: "Cundinamarca Earthquake",
    latitude: 4.8143,
    longitude: -74.0365,
    type: "earthquake",
    urgency: "high",
    affectedPeople: 31000,
    predictedNeeds: {
      foodPacks: 20000,
      medicalKits: 6000,
      shelterUnits: 8000,
    },
    description:
      "A magnitude 6.3 earthquake struck Cundinamarca, causing widespread damage and injuries.",
    imageUrl: "/images/mock_cundinamarca_earthquake.jpg",
  },
  {
    id: "peru-eq-001",
    name: "Callao Earthquake",
    latitude: -12.0464,
    longitude: -77.0428,
    type: "earthquake",
    urgency: "high",
    affectedPeople: 5000,
    predictedNeeds: {
      foodPacks: 4000,
      medicalKits: 1200,
      shelterUnits: 1500,
    },
    description:
      "A 5.6 magnitude earthquake in Callao and Lima caused casualties and blocked highways.",
    imageUrl: "/images/mock_callao_earthquake.jpg",
  },
  {
    id: "sudan-crisis-001",
    name: "Sudan Conflict Displacement",
    latitude: 15.5007,
    longitude: 32.5599,
    type: "conflict",
    urgency: "critical",
    affectedPeople: 300000,
    predictedNeeds: {
      foodPacks: 200000,
      medicalKits: 50000,
      shelterUnits: 60000,
    },
    description:
      "Ongoing armed conflict in Sudan has displaced hundreds of thousands, with urgent needs for food, shelter, and medical care.",
    imageUrl: "/images/mock_sudan_conflict.jpg",
  },
  {
    id: "somalia-crisis-001",
    name: "Somalia Armed Attacks",
    latitude: 2.0469,
    longitude: 45.3182,
    type: "conflict",
    urgency: "high",
    affectedPeople: 25000,
    predictedNeeds: {
      foodPacks: 15000,
      medicalKits: 5000,
      shelterUnits: 7000,
    },
    description:
      "Al-Shabaab attacks and inter-clan violence continue to destabilize Somalia, causing casualties and displacement.",
    imageUrl: "/images/mock_somalia_conflict.jpg",
  },
  {
    id: "myanmar-conflict-001",
    name: "Myanmar Internal Displacement",
    latitude: 21.9162,
    longitude: 95.956,
    type: "conflict",
    urgency: "high",
    affectedPeople: 120000,
    predictedNeeds: {
      foodPacks: 80000,
      medicalKits: 20000,
      shelterUnits: 25000,
    },
    description:
      "Armed conflict and recent earthquakes have led to mass displacement and ongoing humanitarian needs in Myanmar.",
    imageUrl: "/images/mock_myanmar_displacement.jpg",
  },
  {
    id: "syria-crisis-001",
    name: "Syria Humanitarian Emergency",
    latitude: 35.8617,
    longitude: 38.7816,
    type: "conflict",
    urgency: "critical",
    affectedPeople: 120000,
    predictedNeeds: {
      foodPacks: 90000,
      medicalKits: 25000,
      shelterUnits: 30000,
    },
    description:
      "Ongoing conflict and economic crisis in Syria continue to drive humanitarian needs.",
    imageUrl: "/images/mock_syria_crisis.jpg",
  },
  {
    id: "haiti-crisis-001",
    name: "Haiti Gang Violence",
    latitude: 18.5944,
    longitude: -72.3074,
    type: "conflict",
    urgency: "high",
    affectedPeople: 40000,
    predictedNeeds: {
      foodPacks: 30000,
      medicalKits: 7000,
      shelterUnits: 9000,
    },
    description:
      "Gang violence and political instability in Haiti have displaced thousands and disrupted aid delivery.",
    imageUrl: "/images/mock_haiti_violence.jpg",
  },
  {
    id: "venezuela-crisis-001",
    name: "Venezuela Economic Crisis",
    latitude: 6.4238,
    longitude: -66.5897,
    type: "economic",
    urgency: "high",
    affectedPeople: 100000,
    predictedNeeds: {
      foodPacks: 80000,
      medicalKits: 15000,
      shelterUnits: 20000,
    },
    description:
      "Hyperinflation and shortages in Venezuela continue to drive food insecurity and migration.",
    imageUrl: "/images/mock_venezuela_crisis.jpg",
  },
  {
    id: "ethiopia-crisis-001",
    name: "Ethiopia Drought Emergency",
    latitude: 9.145,
    longitude: 40.4897,
    type: "drought",
    urgency: "critical",
    affectedPeople: 70000,
    predictedNeeds: {
      foodPacks: 60000,
      medicalKits: 10000,
      shelterUnits: 12000,
    },
    description:
      "Severe drought in Ethiopia is causing food and water shortages, threatening livelihoods.",
    imageUrl: "/images/mock_ethiopia_drought.jpg",
  },
  {
    id: "yemen-crisis-001",
    name: "Yemen Humanitarian Crisis",
    latitude: 15.5527,
    longitude: 48.5164,
    type: "conflict",
    urgency: "critical",
    affectedPeople: 150000,
    predictedNeeds: {
      foodPacks: 120000,
      medicalKits: 30000,
      shelterUnits: 40000,
    },
    description:
      "Prolonged conflict and blockades have led to widespread famine and disease in Yemen.",
    imageUrl: "/images/mock_yemen_crisis.jpg",
  },
  {
    id: "nigeria-crisis-001",
    name: "Nigeria Boko Haram Attacks",
    latitude: 9.082,
    longitude: 8.6753,
    type: "conflict",
    urgency: "high",
    affectedPeople: 50000,
    predictedNeeds: {
      foodPacks: 40000,
      medicalKits: 8000,
      shelterUnits: 12000,
    },
    description:
      "Boko Haram violence in northeastern Nigeria continues to displace communities and disrupt aid.",
    imageUrl: "/images/mock_nigeria_boko.jpg",
  },
  {
    id: "afghanistan-crisis-001",
    name: "Afghanistan Earthquake",
    latitude: 33.9391,
    longitude: 67.71,
    type: "earthquake",
    urgency: "high",
    affectedPeople: 20000,
    predictedNeeds: {
      foodPacks: 15000,
      medicalKits: 5000,
      shelterUnits: 7000,
    },
    description:
      "A recent earthquake in Afghanistan has destroyed homes and left thousands in urgent need of shelter.",
    imageUrl: "/images/mock_afghanistan_earthquake.jpg",
  },
  {
    id: "libya-flood-001",
    name: "Libya Flash Floods",
    latitude: 32.8872,
    longitude: 13.1913,
    type: "flood",
    urgency: "high",
    affectedPeople: 18000,
    predictedNeeds: {
      foodPacks: 12000,
      medicalKits: 4000,
      shelterUnits: 5000,
    },
    description:
      "Heavy rains caused flash floods in Libya, damaging infrastructure and displacing thousands.",
    imageUrl: "/images/mock_libya_flood.jpg",
  },
  {
    id: "malawi-cyclone-001",
    name: "Malawi Cyclone Aftermath",
    latitude: -13.2543,
    longitude: 34.3015,
    type: "cyclone",
    urgency: "high",
    affectedPeople: 25000,
    predictedNeeds: {
      foodPacks: 18000,
      medicalKits: 6000,
      shelterUnits: 8000,
    },
    description:
      "Cyclone-induced floods and landslides have left thousands homeless in Malawi.",
    imageUrl: "/images/mock_malawi_cyclone.jpg",
  },
  {
    id: "philippines-typhoon-001",
    name: "Philippines Typhoon Emergency",
    latitude: 13.41,
    longitude: 122.56,
    type: "typhoon",
    urgency: "high",
    affectedPeople: 40000,
    predictedNeeds: {
      foodPacks: 35000,
      medicalKits: 9000,
      shelterUnits: 10000,
    },
    description:
      "A powerful typhoon has struck the Philippines, causing widespread flooding and destruction.",
    imageUrl: "/images/mock_philippines_typhoon.jpg",
  },
  {
    id: "mexico-eq-001",
    name: "Nuevo León Earthquake",
    latitude: 25.5922,
    longitude: -99.9962,
    type: "earthquake",
    urgency: "medium",
    affectedPeople: 2000,
    predictedNeeds: {
      foodPacks: 1500,
      medicalKits: 500,
      shelterUnits: 500,
    },
    description:
      "A moderate earthquake in Nuevo León damaged homes and infrastructure.",
    imageUrl: "/images/mock_nuevoleon_earthquake.jpg",
  },
  {
    id: "greece-eq-001",
    name: "Crete Offshore Earthquake",
    latitude: 35.2401,
    longitude: 24.8093,
    type: "earthquake",
    urgency: "medium",
    affectedPeople: 3000,
    predictedNeeds: {
      foodPacks: 2000,
      medicalKits: 600,
      shelterUnits: 800,
    },
    description:
      "A 6.2 magnitude earthquake offshore Crete caused building damage and landslides.",
    imageUrl: "/images/mock_crete_earthquake.jpg",
  },
  {
    id: "indonesia-eq-001",
    name: "Aceh Earthquake",
    latitude: 4.6951,
    longitude: 96.7494,
    type: "earthquake",
    urgency: "medium",
    affectedPeople: 2500,
    predictedNeeds: {
      foodPacks: 2000,
      medicalKits: 500,
      shelterUnits: 700,
    },
    description:
      "A 5.8 magnitude earthquake in Aceh destroyed homes and roads.",
    imageUrl: "/images/mock_aceh_earthquake.jpg",
  },
  {
    id: "tonga-eq-001",
    name: "Vavaʻu Offshore Earthquake",
    latitude: -18.65,
    longitude: -173.9833,
    type: "earthquake",
    urgency: "medium",
    affectedPeople: 1000,
    predictedNeeds: {
      foodPacks: 800,
      medicalKits: 200,
      shelterUnits: 300,
    },
    description:
      "A 6.4 magnitude earthquake offshore Vavaʻu caused minor tsunami and structural damage.",
    imageUrl: "/images/mock_vavau_earthquake.jpg",
  },
];
