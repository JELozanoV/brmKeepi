import React, { useState, useRef } from 'react';
import '../styles/facturacion-rr.scss';
import { analyzeInvoice, validateImageFile, getSupportedFormats } from '../services/facturacionRRService';
import { useCurrentUser } from '../hooks/useCurrentUser';

const FacturacionRRPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useCurrentUser();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate the image file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Archivo no válido');
        return;
      }

      setSelectedImage(file);
      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Call API for explanation
      setLoading(true);
      setExplanation('');

      analyzeInvoice({
        image: file,
        userId: user?.id
      })
        .then((response) => {
          if (response.success) {
            setExplanation(response.explanation);
          } else {
            setError(response.error || 'Error al analizar la factura');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setError('Error al procesar la imagen. Inténtalo de nuevo.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExplanation('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="facturacion-rr-page">
      <div className="page-header">
        <h1 className="page-title">Facturación RR</h1>
        <p className="page-subtitle">
          Sube una captura de pantalla de la aplicación RR para obtener una explicación detallada de la factura
        </p>
      </div>

      <div className="facturacion-content">
        <div className="upload-section">
          <div className="upload-area" onClick={handleUploadClick}>
            {imagePreview ? (
              <div className="image-preview-container">
                <img
                  src={imagePreview}
                  alt="Vista previa de la factura"
                  className="image-preview"
                />
                <button
                  className="remove-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  aria-label="Remover imagen"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📷</div>
                <p className="upload-text">
                  Haz clic para seleccionar una imagen de la factura RR
                </p>
                <p className="upload-hint">
                  Formatos soportados: {getSupportedFormats()}
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        {imagePreview && (
          <div className="explanation-section">
            <h3 className="explanation-title">Explicación de la Factura</h3>

            {loading ? (
              <div className="loading-explanation">
                <div className="loading-spinner"></div>
                <p>Analizando la imagen...</p>
              </div>
            ) : (
              <div className="explanation-content">
                <div className="explanation-text">
                  {explanation}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacturacionRRPage;