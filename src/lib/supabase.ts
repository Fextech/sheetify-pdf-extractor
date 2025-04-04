import { createClient } from '@supabase/supabase-js';

// Load environment variables from import.meta.env (for Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Falling back to database.env values.');
}

// Create Supabase client with environment variables or fallback to database.env values
export const supabase = createClient(
  supabaseUrl || 'https://oxsxhekuogxemxsdbwxw.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94c3hoZWt1b2d4ZW14c2Rid3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3Nzg2NjcsImV4cCI6MjA1OTM1NDY2N30.TtRvF8cQ3ImhaLEcyn_LGxc6KZWaSKDOegxfrrbElso'
);

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

/**
 * Tests the Supabase connection
 * @returns True if the connection is successful, false otherwise
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('pdf_extractions').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return false;
  }
}
