export type ListingType = 'sale' | 'rent' | 'commercial';
export type PropertyType = 'house' | 'apartment' | 'duplex' | 'penthouse' | 'office' | 'retail' | 'industrial' | 'industrial_unit' | 'retail_unit' | 'investment' | 'development' | 'other';
export type PropertyStatus = 'draft' | 'available' | 'under_offer' | 'sale_agreed' | 'let' | 'sold' | 'off_market';

export interface PropertyImage { id: string; storage_path: string; image_url: string; large_url?: string; alt: string | null; sort_order: number; is_cover: boolean }
export interface Property {
  id: string; slug: string; title: string; short_description: string | null; description: string | null;
  property_type: PropertyType; listing_type: ListingType; status: PropertyStatus; price: number | null; price_label: string | null;
  address: string | null; city: string | null; county: string | null; eircode: string | null; latitude: number | null; longitude: number | null;
  bedrooms: number | null; bathrooms: number | null; floor_area: number | null; floor_area_unit: string; property_reference: string | null;
  ber_rating: string | null; parking: string | null; available_from: string | null; featured: boolean; new_home: boolean; demo_data: boolean;
  published: boolean; exact_location_public: boolean; development_id: string | null; created_at: string; updated_at: string;
  property_images?: PropertyImage[]; property_features?: { feature: string }[];
  source_url?: string; category?: string; price_period?: string; floor_area_ft2?: number; area?: string; negotiator?: string;
  currency?: string; display_status?: string;
}
export interface Enquiry { id: string; name: string; email: string; phone: string | null; enquiry_type: string; property_id: string | null; property_reference: string | null; preferred_date: string | null; preferred_time: string | null; message: string; status: 'new' | 'contacted' | 'closed'; created_at: string }
export interface Development { id: string; slug: string; name: string; location: string; developer: string | null; description: string | null; unit_count: number | null; availability: string | null; price_from: number | null; completion_date: string | null; amenities: string[]; published: boolean; demo_data: boolean; created_at: string }

export type Database = { public: { Tables: { properties: { Row: Property }; property_images: { Row: PropertyImage }; enquiries: { Row: Enquiry }; developments: { Row: Development } } } };
