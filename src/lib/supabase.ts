
import { createClient } from '@supabase/supabase-js';

// These environment variables must be set in your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your project settings.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Type definition for PDF extraction records
export interface PdfExtraction {
  id?: string;
  file_name: string;
  content: string[];
  created_at?: string;
  expires_at: string;
}

/**
 * Saves PDF extraction content to Supabase
 * @param fileName The name of the PDF file
 * @param content Array of extracted text content from PDF pages
 * @returns The created record or null if there was an error
 */
export async function savePdfExtraction(fileName: string, content: string[]): Promise<PdfExtraction | null> {
  try {
    // Calculate expiration time (30 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    
    const { data, error } = await supabase
      .from('pdf_extractions')
      .insert({
        file_name: fileName,
        content: content,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving PDF extraction:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in savePdfExtraction:', error);
    return null;
  }
}

/**
 * Gets PDF extraction content by ID
 * @param id The ID of the PDF extraction record
 * @returns The PDF extraction record or null if not found
 */
export async function getPdfExtraction(id: string): Promise<PdfExtraction | null> {
  try {
    const { data, error } = await supabase
      .from('pdf_extractions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error getting PDF extraction:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getPdfExtraction:', error);
    return null;
  }
}

/**
 * Sets up a cron job to delete expired PDF extractions
 */
export async function setupCleanupJob() {
  // This is typically handled by a server-side cron job
  // For a client-side app, we can check and clean up on app initialization
  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('pdf_extractions')
      .delete()
      .lt('expires_at', now);
    
    if (error) {
      console.error('Error cleaning up expired PDF extractions:', error);
    }
  } catch (error) {
    console.error('Error in setupCleanupJob:', error);
  }
}
