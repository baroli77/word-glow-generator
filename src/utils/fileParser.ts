import { toast } from "@/components/ui/use-toast";

interface ParsedFile {
  content: string;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export async function parseFile(file: File): Promise<ParsedFile> {
  // Check file size first
  if (file.size > MAX_FILE_SIZE) {
    const errorMessage = `File size exceeds 5MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(1)}MB`;
    toast({
      title: "File too large",
      description: errorMessage,
      variant: "destructive",
    });
    return { content: '', error: errorMessage };
  }

  try {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    switch (fileExtension) {
      case 'txt':
        return { content: await file.text() };
      
      case 'pdf':
        return await parsePDF(file);
      
      case 'docx':
      case 'doc':
        return await parseDOCX(file);
      
      default:
        const errorMessage = 'Unsupported file format';
        toast({
          title: "Unsupported file format",
          description: "Please upload a PDF, DOCX, DOC, or TXT file.",
          variant: "destructive",
        });
        return { content: '', error: errorMessage };
    }
  } catch (error) {
    console.error('File parsing error:', error);
    const errorMessage = `Failed to parse file: ${(error as Error).message}`;
    toast({
      title: "File parsing error",
      description: "There was an issue parsing your file. Please try a different file or format.",
      variant: "destructive",
    });
    return { content: '', error: errorMessage };
  }
}

async function parsePDF(file: File): Promise<ParsedFile> {
  try {
    // Dynamic import with proper error handling
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up worker with fallback
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: false
    }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    if (!fullText.trim()) {
      return { content: '', error: 'PDF appears to be empty or contains only images. Please use a text-based PDF.' };
    }
    
    return { content: fullText.trim() };
  } catch (error) {
    console.error('PDF parsing error:', error);
    return { content: '', error: `Failed to parse PDF: ${(error as Error).message}. Please ensure the PDF is not password protected and contains readable text.` };
  }
}

async function fallbackParseDOCX(file: File): Promise<string> {
  const JSZip = await import('jszip');
  const zip = await JSZip.default.loadAsync(file);
  const xml = await zip.file("word/document.xml")?.async("string");
  if (!xml) throw new Error("DOCX structure missing word/document.xml");
  return xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function parseDOCX(file: File): Promise<ParsedFile> {
  try {
    // First attempt: Use mammoth library
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    
    // First try to extract raw text
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.value && result.value.trim()) {
      return { content: result.value.trim() };
    }
    
    // If raw text extraction fails or returns empty, try HTML extraction
    const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
    if (htmlResult.value) {
      // Strip HTML tags to get plain text
      const textContent = htmlResult.value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (textContent) {
        return { content: textContent };
      }
    }
    
    // If mammoth returns no content, try fallback method
    console.log('Mammoth parsing returned no content, trying fallback method...');
    const fallbackContent = await fallbackParseDOCX(file);
    if (fallbackContent && fallbackContent.trim()) {
      return { content: fallbackContent };
    }
    
    return { content: '', error: 'This DOCX file couldn\'t be parsed. Try re-saving it in Word or upload a PDF version instead.' };
    
  } catch (error) {
    console.error('Mammoth parsing error:', error);
    
    // Try fallback method if mammoth fails
    try {
      console.log('Mammoth failed, trying fallback JSZip method...');
      const fallbackContent = await fallbackParseDOCX(file);
      if (fallbackContent && fallbackContent.trim()) {
        return { content: fallbackContent };
      }
    } catch (fallbackError) {
      console.error('Fallback parsing also failed:', fallbackError);
    }
    
    // Provide specific error messages for common issues
    let errorMessage = 'This DOCX file couldn\'t be parsed. Try re-saving it in Word or upload a PDF version instead.';
    
    if ((error as Error).message.includes('body element')) {
      errorMessage = 'Document format not recognized. Please save as a standard DOCX file or try converting to PDF.';
    } else if ((error as Error).message.includes('zip')) {
      errorMessage = 'Document appears to be corrupted. Please try re-saving the document.';
    }
    
    return { content: '', error: errorMessage };
  }
}
