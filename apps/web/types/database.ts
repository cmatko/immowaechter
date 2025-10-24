/**
 * Database Types for ImmoWächter
 * Generated from Prisma Schema and Supabase Tables
 */

// ============================================================================
// CORE DATABASE TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  country?: string; // ISO Country Code: AT, DE, etc.
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  postal_code?: string;
  city?: string;
  property_type: PropertyType;
  build_year?: number;
  living_area?: number;
  country: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceType {
  id: string;
  code: string;
  name: string;
  category: string;
  interval_months: number;
  criticality: number;
  price_min: number;
  price_max: number;
  legal_basis?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Maintenance {
  id: string;
  property_id: string;
  maintenance_type_id: string;
  last_done?: string;
  next_due: string;
  status: MaintenanceStatus;
  created_at: string;
  updated_at: string;
}

export interface Component {
  id: string;
  property_id: string;
  interval_id: string;
  custom_name?: string;
  brand?: string;
  model?: string;
  last_maintenance?: string;
  next_maintenance?: string;
  is_active: boolean;
  risk_level?: RiskLevel;
  days_overdue?: number;
  last_risk_calculation?: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceInterval {
  id: string;
  component: string;
  interval_months: number;
  created_at: string;
  updated_at: string;
}

export interface Waitlist {
  id: string;
  email: string;
  verified: boolean;
  verification_token?: string;
  token_expires_at?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ENUMS & LITERAL TYPES
// ============================================================================

export type PropertyType = 'house' | 'apartment' | 'multi_family' | 'commercial';

export type MaintenanceStatus = 'pending' | 'overdue' | 'completed' | 'cancelled';

export type MaintenanceCriticality = 1 | 2 | 3 | 4 | 5; // 1 = Low, 5 = Critical

export type ComponentStatus = 'active' | 'inactive' | 'maintenance_required' | 'overdue';

export type RiskLevel = 'safe' | 'warning' | 'danger' | 'critical' | 'legal';

// ============================================================================
// RISK SYSTEM TYPES
// ============================================================================

export interface RiskConsequence {
  id: string;
  component_type: string;
  country: string; // ISO Country Code: AT, DE, etc.
  death_risk: boolean;
  injury_risk: boolean;
  insurance_void: boolean;
  criminal_liability: boolean;
  damage_cost_min: number | null;
  damage_cost_max: number | null;
  insurance_reduction_percent: number | null;
  criminal_paragraph: string | null;
  max_fine_eur: number | null;
  max_prison_years: number | null;
  warning_yellow: string;
  warning_orange: string;
  warning_red: string;
  warning_black: string;
  real_case: string | null;
  statistic: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComponentRisk {
  level: RiskLevel;
  emoji: string;
  color: string;
  message: string;
  consequences: {
    death: boolean;
    injury: boolean;
    insurance: boolean;
    criminal: boolean;
    damage: { min: number; max: number };
  };
  realCase?: string;
  statistic?: string;
}

// ============================================================================
// RELATIONSHIP TYPES
// ============================================================================

export interface PropertyWithUser extends Property {
  user: User;
}

export interface PropertyWithMaintenances extends Property {
  maintenances: Maintenance[];
}

export interface MaintenanceWithType extends Maintenance {
  maintenance_type: MaintenanceType;
}

export interface MaintenanceWithProperty extends Maintenance {
  property: Property;
}

export interface ComponentWithProperty extends Component {
  property: Property;
}

export interface ComponentWithInterval extends Component {
  maintenance_interval: MaintenanceInterval;
}

export interface ComponentWithPropertyAndInterval extends Component {
  property: Property;
  maintenance_interval: MaintenanceInterval;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreatePropertyRequest {
  name: string;
  address: string;
  postal_code?: string;
  city?: string;
  property_type: PropertyType;
  build_year?: number;
  living_area?: number;
  country?: string;
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {
  id: string;
}

export interface CreateMaintenanceRequest {
  property_id: string;
  maintenance_type_id: string;
  last_done?: string;
  next_due: string;
  status?: MaintenanceStatus;
}

export interface UpdateMaintenanceRequest extends Partial<CreateMaintenanceRequest> {
  id: string;
}

export interface CreateComponentRequest {
  property_id: string;
  interval_id: string;
  custom_name?: string;
  brand?: string;
  model?: string;
  last_maintenance?: string;
  next_maintenance?: string;
  is_active?: boolean;
}

export interface UpdateComponentRequest extends Partial<CreateComponentRequest> {
  id: string;
}

// ============================================================================
// DASHBOARD & UI TYPES
// ============================================================================

export interface DashboardStats {
  total_properties: number;
  total_maintenances: number;
  overdue_maintenances: number;
  upcoming_maintenances: number;
}

export interface PropertySummary {
  id: string;
  name: string;
  address: string;
  property_type: PropertyType;
  maintenance_count: number;
  overdue_count: number;
  next_maintenance?: string;
}

export interface MaintenanceSummary {
  id: string;
  property_name: string;
  maintenance_type: string;
  next_due: string;
  days_until: number;
  status: MaintenanceStatus;
  is_overdue: boolean;
}

export interface ComponentSummary {
  id: string;
  custom_name?: string;
  brand?: string;
  model?: string;
  next_maintenance?: string;
  days_until: number;
  status: ComponentStatus;
  is_overdue: boolean;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface MaintenanceNotification {
  id: string;
  property_id: string;
  component_id: string;
  user_email: string;
  user_name?: string;
  property_name: string;
  component_name: string;
  next_maintenance: string;
  days_until: number;
  is_overdue: boolean;
  notification_type: 'upcoming' | 'overdue' | 'reminder';
}

export interface NotificationCheck {
  property_id: string;
  property_name: string;
  component_id: string;
  component_name: string;
  next_maintenance: string;
  days_until: number;
  is_overdue: boolean;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface PropertyFormData {
  name: string;
  address: string;
  postal_code: string;
  city: string;
  property_type: PropertyType;
  build_year: number;
  living_area: string; // Form field as string, converted to number
}

export interface MaintenanceFormData {
  property_id: string;
  maintenance_type_id: string;
  last_done: string;
  next_due: string;
  status: MaintenanceStatus;
}

export interface ComponentFormData {
  property_id: string;
  interval_id: string;
  custom_name: string;
  brand: string;
  model: string;
  last_maintenance: string;
  next_maintenance: string;
  is_active: boolean;
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

export interface PropertyFilters {
  property_type?: PropertyType;
  city?: string;
  has_overdue?: boolean;
  search?: string;
}

export interface MaintenanceFilters {
  property_id?: string;
  status?: MaintenanceStatus;
  is_overdue?: boolean;
  date_from?: string;
  date_to?: string;
}

export interface ComponentFilters {
  property_id?: string;
  is_active?: boolean;
  is_overdue?: boolean;
  brand?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface WaitlistResponse {
  success: boolean;
  message?: string;
  error?: string;
  resent?: boolean;
}

export interface AdminStats {
  total_users: number;
  verified_users: number;
  pending_users: number;
  verification_rate: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DatabaseTable = 
  | 'users'
  | 'profiles' 
  | 'properties'
  | 'maintenance_types'
  | 'maintenances'
  | 'components'
  | 'maintenance_intervals'
  | 'waitlist'
  | 'risk_consequences';

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  column: string;
  order: SortOrder;
}

export interface PaginationConfig {
  page: number;
  limit: number;
  offset: number;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isPropertyType(value: string): value is PropertyType {
  return ['house', 'apartment', 'multi_family', 'commercial'].includes(value);
}

export function isMaintenanceStatus(value: string): value is MaintenanceStatus {
  return ['pending', 'overdue', 'completed', 'cancelled'].includes(value);
}

export function isProperty(obj: any): obj is Property {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.address === 'string' &&
    isPropertyType(obj.property_type);
}

export function isMaintenance(obj: any): obj is Maintenance {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.property_id === 'string' &&
    typeof obj.maintenance_type_id === 'string' &&
    isMaintenanceStatus(obj.status);
}

// ============================================================================
// SUPABASE DATABASE TYPES
// ============================================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      properties: {
        Row: Property;
        Insert: Omit<Property, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>;
      };
      maintenance_types: {
        Row: MaintenanceType;
        Insert: Omit<MaintenanceType, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MaintenanceType, 'id' | 'created_at' | 'updated_at'>>;
      };
      maintenances: {
        Row: Maintenance;
        Insert: Omit<Maintenance, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Maintenance, 'id' | 'created_at' | 'updated_at'>>;
      };
      components: {
        Row: Component;
        Insert: Omit<Component, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Component, 'id' | 'created_at' | 'updated_at'>>;
      };
      maintenance_intervals: {
        Row: MaintenanceInterval;
        Insert: Omit<MaintenanceInterval, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MaintenanceInterval, 'id' | 'created_at' | 'updated_at'>>;
      };
      waitlist: {
        Row: Waitlist;
        Insert: Omit<Waitlist, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Waitlist, 'id' | 'created_at' | 'updated_at'>>;
      };
      risk_consequences: {
        Row: RiskConsequence;
        Insert: Omit<RiskConsequence, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<RiskConsequence, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

// All types are already exported as interfaces above
// No need for additional type re-exports
