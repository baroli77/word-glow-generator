
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  console.log('Parse CV function called with method:', req.method)
  
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

    let extractedText = ''
    const fileExtension = fileName.split('.').pop()?.toLowerCase()

    console.log('Processing file type:', fileExtension)

    if (fileExtension === 'pdf') {
      extractedText = await parsePDF(fileData)
    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
      extractedText = await parseDOCX(fileData)
    } else if (fileExtension === 'txt') {
      // For text files, decode base64 and return as is
      const decoder = new TextDecoder()
      const uint8Array = Uint8Array.from(atob(fileData), c => c.charCodeAt(0))
      extractedText = decoder.decode(uint8Array)
    } else {
      throw new Error('Unsupported file format. Please upload PDF, DOCX, DOC, or TXT files.')
    }

    console.log('Text extraction completed, length:', extractedText.length)

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the file. Please try a different file or format.')
    }

    return new Response(
      JSON.stringify({ content: extractedText.trim() }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('CV parsing error:', error)
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
    // Dynamic import of PDF.js
    const pdfjsLib = await import('https://cdn.skypack.dev/pdfjs-dist@3.11.174')
    
    // Convert base64 to Uint8Array
    const uint8Array = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
    
    console.log('Loading PDF document...')
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise
    
    let fullText = ''
    console.log('PDF has', pdf.numPages, 'pages')
    
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log('Processing page', i)
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }
    
    if (!fullText.trim()) {
      throw new Error('PDF parsed but no readable text found.')
    }
    
    return fullText.trim()
  } catch (error) {
    console.error('PDF parsing error:', error)
    throw new Error(`Failed to parse PDF: ${error.message}`)
  }
}

async function parseDOCX(base64Data: string): Promise<string> {
  try {
    // For DOCX parsing, we'll use a simple approach with JSZip
    const JSZip = (await import('https://cdn.skypack.dev/jszip@3.10.1')).default
    
    // Convert base64 to Uint8Array
    const uint8Array = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
    
    console.log('Loading DOCX document...')
    const zip = await JSZip.loadAsync(uint8Array)
    const xml = await zip.file("word/document.xml")?.async("string")

    if (!xml) throw new Error("word/document.xml not found in DOCX file")

    console.log('Extracting text from DOCX...')
    const rawText = xml
      .replace(/<w:.*?>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (!rawText) throw new Error("DOCX parsed but no content found")

    return rawText
  } catch (error) {
    console.error('DOCX parsing error:', error)
    throw new Error(`Failed to parse DOCX: ${error.message}`)
  }
}
