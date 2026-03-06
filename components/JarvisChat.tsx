import React, { useState, useEffect, useRef } from 'react';
import { useNotify } from '../App';
import api from '../services/api';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'jarvis';
  timestamp: Date;
}

const JarvisChat: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { notify } = useNotify();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: "Good day, sir. JARVIS online and ready to assist with threat analysis.",
    sender: 'jarvis',
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Center the chat window on first open
    if (isOpen && position.x === 0 && position.y === 0) {
      const centerX = (window.innerWidth - 384) / 2; // 384px = w-96
      const centerY = (window.innerHeight - 600) / 2;
      setPosition({ x: centerX, y: centerY });
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - 384;
        const maxY = window.innerHeight - 600;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const question = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/jarvis/ask', {
        question: question,
        context: `S.H.I.E.L.D Cybersecurity System - Current page: ${window.location.pathname}`
      });

      const jarvisMessage: Message = {
        id: messages.length + 2,
        text: response.response,
        sender: 'jarvis',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, jarvisMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "My apologies, sir. I'm experiencing connectivity issues. Please ensure the backend is running and try again.",
        sender: 'jarvis',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:scale-110"
        >
          <i className="fa-solid fa-robot text-2xl text-white group-hover:scale-110 transition-transform"></i>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatRef}
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            cursor: isDragging ? 'grabbing' : 'default'
          }}
          className={`fixed z-50 w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 ${isDarkMode ? 'bg-slate-900 border-cyan-500/50' : 'bg-white border-cyan-300'}`}
        >
          {/* Header - Draggable */}
          <div 
            onMouseDown={handleMouseDown}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex items-center justify-between select-none"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fa-solid fa-robot text-white text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-white">JARVIS</h3>
                <p className="text-xs text-cyan-100">AI Security Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              <i className="fa-solid fa-xmark text-white"></i>
            </button>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : isDarkMode ? 'bg-slate-800 text-slate-200 rounded-bl-none' : 'bg-white text-slate-800 rounded-bl-none shadow-sm'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-cyan-100' : 'text-slate-500'}`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className={`rounded-2xl p-3 rounded-bl-none ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask JARVIS anything..."
                className={`flex-1 px-4 py-2 rounded-full outline-none transition-all ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-700' : 'bg-slate-100 text-slate-900 placeholder-slate-400 focus:bg-slate-200'}`}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
              >
                <i className="fa-solid fa-paper-plane text-white"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JarvisChat;
