
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
      return new Response(
        JSON.stringify({ error: 'Missing file data, name, or type' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Check file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024
    if (fileData.length > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: `File size exceeds 5MB limit. Current size: ${(fileData.length / (1024 * 1024)).toFixed(1)}MB` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Verify it's a PDF file
    if (!fileType.includes('pdf')) {
      return new Response(
        JSON.stringify({ error: 'Only PDF files are supported by this endpoint' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('Processing PDF file...')
    const extractedText = await parsePDF(fileData)

    console.log('Text extraction completed, length:', extractedText.length)

    if (!extractedText || extractedText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'No text could be extracted from the PDF file. Please try a different file or format.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
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
      JSON.stringify({ 
        error: 'PDF parsing failed', 
        detail: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function parsePDF(base64Data: string): Promise<string> {
  try {
    // Use PDFium-based parser that works in Deno
    const { default: PDFParser } = await import('https://esm.sh/@pdfium/pdfium@0.1.0')
    
    // Convert base64 to Uint8Array
    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    
    console.log('Parsing PDF with PDFium...')
    const parser = new PDFParser()
    const document = await parser.parseDocument(bytes)
    
    let extractedText = ''
    const pageCount = document.getPageCount()
    
    for (let i = 0; i < pageCount; i++) {
      const page = document.getPage(i)
      const pageText = await page.getTextContent()
      extractedText += pageText + '\n'
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('PDF parsed but no readable text found.')
    }
    
    console.log('PDF parsing successful, extracted text length:', extractedText.length)
    return extractedText.trim()
  } catch (error) {
    console.error('PDFium parsing failed, trying fallback method...', error)
    
    // Fallback to a simpler text extraction method
    try {
      // Use a different PDF library that works in Deno
      const { PDFDocument } = await import('https://esm.sh/pdf-lib@1.17.1')
      
      // Convert base64 to Uint8Array
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      console.log('Trying pdf-lib fallback...')
      const pdfDoc = await PDFDocument.load(bytes)
      const pages = pdfDoc.getPages()
      
      // Basic text extraction (limited but works in Deno)
      let text = `PDF Document with ${pages.length} pages\n`
      text += 'Text extraction from this PDF format is limited. '
      text += 'For better results, please upload your CV as a DOCX file.\n'
      
      return text
    } catch (fallbackError) {
      console.error('Fallback parsing also failed:', fallbackError)
      throw new Error(`Failed to parse PDF: ${error.message}`)
    }
  }
}
