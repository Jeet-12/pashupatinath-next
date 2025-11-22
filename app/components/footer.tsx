"use client";

import Link from 'next/link';
import Image from 'next/image';
import { memo, useState, useEffect, useRef } from 'react';

// WhatsApp Floating Button Component
const WhatsAppFloatingButton = memo(() => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '7377371008';
    const message = 'Hello! I would like to get a consultation about Rudraksha beads.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50 md:bottom-6 md:right-6 safe-area-inset-bottom flex items-center justify-center"
      aria-label="Chat on WhatsApp"
      style={{
        bottom: '6rem'
      }}
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.444"/>
      </svg>
    </button>
  );
});

WhatsAppFloatingButton.displayName = 'WhatsAppFloatingButton';

// Chatbot Modal Component
const ChatbotModal = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Array<{type: string; content: string; buttonComponent?: React.ReactNode}>>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const rudrakshaItems = [
    { name: 'Ganesh Rudraksha', path: '/products?category=ganesh' },
    { name: '1 Mukhi Rudraksha', path: '/products?category=1-mukhi' },
    { name: '2 Mukhi Rudraksha', path: '/products?category=2-mukhi' },
    { name: '3 Mukhi Rudraksha', path: '/products?category=3-mukhi' },
    { name: '4 Mukhi Rudraksha', path: '/products?category=4-mukhi' },
    { name: '5 Mukhi Rudraksha', path: '/products?category=5-mukhi' },
    { name: '6 Mukhi Rudraksha', path: '/products?category=6-mukhi' },
    { name: '7 Mukhi Rudraksha', path: '/products?category=7-mukhi' },
    { name: '8 Mukhi Rudraksha', path: '/products?category=8-mukhi' },
    { name: '9 Mukhi Rudraksha', path: '/products?category=9-mukhi' },
    { name: '10 Mukhi Rudraksha', path: '/products?category=10-mukhi' },
    { name: '11 Mukhi Rudraksha', path: '/products?category=11-mukhi' },
    { name: '12 Mukhi Rudraksha', path: '/products?category=12-mukhi' },
    { name: '13 Mukhi Rudraksha', path: '/products?category=13-mukhi' },
    { name: '14 Mukhi Rudraksha', path: '/products?category=14-mukhi' },
  ];

  const questions = [
    'Please enter your complete full name (First and Last name):',
    'Enter your date of birth in DD/MM/YYYY format only (Example: 15/08/1990):',
    'Enter your exact birth time in HH:MM AM/PM format (Example: 10:30 AM or 09:45 PM):',
    'Enter the city where you were born:',
    'What is your profession/career? (Student/Business/Engineer/Doctor/Teacher/etc.):',
    'Enter your email address in correct format (Example: name@domain.com):',
    'Enter your contact number (minimum 10 digits):'
  ];

  const questionKeys = ['name', 'dob', 'birthTime', 'city', 'career', 'email', 'contact'];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to top when important messages are added
  useEffect(() => {
    if (chatMessagesRef.current && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // Check if this is an important message that should show from top
      const isImportantMessage = 
        lastMessage.type === 'bot' && 
        (lastMessage.content.includes('Welcome') || 
         lastMessage.content.includes('PROFESSIONAL RUDRAKSHA RECOMMENDATION'));
      
      if (isImportantMessage) {
        // Scroll to top immediately and then again after a short delay
        chatMessagesRef.current.scrollTop = 0;
        
        const scrollToTop = () => {
          if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = 0;
          }
        };
        
        // Multiple attempts to ensure it stays at top
        setTimeout(scrollToTop, 50);
        setTimeout(scrollToTop, 100);
        setTimeout(scrollToTop, 200);
      } else {
        // For regular messages, scroll to bottom
        setTimeout(() => {
          if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
          }
        }, 100);
      }
    }
  }, [messages]);

  // Scroll when typing changes
  useEffect(() => {
    if (chatMessagesRef.current && !isTyping) {
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [isTyping]);

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      // Add welcome message when chatbot opens
      const welcomeMessage = {
        type: 'bot',
        content: `नमस्ते! 🙏 Welcome to your personalized Rudraksha consultation.

🔮 Your Spiritual Journey Begins Here
I will analyze your birth chart using authentic Vedic numerology to recommend the perfect Rudraksha for your spiritual and professional growth.

✅ 100% Vedic Numerology Based
✅ Personalized Career & Life Analysis  
✅ Authentic Spiritual Guidance

🔒 Your information is completely confidential and secure`
      };
      setMessages([welcomeMessage]);
    }
  }, [isVisible, messages.length]);

  const toggleChatbot = () => {
    setIsVisible(!isVisible);
    if (!isVisible) {
      // Reset when opening
      setMessages([]);
      setCurrentStep(0);
      setUserData({});
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const validateInput = (key: string, input: string): { valid: boolean; message?: string } => {
    const trimmedInput = input.trim();
    
    switch(key) {
      case 'name':
        if (trimmedInput.length < 2) {
          return { valid: false, message: "❌ Name must be at least 2 characters long." };
        }
        if (!/^[a-zA-Z\s]+$/.test(trimmedInput)) {
          return { valid: false, message: "❌ Name must contain only letters and spaces." };
        }
        break;
        
      case 'dob':
        const dobPattern = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dobPattern.test(trimmedInput)) {
          return { valid: false, message: "❌ Date format must be DD/MM/YYYY (Example: 15/08/1990)." };
        }
        break;
        
      case 'birthTime':
        const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
        if (!timePattern.test(trimmedInput)) {
          return { valid: false, message: "❌ Time format must be HH:MM AM/PM (Example: 10:30 AM)." };
        }
        break;
        
      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(trimmedInput)) {
          return { valid: false, message: "❌ Please enter a valid email address." };
        }
        break;
        
      case 'contact':
        const digitCount = trimmedInput.replace(/\D/g, '').length;
        if (digitCount < 10) {
          return { valid: false, message: "❌ Contact number must contain at least 10 digits." };
        }
        break;
        
      default:
        return { valid: true };
    }
    
    return { valid: true };
  };

  const BuyNowButton = ({ mukhi }: { mukhi: number }) => {
    // Find the category path from rudrakshaItems
    const rudrakshaItem = rudrakshaItems.find(item => 
      item.name.includes(`${mukhi} Mukhi`)
    );
    
    const redirectPath = rudrakshaItem ? rudrakshaItem.path : `/products?search=${mukhi} mukhi rudraksha`;

    return (
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button 
          onClick={() => window.open(redirectPath, '_blank')}
          style={{
            background: 'linear-gradient(135deg, #f5821f 0%, #e07515 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '14px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 130, 31, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          🛒 BUY NOW - {mukhi} Mukhi Rudraksha
        </button>
      </div>
    );
  };

  const handleSendMessage = (quickMessage?: string) => {
    const message = quickMessage || chatInputRef.current?.value.trim();
    if (!message) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: message }]);
    
    // Clear input
    if (chatInputRef.current && !quickMessage) {
      chatInputRef.current.value = '';
    }

    // Validate input
    if (currentStep < questions.length) {
      const currentKey = questionKeys[currentStep];
      const validation = validateInput(currentKey, message);
      
      if (!validation.valid) {
        setMessages(prev => [...prev, { type: 'bot', content: validation.message! }]);
        return;
      }
    }

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response after delay
    setTimeout(() => {
      setIsTyping(false);
      
      if (currentStep < questions.length) {
        // Store user data
        const currentKey = questionKeys[currentStep];
        setUserData(prev => ({
          ...prev,
          [currentKey]: message
        }));

        // Move to next question or show results
        if (currentStep < questions.length - 1) {
          setMessages(prev => [...prev, { type: 'bot', content: questions[currentStep + 1] }]);
          setCurrentStep(prev => prev + 1);
        } else {
          // All questions completed - show analysis
          showAnalysis();
        }
      } else {
        // Conversation ended
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: "Thank you for your consultation! For another consultation, please refresh the chat." 
        }]);
      }
    }, 1500);
  };

  const showAnalysis = () => {
    // Simple numerology calculation based on name
    const name = userData.name || '';
    const lifePathNumber = name.length % 9 || 9;
    const recommendedMukhi = Math.min(Math.max(lifePathNumber, 1), 14);

    const rudrakshaDatabase = {
      1: { deity: "Lord Shiva", benefits: "Supreme consciousness, spiritual enlightenment" },
      2: { deity: "Ardhanarishvara", benefits: "Emotional balance, relationship harmony" },
      3: { deity: "Lord Agni", benefits: "Burns karma, boosts confidence" },
      4: { deity: "Lord Brahma", benefits: "Enhanced intelligence, communication skills" },
      5: { deity: "Lord Kalagni Rudra", benefits: "Overall health, mental peace" },
      6: { deity: "Lord Kartikeya", benefits: "Willpower, determination, focus" },
      7: { deity: "Goddess Lakshmi", benefits: "Wealth, abundance, prosperity" },
      8: { deity: "Lord Ganesha", benefits: "Obstacle removal, success" },
      9: { deity: "Goddess Durga", benefits: "Fearlessness, protection" },
      10: { deity: "Lord Vishnu", benefits: "Divine protection, peace" },
      11: { deity: "Lord Hanuman", benefits: "Wisdom, intuition" },
      12: { deity: "Lord Surya", benefits: "Leadership, authority" },
      13: { deity: "Lord Indra", benefits: "Charm, attraction" },
      14: { deity: "Lord Hanuman", benefits: "Intuitive powers, foresight" }
    };

    const rudraksha = rudrakshaDatabase[recommendedMukhi as keyof typeof rudrakshaDatabase];

    // First message with analysis and buy button
    const analysisMessage = {
      type: 'bot',
      content: `🔮 **PROFESSIONAL RUDRAKSHA RECOMMENDATION**

✨ **RECOMMENDED RUDRAKSHA:**
<span style="font-size: 20px; color: #8B4513; font-weight: bold;">${recommendedMukhi} Mukhi Rudraksha</span>

🙏 **RULING DEITY:**
${rudraksha.deity}

📿 **SACRED MANTRA:**
Om Hreem Namah

🔍 **WHY THIS RUDRAKSHA IS PERFECT FOR YOU:**
${rudraksha.benefits}

💼 **CAREER BENEFITS FOR ${userData.career?.toUpperCase() || 'YOUR PROFESSION'}:**
Enhanced performance, spiritual protection, and career growth

🎯 **NUMEROLOGICAL COMPATIBILITY:**
Accuracy Score: 92/100 based on your Life Path Number ${lifePathNumber}`,
      buttonComponent: <BuyNowButton mukhi={recommendedMukhi} />
    };

    // Second message with alert
    const finalMessage = {
      type: 'bot',
      content: `<div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 15px; border-radius: 10px; margin: 15px 0;">
  <strong>⚠️ SPIRITUAL TIMING ALERT:</strong><br>
  Based on your birth data, you're in a favorable period for spiritual advancement. Wearing the correct Rudraksha now can accelerate your progress!
</div>`
    };

    setMessages(prev => [...prev, analysisMessage, finalMessage]);
    setCurrentStep(prev => prev + 1); // Move past questions
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={toggleChatbot}
        className="fixed left-4 bg-[#f5821f] text-white p-4 rounded-full shadow-lg hover:bg-[#e07515] transition-all duration-300 z-50 md:bottom-6 md:left-6 safe-area-inset-bottom flex items-center justify-center"
        aria-label="Open Rudraksha Consultation"
        style={{
          bottom: '6rem'
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {isVisible && (
        <div 
          className="chatbot-modal fixed bottom-24 left-4 w-80 bg-white rounded-xl shadow-2xl z-50 md:bottom-20 md:left-6 border-2 border-[#8B4513]"
          style={{
            bottom: isMobile ? 'calc(6rem + env(safe-area-inset-bottom, 0px))' : 'calc(6rem + env(safe-area-inset-bottom, 0px))',
            height: '500px',
            display: 'block',
            maxHeight: isMobile ? '60vh' : '500px'
          }}
        >
          {/* Chat Header with Sacred Rudraksha Theme */}
          <div className="chat-header bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white p-4 rounded-t-xl flex justify-between items-center border-b-2 border-[#D2691E]">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">ॐ</span>
              </div>
              <h2 className="text-lg font-bold font-serif">RudraGuide Pro</h2>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-200">Live</span>
              <button 
                onClick={handleClose}
                className="close-chatbot bg-transparent border-none text-white text-lg cursor-pointer hover:text-amber-200 transition-colors ml-2"
                aria-label="Close chatbot"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div 
            ref={chatMessagesRef}
            className="chat-messages p-4 h-80 overflow-y-auto bg-gradient-to-b from-amber-50 to-orange-50" 
            style={{ 
              maxHeight: isMobile ? 'calc(60vh - 120px)' : '320px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message mb-4 ${
                  message.type === 'bot' 
                    ? 'flex justify-start' 
                    : 'flex justify-end'
                }`}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'bot' 
                      ? 'bg-[#8B4513]' 
                      : 'bg-blue-500'
                  }`}>
                    <span className={`text-white text-sm font-bold ${
                      message.type === 'bot' ? 'text-xs' : 'text-xs'
                    }`}>
                      {message.type === 'bot' ? 'ॐ' : 'You'}
                    </span>
                  </div>
                  
                  {/* Message Content */}
                  <div className={`flex-1 ${
                    message.type === 'bot' 
                      ? 'bg-white p-4 rounded-lg shadow-md border-l-4 border-[#8B4513]' 
                      : 'bg-blue-50 p-3 rounded-lg shadow-sm border-l-4 border-blue-500'
                  }`}>
                    {message.type === 'bot' && (
                      <div className="font-semibold text-[#8B4513] text-sm mb-1">RudraGuide Pro</div>
                    )}
                    <div 
                      className="text-gray-700 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                    />
                    {/* Render the button component if it exists */}
                    {message.buttonComponent && message.buttonComponent}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="typing-indicator flex justify-start space-x-1 mb-4">
                <div className="w-8 h-8 bg-[#8B4513] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">ॐ</span>
                </div>
                <div className="flex items-center space-x-1 bg-white p-3 rounded-lg border-l-4 border-[#8B4513]">
                  <div className="typing-dot w-2 h-2 bg-[#8B4513] rounded-full animate-bounce"></div>
                  <div className="typing-dot w-2 h-2 bg-[#8B4513] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="typing-dot w-2 h-2 bg-[#8B4513] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span className="text-xs text-gray-500 ml-2">Analyzing your chart...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Input Container */}
          <div className="input-container p-4 border-t border-amber-200 bg-white rounded-b-xl flex space-x-2">
            <input 
              ref={chatInputRef}
              type="text" 
              className="chat-input flex-1 border border-amber-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent bg-amber-50 placeholder-amber-600 text-[#8B4513] text-sm"
              placeholder={currentStep < questions.length ? "Type your response..." : "Type your message..."}
              autoComplete="off"
              onKeyPress={handleKeyPress}
            />
            <button 
              onClick={() => handleSendMessage()}
              className="send-btn bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white px-4 py-3 rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-300 font-semibold flex items-center space-x-1 text-sm"
            >
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
});

ChatbotModal.displayName = 'ChatbotModal';

// Social media icons as separate components for better performance
const SocialIcons = memo(() => {
  // Function to handle social media clicks
  const handleSocialClick = (platform: string, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button 
        onClick={() => handleSocialClick('youtube', 'https://www.youtube.com/@PashupatinathRudraksh')}
        className="bg-[#f5821f] p-2 rounded-full hover:bg-[#e07515] transition-colors"
        aria-label="YouTube"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
      </button>
      <button 
        onClick={() => handleSocialClick('instagram', 'https://www.instagram.com/pashupatinathrudraksh/?igsh=MWlkbXBicDM2YWY5dQ%3D%3D')}
        className="bg-[#f5821f] p-2 rounded-full hover:bg-[#e07515] transition-colors"
        aria-label="Instagram"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </button>
      <button 
        onClick={() => handleSocialClick('facebook', '#')}
        className="bg-[#f5821f] p-2 rounded-full hover:bg-[#e07515] transition-colors"
        aria-label="Facebook"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
        </svg>
      </button>
      <button 
        onClick={() => handleSocialClick('linkedin', '#')}
        className="bg-[#f5821f] p-2 rounded-full hover:bg-[#e07515] transition-colors"
        aria-label="LinkedIn"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </button>
    </>
  );
});

SocialIcons.displayName = 'SocialIcons';

// Payment icons component
const PaymentIcons = memo(() => (
  <div className="flex space-x-4 mt-4 md:mt-0">
    <div className="bg-white p-1 rounded h-6 flex items-center justify-center">
      <span className="text-xs font-bold text-blue-800">VISA</span>
    </div>
    <div className="bg-white p-1 rounded h-6 flex items-center justify-center">
      <span className="text-xs font-bold text-red-600">MC</span>
    </div>
    <div className="bg-white p-1 rounded h-6 flex items-center justify-center">
      <span className="text-xs font-bold text-blue-500">PP</span>
    </div>
    <div className="bg-white p-1 rounded h-6 flex items-center justify-center">
      <span className="text-xs font-bold text-blue-900">AMEX</span>
    </div>
  </div>
));

PaymentIcons.displayName = 'PaymentIcons';

// Contact information component
const ContactInfo = memo(() => {
  // Function to handle phone call
  const handleCallClick = () => {
    window.open('tel:7377371008', '_self');
  };

  // Function to handle email
  const handleEmailClick = () => {
    window.open('mailto:prudraksh108@gmail.com', '_self');
  };

  // Function to handle location/map
  const handleLocationClick = () => {
    const address = "Farishta Complex, I-Block, 5th Floor, Rajbandha Maidan, Raipur, Chhattisgarh-492001";
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3">
      <button 
        onClick={handleLocationClick}
        className="flex items-start w-full text-left hover:bg-white/5 rounded-lg p-2 transition-colors"
      >
        <svg className="w-5 h-5 text-[#f5821f] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6  0 3 3 0 016 0z" />
        </svg>
        <span className="text-gray-200 text-sm">Farishta Complex, I-Block, 5th Floor, Rajbandha Maidan, Raipur, Chhattisgarh-492001</span>
      </button>
      
      <button 
        onClick={handleEmailClick}
        className="flex items-center w-full text-left hover:bg-white/5 rounded-lg p-2 transition-colors"
      >
        <svg className="w-5 h-5 text-[#f5821f] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="text-gray-200 text-sm">prudraksh108@gmail.com</span>
      </button>
      
      <button 
        onClick={handleCallClick}
        className="flex items-center w-full text-left hover:bg-white/5 rounded-lg p-2 transition-colors"
      >
        <svg className="w-5 h-5 text-[#f5821f] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="text-gray-200 text-sm">7377371008</span>
      </button>
    </div>
  );
});

ContactInfo.displayName = 'ContactInfo';

// Link lists component
const LinkList = memo(({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 border-b border-[#f5821f] pb-2">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link 
            href={link.href} 
            className="text-gray-200 hover:text-[#f5821f] transition-colors text-sm"
            prefetch={false}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
));

LinkList.displayName = 'LinkList';

const LogoSection = memo(() => {
  // Function to handle phone call from the main number
  const handleMainCallClick = () => {
    window.open('tel:7377371008', '_self');
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-28 h-28">
        <Image
          src="https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/PR_Logo.png"
          alt="Pashupatinath Rudraksh Logo"
          fill
          sizes="112px"
          className="object-contain"
          priority
        />
      </div>
      
      <p className="text-sm text-gray-200 mb-6 leading-relaxed">
        Authentic, high-quality Rudraksha beads and spiritual items for peace, health, and spiritual growth.
      </p>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-100">Got Question? Call us 24/7</h3>
        <button 
          onClick={handleMainCallClick}
          className="text-2xl font-bold text-[#f5821f] hover:text-[#f8a45f] transition-colors cursor-pointer"
        >
          7377371008
        </button>
      </div>
    </div>
  );
});

LogoSection.displayName = 'LogoSection';

const MobileBottomMenu = memo(() => {
  const [activeItem, setActiveItem] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [lastScrollY]);

  // Function to handle WhatsApp consultation
  const handleConsultationClick = () => {
    const phoneNumber = '7377371008';
    const message = 'Hello! I would like to get a consultation about Rudraksha beads.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Function to handle phone call
  const handleCallClick = () => {
    window.open('tel:7377371008', '_self');
  };

  const menuItems = [
    { 
      key: 'home', 
      label: 'Home', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M2.25 12v7.5c0 1.5 1.123 2.25 2.25 2.25h15c1.5 0 2.25-.75 2.25-2.25V12M9 10.25v4.5m3-4.5v4.5m3-4.5v4.5" />
        </svg>
      ), 
      href: '/' 
    },
    { 
      key: 'consultation', 
      label: 'Consult', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
      ), 
      onClick: handleConsultationClick,
      isExternal: true
    },
    { 
      key: 'rudraksha', 
      label: 'Rudraksha', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" />
        </svg>
      ), 
      href: '/products?main-category=rudraksha'
    },
    { 
      key: 'accessories', 
      label: 'Accessories', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
        </svg>
      ), 
      href: '/products?main-category=rudraksha_accessories'
    },
    { 
      key: 'call', 
      label: 'Call Us', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
      ), 
      onClick: handleCallClick
    },
  ];

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-1 flex justify-between items-center md:hidden z-50
      shadow-lg transition-transform duration-300 ease-in-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      safe-area-inset-bottom
    `}
    style={{
      // Safari specific fixes
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))'
    }}>
      {menuItems.map((item) => (
        item.onClick ? (
          // Button for external links (WhatsApp, Call)
          <button
            key={item.key}
            onClick={() => {
              setActiveItem(item.key);
              item.onClick?.();
            }}
            className={`flex flex-col items-center justify-center flex-1 px-1 py-1 rounded-lg transition-all duration-200 min-w-0 ${
              activeItem === item.key 
                ? 'text-[#f5821f] bg-orange-50 transform scale-105' 
                : 'text-gray-600 hover:text-[#f5821f] hover:bg-gray-50'
            }`}
          >
            <div className={`transition-transform duration-200 ${activeItem === item.key ? 'scale-110' : 'scale-100'}`}>
              {item.icon}
            </div>
            <span className="text-xs font-medium mt-1 whitespace-nowrap">{item.label}</span>
          </button>
        ) : (
          // Link for internal navigation
          <Link
            key={item.key}
            href={item.href || '#'}
            className={`flex flex-col items-center justify-center flex-1 px-1 py-1 rounded-lg transition-all duration-200 min-w-0 ${
              activeItem === item.key 
                ? 'text-[#f5821f] bg-orange-50 transform scale-105' 
                : 'text-gray-600 hover:text-[#f5821f] hover:bg-gray-50'
            }`}
            onClick={() => setActiveItem(item.key)}
          >
            <div className={`transition-transform duration-200 ${activeItem === item.key ? 'scale-110' : 'scale-100'}`}>
              {item.icon}
            </div>
            <span className="text-xs font-medium mt-1 whitespace-nowrap">{item.label}</span>
          </Link>
        )
      ))}
    </div>
  );
});

MobileBottomMenu.displayName = 'MobileBottomMenu';

MobileBottomMenu.displayName = 'MobileBottomMenu';

export default function Footer() {
  const informationLinks = [
    { href: "/history", label: "About Us" },
    { href: "/#faq", label: "FAQ" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/contactus", label: "Contact Us" }
  ];

  const helpLinks = [
    { href: "/customer-service", label: "Customer Service" },
    { href: "/returns", label: "Returns Policy" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/shipping", label: "Shipping Info" },
    { href: "/tracking", label: "Order Tracking" },
    { href: "/size-guide", label: "Size Guide" }
  ];

  return (
    <>
      <footer className="bg-gradient-to-b from-[#5F3623] to-[#7a462c] text-white pb-20 md:pb-0 safe-area-inset-bottom">
        {/* Main footer content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company info and logo */}
            <div className="lg:col-span-1">
              <LogoSection />
            </div>

            {/* Information links */}
            <LinkList title="Information" links={informationLinks} />

            {/* Help links */}
            <LinkList title="Help" links={helpLinks} />

            {/* Contact information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-[#f5821f] pb-2">Get In Touch</h3>
              <ContactInfo />
              
              {/* Social media links */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-100">Follow Us</h3>
                <div className="flex space-x-3">
                  <SocialIcons />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t border-[#7a462c] py-6 bg-[#5F3623]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-200 text-sm text-center md:text-left">
                © {new Date().getFullYear()} PashupatinathRudraksh. All rights reserved.
              </p>
              <PaymentIcons />
            </div>
          </div>
        </div>

        {/* Back to top button - Hidden on mobile, visible on desktop */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hidden md:fixed md:bottom-6 md:right-6 bg-[#f5821f] text-white p-3 rounded-full shadow-lg hover:bg-[#e07515] transition-all duration-300 z-50 safe-area-inset-bottom"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </footer>

      {/* Mobile Bottom Menu */}
      <MobileBottomMenu />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton />

      {/* Chatbot Modal */}
      <ChatbotModal />
    </>
  );
}