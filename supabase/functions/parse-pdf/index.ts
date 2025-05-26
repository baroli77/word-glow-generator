
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  console.log('Parse PDF function called with method:', req.method)
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the requesting user
    const authorization = req.headers.get('Authorization')
    console.log('Authorization header present:', !!authorization)
    
    if (!authorization) {
      console.error('Missing Authorization header')
      throw new Error('Missing Authorization header')
    }

    const supabase = createClient(
      SUPABASE_URL ?? '',
      SUPABASE_ANON_KEY ?? '',
      {
        global: {
          headers: {
            Authorization: authorization,
          },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log('User authentication result:', { user: !!user, error: userError })

    if (userError || !user) {
      console.error('Authentication failed:', userError)
      throw new Error('Not authenticated')
    }

    // Get the request body
    const { fileData, fileName, fileType } = await req.json()
    console.log('Received file:', { fileName, fileType, dataLength: fileData?.length || 0 })

    if (!fileData || !fileName || !fileType) {
      console.error('Missing file data, name, or type')
      throw new Error('Missing file data, name, or type')
    }

    // Check file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024
    if (fileData.length > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds 5MB limit. Current size: ${(fileData.length / (1024 * 1024)).toFixed(1)}MB`)
    }

    // Verify it's a PDF file
    if (!fileType.includes('pdf')) {
      throw new Error('Only PDF files are supported by this endpoint')
    }

    console.log('Processing PDF file...')
    const extractedText = await parsePDF(fileData)

    console.log('Text extraction completed, length:', extractedText.length)

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the PDF file. Please try a different file or format.')
    }

    return new Response(
      JSON.stringify({ content: extractedText.trim() }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('PDF parsing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function parsePDF(base64Data: string): Promise<string> {
  try {
    // Use pdf-parse library for PDF text extraction
    const pdfParse = (await import('https://esm.sh/pdf-parse@1.1.1')).default
    
    // Convert base64 to buffer
    const uint8Array = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
    const buffer = new Uint8Array(uint8Array)
    
    console.log('Parsing PDF with pdf-parse...')
    const data = await pdfParse(buffer)
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF parsed but no readable text found.')
    }
    
    console.log('PDF parsing successful, extracted text length:', data.text.length)
    return data.text.trim()
  } catch (error) {
    console.error('PDF parsing error:', error)
    throw new Error(`Failed to parse PDF: ${error.message}`)
  }
}
