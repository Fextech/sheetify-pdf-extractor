
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Define types for our database records
export interface PdfRecord {
  id: string;
  file_name: string;
  content: string[];
  created_at: string;
  expires_at: string;
}

/**
 * Saves PDF content to Supabase with auto-expiration
 */
export async function savePdfContent(
  fileName: string, 
  content: string[]
): Promise<{ id: string; error: any }> {
  // Calculate expiration time (current time + 30 minutes)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 30);
  
  const id = crypto.randomUUID();
  
  const { error } = await supabase
    .from('pdf_extractions')
    .insert({
      id,
      file_name: fileName,
      content,
      expires_at: expiresAt.toISOString(),
    });
    
  return { id, error };
}

/**
 * Retrieves PDF content from Supabase by ID
 */
export async function getPdfContentById(id: string): Promise<{ data: PdfRecord | null; error: any }> {
  const { data, error } = await supabase
    .from('pdf_extractions')
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
}

/**
 * Sets up a scheduled function to clean expired records
 * This would typically be handled by a Supabase Edge Function or Postgres function
 * For demo purposes, we're implementing a client-side check
 */
export async function cleanupExpiredRecords(): Promise<void> {
  const now = new Date().toISOString();
  
  await supabase
    .from('pdf_extractions')
    .delete()
    .lt('expires_at', now);
}
