
interface ParsedFile {
  content: string;
  error?: string;
}

export async function parseFile(file: File): Promise<ParsedFile> {
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
        return { content: '', error: 'Unsupported file format' };
    }
  } catch (error) {
    return { content: '', error: `Failed to parse file: ${error.message}` };
  }
}

async function parsePDF(file: File): Promise<ParsedFile> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return { content: fullText.trim() };
  } catch (error) {
    return { content: '', error: `Failed to parse PDF: ${error.message}` };
  }
}

async function parseDOCX(file: File): Promise<ParsedFile> {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return { content: result.value };
  } catch (error) {
    return { content: '', error: `Failed to parse DOCX: ${error.message}` };
  }
}
