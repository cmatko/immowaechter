/**
 * Typed Supabase Client for ImmoWächter
 * Provides type-safe database operations
 */

import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Singleton Browser Client to prevent multiple instances
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return browserClient;
}
import type {
  User,
  Profile,
  Property,
  MaintenanceType,
  Maintenance,
  Component,
  MaintenanceInterval,
  Waitlist,
  PropertyWithUser,
  PropertyWithMaintenances,
  MaintenanceWithType,
  MaintenanceWithProperty,
  ComponentWithProperty,
  ComponentWithInterval,
  ComponentWithPropertyAndInterval,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  CreateMaintenanceRequest,
  UpdateMaintenanceRequest,
  CreateComponentRequest,
  UpdateComponentRequest,
  PropertyFilters,
  MaintenanceFilters,
  ComponentFilters,
  SortConfig,
  PaginationConfig,
  DatabaseTable,
} from '@/types/database';

// ============================================================================
// SUPABASE DATABASE SCHEMA
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
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string;
          phone?: string | null;
        };
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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      property_type: 'house' | 'apartment' | 'multi_family' | 'commercial';
      maintenance_status: 'pending' | 'overdue' | 'completed' | 'cancelled';
      component_status: 'active' | 'inactive' | 'maintenance_required' | 'overdue';
    };
  };
}

// ============================================================================
// TYPED SUPABASE CLIENTS
// ============================================================================

// Client-side Supabase client (with RLS) - Lazy initialization
export const supabase = (() => {
  // Only initialize if env vars are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables not available');
    return null as any;
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Session timeout: 5 Minuten (300 Sekunden)
        sessionTimeout: 300,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'supabase.auth.token',
        flowType: 'pkce'
      }
    }
  );
})();

// Admin client (bypasses RLS - use with caution!)
export const supabaseAdmin = (() => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Supabase admin environment variables not available');
    return null as any;
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
})();

// ============================================================================
// TYPED DATABASE OPERATIONS
// ============================================================================

export class TypedSupabaseClient {
  constructor(private client: typeof supabase) {}

  // ============================================================================
  // USER OPERATIONS
  // ============================================================================

  async getUser(id: string) {
    const { data, error } = await (this.client as any)
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  async getUserProfile(id: string) {
    const { data, error } = await (this.client as any)
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  async createUserProfile(profile: Database['public']['Tables']['profiles']['Insert']) {
    const { data, error } = await (this.client as any)
      .from('profiles')
      .insert(profile as any)
      .select()
      .single();
    
    return { data, error };
  }

  async updateUserProfile(id: string, updates: any) {
    const { data, error } = await (this.client as any)
      .from('profiles')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }

  // ============================================================================
  // PROPERTY OPERATIONS
  // ============================================================================

  async getProperties(userId: string, filters?: PropertyFilters) {
    let query = this.client
      .from('properties')
      .select('*')
      .eq('user_id', userId);

    if (filters?.property_type) {
      query = query.eq('property_type', filters.property_type);
    }

    if (filters?.city) {
      query = query.eq('city', filters.city);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    return { data, error };
  }

  async getProperty(id: string, userId: string) {
    const { data, error } = await (this.client as any)
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    return { data, error };
  }

  async createProperty(property: CreatePropertyRequest & { user_id: string }) {
    const { data, error } = await (this.client as any)
      .from('properties')
      .insert(property as any)
      .select()
      .single();
    
    return { data, error };
  }

  async updateProperty(id: string, updates: any): Promise<any> {
    return await (this.client as any)
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  }

  async deleteProperty(id: string, userId: string) {
    const { data, error } = await (this.client as any)
      .from('properties')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    
    return { data, error };
  }

  // ============================================================================
  // MAINTENANCE OPERATIONS
  // ============================================================================

  async getMaintenances(propertyId: string, filters?: MaintenanceFilters) {
    let query = this.client
      .from('maintenances')
      .select(`
        *,
        maintenance_types (
          id,
          name,
          category,
          interval_months,
          criticality
        )
      `)
      .eq('property_id', propertyId);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.is_overdue) {
      const today = new Date().toISOString().split('T')[0];
      query = query.lt('next_due', today);
    }

    const { data, error } = await query.order('next_due', { ascending: true });
    
    return { data, error };
  }

  async getMaintenance(id: string) {
    const { data, error } = await (this.client as any)
      .from('maintenances')
      .select(`
        *,
        maintenance_types (
          id,
          name,
          category,
          interval_months,
          criticality
        ),
        properties (
          id,
          name,
          address
        )
      `)
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  async createMaintenance(maintenance: CreateMaintenanceRequest) {
    const { data, error } = await (this.client as any)
      .from('maintenances')
      .insert(maintenance as any)
      .select(`
        *,
        maintenance_types (
          id,
          name,
          category,
          interval_months,
          criticality
        )
      `)
      .single();
    
    return { data, error };
  }

  async updateMaintenance(id: string, updates: UpdateMaintenanceRequest) {
    const { data, error } = await (this.client as any)
      .from('maintenances')
      .update(updates as any)
      .eq('id', id)
      .select(`
        *,
        maintenance_types (
          id,
          name,
          category,
          interval_months,
          criticality
        )
      `)
      .single();
    
    return { data, error };
  }

  async deleteMaintenance(id: string) {
    const { data, error } = await (this.client as any)
      .from('maintenances')
      .delete()
      .eq('id', id)
      .select();
    
    return { data, error };
  }

  // ============================================================================
  // COMPONENT OPERATIONS
  // ============================================================================

  async getComponents(propertyId: string, filters?: ComponentFilters) {
    let query = this.client
      .from('components')
      .select(`
        *,
        maintenance_intervals (
          id,
          component,
          interval_months
        )
      `)
      .eq('property_id', propertyId);

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    if (filters?.brand) {
      query = query.eq('brand', filters.brand);
    }

    const { data, error } = await query.order('next_maintenance', { ascending: true });
    
    return { data, error };
  }

  async getComponent(id: string) {
    const { data, error } = await (this.client as any)
      .from('components')
      .select(`
        *,
        maintenance_intervals (
          id,
          component,
          interval_months
        ),
        properties (
          id,
          name,
          address
        )
      `)
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  async createComponent(component: CreateComponentRequest) {
    const { data, error } = await (this.client as any)
      .from('components')
      .insert(component as any)
      .select(`
        *,
        maintenance_intervals (
          id,
          component,
          interval_months
        )
      `)
      .single();
    
    return { data, error };
  }

  async updateComponent(id: string, updates: UpdateComponentRequest) {
    const { data, error } = await (this.client as any)
      .from('components')
      .update(updates as any)
      .eq('id', id)
      .select(`
        *,
        maintenance_intervals (
          id,
          component,
          interval_months
        )
      `)
      .single();
    
    return { data, error };
  }

  async deleteComponent(id: string) {
    const { data, error } = await (this.client as any)
      .from('components')
      .delete()
      .eq('id', id)
      .select();
    
    return { data, error };
  }

  // ============================================================================
  // MAINTENANCE TYPE OPERATIONS
  // ============================================================================

  async getMaintenanceTypes() {
    const { data, error } = await (this.client as any)
      .from('maintenance_types')
      .select('*')
      .order('category', { ascending: true });
    
    return { data, error };
  }

  async getMaintenanceType(id: string) {
    const { data, error } = await (this.client as any)
      .from('maintenance_types')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  // ============================================================================
  // MAINTENANCE INTERVAL OPERATIONS
  // ============================================================================

  async getMaintenanceIntervals() {
    const { data, error } = await (this.client as any)
      .from('maintenance_intervals')
      .select('*')
      .order('component', { ascending: true });
    
    return { data, error };
  }

  async getMaintenanceInterval(id: string) {
    const { data, error } = await (this.client as any)
      .from('maintenance_intervals')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  // ============================================================================
  // WAITLIST OPERATIONS
  // ============================================================================

  async getWaitlistEntries() {
    const { data, error } = await (this.client as any)
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  }

  async getWaitlistEntry(email: string) {
    const { data, error } = await (this.client as any)
      .from('waitlist')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    return { data, error };
  }

  async createWaitlistEntry(entry: Database['public']['Tables']['waitlist']['Insert']) {
    const { data, error } = await (this.client as any)
      .from('waitlist')
      .insert(entry as any)
      .select()
      .single();
    
    return { data, error };
  }

  async updateWaitlistEntry(email: string, updates: Database['public']['Tables']['waitlist']['Update']) {
    const { data, error } = await (this.client as any)
      .from('waitlist')
      .update(updates as any)
      .eq('email', email.toLowerCase())
      .select()
      .single();
    
    return { data, error };
  }

  // ============================================================================
  // UTILITY OPERATIONS
  // ============================================================================

  async getDashboardStats(userId: string) {
    // Get property count
    const { count: propertyCount } = await (this.client as any)
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get maintenance counts
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { count: totalMaintenances } = await (this.client as any)
      .from('maintenances')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', this.client.from('properties').select('id').eq('user_id', userId));

    const { count: overdueMaintenances } = await (this.client as any)
      .from('maintenances')
      .select('*', { count: 'exact', head: true })
      .lt('next_due', today)
      .eq('property_id', this.client.from('properties').select('id').eq('user_id', userId));

    const { count: upcomingMaintenances } = await (this.client as any)
      .from('maintenances')
      .select('*', { count: 'exact', head: true })
      .gte('next_due', today)
      .lte('next_due', thirtyDaysFromNow.toISOString().split('T')[0])
      .eq('property_id', this.client.from('properties').select('id').eq('user_id', userId));

    return {
      total_properties: propertyCount || 0,
      total_maintenances: totalMaintenances || 0,
      overdue_maintenances: overdueMaintenances || 0,
      upcoming_maintenances: upcomingMaintenances || 0,
    };
  }
}

// ============================================================================
// SERVER-SIDE SUPABASE CLIENT
// ============================================================================

export function getSupabaseServerClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase environment variables not configured');
  }
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// ============================================================================
// EXPORT TYPED CLIENTS
// ============================================================================

export const typedSupabase = new TypedSupabaseClient(supabase);
export const typedSupabaseAdmin = new TypedSupabaseClient(supabaseAdmin);

// ============================================================================
// RE-EXPORT ORIGINAL CLIENTS FOR BACKWARD COMPATIBILITY
// ============================================================================

export { supabase as default };
