
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
    
    // Set up worker with multiple fallback options
    if (typeof window !== 'undefined') {
      // Try multiple CDN sources for the worker
      const workerSources = [
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
        `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      ];
      
      // Use the first available worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSources[0];
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: false,
      // Disable worker if it fails to load
      useWorkerFetch: false,
      isEvalSupported: false
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
    
    // Provide more specific error messages
    if ((error as Error).message.includes('worker') || (error as Error).message.includes('fetch')) {
      return { content: '', error: 'PDF parsing failed due to network issues. Please try again or use a different file format.' };
    }
    
    return { content: '', error: `Failed to parse PDF: ${(error as Error).message}. Please ensure the PDF is not password protected and contains readable text.` };
  }
}

async function parseDOCX(file: File): Promise<ParsedFile> {
  try {
    // Simple text extraction approach to avoid module loading issues
    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);
    
    // Try to extract text content using basic string manipulation
    const textMatch = text.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
    if (textMatch) {
      const extractedText = textMatch.map(match => match.replace(/<[^>]*>/g, '')).join(' ').trim();
      if (extractedText && extractedText.length > 0) {
        return { content: extractedText };
      }
    }
    
    // If no text found with w:t tags, try a broader approach
    const paragraphMatch = text.match(/<w:p[^>]*>.*?<\/w:p>/gs);
    if (paragraphMatch) {
      const paragraphText = paragraphMatch
        .map(p => p.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(p => p.length > 0)
        .join('\n');
      
      if (paragraphText && paragraphText.length > 0) {
        return { content: paragraphText };
      }
    }
    
    return { content: '', error: 'This DOCX file couldn\'t be parsed. The document may be empty, corrupted, or in an unsupported format. Please try saving it as a PDF or plain text file.' };
    
  } catch (error) {
    console.error('DOCX parsing error:', error);
    
    return { content: '', error: 'Document parsing failed. Please try uploading a PDF version of your document instead.' };
  }
}
