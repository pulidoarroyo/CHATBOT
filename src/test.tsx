import React, { useState } from 'react';

const FeedbackViewer: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFeedbackHtml = async () => {
    setIsLoading(true);
    const url = 'http://localhost:8000/chatbot/chat/FeedBackPromt/29';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviamos un cuerpo vacío o datos si tu backend los requiere
        body: JSON.stringify({"message": "holaaaaaaaaaaaaaaaaaaa"}), 
      });

      if (!response.ok) throw new Error('Error al obtener el HTML');

      // Aquí está el truco: leemos como texto, no como JSON
      const html = await response.text();
      setHtmlContent(html);
    } catch (error) {
      console.error('Error:', error);
      setHtmlContent('<p style="color:red;">Error al cargar el contenido.</p>');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button 
        onClick={fetchFeedbackHtml}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Cargando...' : 'Obtener Feedback'}
      </button>

      <hr className="my-4" />

      {/* Contenedor donde se renderizará el HTML del backend */}
      <div 
        className="border p-4 rounded bg-gray-50"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </div>
  );
};

export default FeedbackViewer;