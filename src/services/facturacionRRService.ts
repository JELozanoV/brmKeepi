// Service for Facturación RR API integration
// This service handles communication with the backend API for invoice analysis

import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';

export interface InvoiceAnalysisRequest {
  image: File;
  userId?: string;
}

export interface InvoiceAnalysisResponse {
  success: boolean;
  explanation: string;
  error?: string;
  metadata?: {
    confidence: number;
    processingTime: number;
    extractedData?: {
      amount?: number;
      period?: string;
      plan?: string;
      taxes?: number;
    };
  };
}

/**
 * Analyzes an invoice image using the backend API
 * @param request - The analysis request containing the image file
 * @returns Promise with the analysis response
 */
export const analyzeInvoice = async (
  request: InvoiceAnalysisRequest
): Promise<InvoiceAnalysisResponse> => {
  try {
    const formData = new FormData();
    formData.append('invoice', request.image); // Backend expects 'invoice' field

    // Note: userId is not used in current backend implementation

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.INVOICE_ANALYSIS}`, {
      method: 'POST',
      body: formData,
      // No custom headers needed for multipart/form-data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform backend response to match frontend interface
    return {
      success: true,
      explanation: data.analysis || '',
      metadata: {
        confidence: 0.95, // Default confidence since backend doesn't provide it
        processingTime: 0, // Backend doesn't provide processing time
      },
    };
  } catch (error) {
    console.error('Error analyzing invoice:', error);
    return {
      success: false,
      explanation: '',
      error: error instanceof Error ? error.message : 'Error desconocido al analizar la factura',
    };
  }
};

/**
 * Validates if an image file is suitable for analysis
 * @param file - The file to validate
 * @returns Object with validation result and error message if invalid
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'El archivo debe ser una imagen válida' };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'La imagen no debe superar los 10MB' };
  }

  // Check supported formats
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato no soportado. Use JPG, PNG, GIF o WebP'
    };
  }

  return { valid: true };
};

/**
 * Gets supported file formats for display
 * @returns String with supported formats
 */
export const getSupportedFormats = (): string => {
  return 'JPG, PNG, GIF, WebP (máx. 10MB)';
};