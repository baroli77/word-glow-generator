
import { toast } from "@/components/ui/use-toast";
import JSZip from 'jszip';

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
    
    let pdf;
    try {
      pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useSystemFonts: true,
        disableFontFace: false,
        // Disable worker if it fails to load
        useWorkerFetch: false,
        isEvalSupported: false
      }).promise;
    } catch (error) {
      throw new Error("Unable to load PDF. The file may be corrupted or encrypted.");
    }
    
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
      throw new Error("PDF parsed but no readable text found. Try a different file or use DOCX.");
    }
    
    return { content: fullText.trim() };
  } catch (error) {
    console.error('PDF parsing error:', error);
    const errorMessage = (error as Error).message;
    
    toast({
      title: "PDF Parsing Failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    return { content: '', error: errorMessage };
  }
}

async function parseDOCX(file: File): Promise<ParsedFile> {
  try {
    const zip = await JSZip.loadAsync(file);
    const xml = await zip.file("word/document.xml")?.async("string");

    if (!xml) throw new Error("word/document.xml not found");

    const rawText = xml
      .replace(/<w:.*?>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!rawText) throw new Error("DOCX parsed but no content found");

    return { content: rawText };
  } catch (error) {
    console.error("DOCX parsing error:", error);
    const errorMessage = "Failed to parse DOCX file. Try re-saving or upload a PDF.";
    toast({
      title: "DOCX Parsing Failed",
      description: errorMessage,
      variant: "destructive"
    });
    return { content: '', error: errorMessage };
  }
}
