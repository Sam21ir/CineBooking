import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleChat, addMessage, setLoading } from '../../store/slices/chatSlice';
import { getChatResponse } from '../../services/aiService';

export function ChatBot() {
    const dispatch = useAppDispatch();
    const { messages, isOpen, isLoading } = useAppSelector((state) => state.chat);
    const { movies } = useAppSelector((state) => state.movies);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');

        // Add user message to state
        dispatch(addMessage({ role: 'user', content: userMessage }));
        dispatch(setLoading(true));

        try {
            // Get AI response
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const response = await getChatResponse(userMessage, movies, history);

            // Add assistant response to state
            dispatch(addMessage({ role: 'assistant', content: response }));
        } catch (error) {
            console.error('Chat error:', error);
            dispatch(addMessage({
                role: 'assistant',
                content: "Désolé, je rencontre des difficultés techniques. Réessayez plus tard !"
            }));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => dispatch(toggleChat())}
                    className="fixed bottom-6 right-6 z-50 p-4 bg-red-600 text-white rounded-full shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors"
                >
                    <MessageSquare className="w-6 h-6" />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[400px] h-[500px] bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold leading-none">Assistant CineBooking</h3>
                                    <span className="text-white/60 text-xs">IA de recommandation</span>
                                </div>
                            </div>
                            <button
                                onClick={() => dispatch(toggleChat())}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`p-2 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-red-600' : 'bg-white/10'}`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-red-500" />}
                                        </div>
                                        <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user'
                                                ? 'bg-red-600 text-white rounded-tr-none'
                                                : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2 items-center bg-white/5 p-3 rounded-2xl text-xs text-gray-400 border border-white/10">
                                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                        En train de réfléchir...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[#0a0a0a] border-t border-white/10">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Posez votre question..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !inputValue.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-600 hover:text-red-500 disabled:text-gray-600 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
