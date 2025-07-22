import React, { useState, useRef, useEffect } from 'react';
import { askIA } from '../../services/iaService';
import Markdown from './Markdown';
import './Chatbot.scss';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hola, soy CordiBot. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    await handleAskIA();
  };

  // Nueva función para manejar la lógica IA
  const handleAskIA = async () => {
    setError(null);
    const prompt = inputValue;
    setInputValue('');
    setLoading(true);
    setIsTyping(true);
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        text: prompt,
        sender: 'user',
        timestamp: new Date(),
      }
    ]);
    try {
      const iaRes = await askIA(prompt);
      console.log('Respuesta IA:', iaRes);
      if (!iaRes || !iaRes.response || iaRes.response.trim() === "") {
        setError('La IA no devolvió respuesta.');
        return;
      }
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: iaRes.response,
          sender: 'bot',
          timestamp: new Date(),
        }
      ]);
    } catch (err: any) {
      setError('Hubo un error al conectar con la IA. Intenta de nuevo.');
      console.error('Error IA:', err);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot toggle button */}
      <button 
        className="chatbot-toggle" 
        onClick={toggleChatbot}
        aria-label={isOpen ? "Cerrar chatbot" : "Abrir chatbot"}
      >
        {isOpen ? (
          <span className="close-icon">×</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>CordiBot</h3>
            <button 
              className="minimize-button" 
              onClick={toggleChatbot}
              aria-label="Minimizar chatbot"
            >
              _
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message) => (
  <div 
    key={message.id} 
    className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
  >
    <div className="message-content">
      {message.sender === 'bot' ? (
        <Markdown
          children={message.text}
          components={{
            h1: ({node, ...props}) => <h3 {...props} />,
            h2: ({node, ...props}) => <h4 {...props} />,
          }}
        />
      ) : (
        <span>{message.text}</span>
      )}
      <span className="message-time">{formatTime(message.timestamp)}</span>
    </div>
  </div>
))}

            {loading && (
              <div className="chatbot-message bot">
                <div className="message-content">
                  <p>CordiBot está pensando...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="chatbot-message error">
                <div className="message-content">
                  <p>{error}</p>
                </div>
              </div>
            )}

            {isTyping && (
              <div className="message bot-message">
                <div className="message-content typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Escribe tu pregunta aquí..."
              aria-label="Mensaje"
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim() || isTyping}
              aria-label="Enviar mensaje"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot
