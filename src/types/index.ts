export type Role = 'CUSTOMER' | 'DELIVERY_PARTNER' | 'FACILITY_ADMIN' | 'SUPER_ADMIN';

export type FacilityType =
  | 'APARTMENT'
  | 'UNIVERSITY'
  | 'HOSPITAL'
  | 'CORPORATE_OFFICE'
  | 'HOTEL'
  | 'SHOPPING_MALL'
  | 'WAREHOUSE'
  | 'EXHIBITION_CENTER'
  | 'FACTORY'
  | 'AIRPORT'
  | 'STADIUM'
  | 'RESEARCH_CAMPUS'
  | 'PARKING_COMPLEX'
  | 'CUSTOM';

export type NodeType =
  | 'ENTRY_GATE'
  | 'INTERNAL_ROAD'
  | 'BUILDING'
  | 'TOWER'
  | 'BLOCK'
  | 'FLOOR'
  | 'ZONE'
  | 'CORRIDOR'
  | 'AISLE'
  | 'ROOM'
  | 'FLAT'
  | 'OFFICE'
  | 'SHOP'
  | 'RACK'
  | 'POSITION'
  | 'LIFT'
  | 'STAIRCASE'
  | 'PARKING'
  | 'LOADING_ZONE'
  | 'CHECKPOINT';

export type DeliveryStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'ARRIVED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export type ObstacleType =
  | 'BLOCKED_ROAD'
  | 'CLOSED_GATE'
  | 'LIFT_UNAVAILABLE'
  | 'STAIRCASE_BLOCKED'
  | 'CONSTRUCTION'
  | 'SECURITY_RESTRICTION'
  | 'PARKING_FULL'
  | 'ACCESS_DENIED'
  | 'INACCESSIBLE_PATH'
  | 'OTHER';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  isApproved: boolean;
  isActive: boolean;
  vehicleType?: string;
  vehicleNumber?: string;
  serviceArea?: string;
  organization?: string;
}

export interface LocationNode {
  id: number;
  facilityId: number;
  parentNodeId?: number | null;
  parentNodeName?: string | null;
  name: string;
  nodeType: NodeType;
  levelNumber?: number;
  latitude?: number;
  longitude?: number;
  floorPlanX?: number;
  floorPlanY?: number;
  metadataJson?: string;
  isActive: boolean;
}

export interface LocationEdge {
  id: number;
  facilityId: number;
  sourceNodeId: number;
  sourceNodeName: string;
  destinationNodeId: number;
  destinationNodeName: string;
  distanceMeters: number;
  estimatedTimeSeconds: number;
  isAccessible: boolean;
  allowVehicles: boolean;
  isBidirectional: boolean;
  status: string;
  isActive: boolean;
}

export interface Facility {
  id: number;
  name: string;
  facilityType: FacilityType;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  boundaryJson?: string;
  hierarchySchemaJson?: string;
  isActive: boolean;
  nodes?: LocationNode[];
  edges?: LocationEdge[];
}

export interface Delivery {
  id: number;
  trackingNumber: string;
  customerId: number;
  customerName?: string;
  deliveryPartnerId?: number | null;
  deliveryPartnerName?: string | null;
  facilityId: number;
  facilityName: string;
  destinationNodeId: number;
  destinationNodeName: string;
  status: DeliveryStatus;
  recipientName: string;
  recipientPhone: string;
  deliveryDescription?: string;
  landmark?: string;
  accessInstructions?: string;
  preferredTimeWindow?: string;
  recommendedGateId?: number | null;
  recommendedGateName?: string | null;
  totalDistanceMeters?: number;
  estimatedTimeSeconds?: number;
  actualDurationSeconds?: number;
  createdAt: string;
  assignedAt?: string;
  acceptedAt?: string;
  startedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
}

export interface Obstacle {
  id: number;
  facilityId: number;
  facilityName?: string;
  locationNodeId?: number | null;
  locationNodeName?: string | null;
  locationEdgeId?: number | null;
  obstacleType: ObstacleType;
  description?: string;
  severity: string;
  status: string;
  reportedById?: number | null;
  reportedByName?: string | null;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  expiresAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface RouteInstruction {
  stepNumber: number;
  instruction: string;
  nodeName: string;
  nodeType: string;
  distanceMeters: number;
  timeSeconds: number;
  iconType: string;
}

export interface RouteCalculationResponse {
  routeFound: boolean;
  message?: string;
  recommendedGate?: LocationNode;
  pathNodes: LocationNode[];
  pathEdges: LocationEdge[];
  totalDistanceMeters: number;
  estimatedTimeSeconds: number;
  isAccessible: boolean;
  instructions: RouteInstruction[];
  obstaclesAvoided: string[];
  recommendationRationale: string;
  alternativeRoutes: RouteCalculationResponse[];
}

export interface AnalyticsOverview {
  totalFacilities: number;
  totalUsers: number;
  totalCustomers: number;
  totalDeliveryPartners: number;
  totalDeliveries: number;
  completedDeliveries: number;
  activeDeliveries: number;
  failedDeliveries: number;
  activeObstacles: number;
  averageDurationSeconds: number;
  averageDistanceMeters: number;
  completionSuccessRate: number;
  deliveriesByStatus: Record<string, number>;
  obstaclesByType: Record<string, number>;
}
