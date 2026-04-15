"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Send, X, Minimize2, Bot } from "lucide-react"
import { sendChatMessage } from "@/lib/api"

interface Message {
  id: string
  text: string
  sender: "user" | "assistant"
  timestamp: Date
}

const SUGGESTED_QUESTIONS = [
  "What services does NeuraStack offer?",
  "How much does a project cost?",
  "Can you build a chatbot for my business?",
  "How do I get started?",
]

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm the NeuraStack AI Assistant 👋\n\nI can tell you about our services, pricing, projects, and how to get started. What would you like to know?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const buildHistory = () =>
    messages
      .filter((m) => m.id !== "1") // skip the greeting for brevity
      .map((m) => ({ role: m.sender, text: m.text }))

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const history = buildHistory()
      const data = await sendChatMessage(messageText, history)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "I couldn't generate a response. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: error.message || "Something went wrong. Please visit our /contact page to reach us directly.",
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const showSuggestions = messages.length === 1

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => { setIsOpen(!isOpen); setIsMinimized(false) }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center shadow-lg glow-primary z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={22} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-8 w-[380px] glass rounded-2xl border border-primary/20 shadow-2xl flex flex-col z-50 overflow-hidden"
            style={{ height: isMinimized ? "64px" : "520px" }}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-primary/20 flex items-center justify-between flex-shrink-0 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm gradient-text">NeuraStack AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-xs text-foreground/50">Powered by Gemini 2.5 Flash</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors"
                  aria-label="Minimize"
                >
                  <Minimize2 size={15} className="text-foreground/60" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X size={15} className="text-foreground/60" />
                </button>
              </div>
            </div>

            {/* Body */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence initial={false}>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.sender === "assistant" && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                            <Bot size={13} className="text-white" />
                          </div>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl max-w-[83%] text-sm leading-relaxed whitespace-pre-wrap ${
                            message.sender === "user"
                              ? "bg-gradient-to-br from-primary to-accent text-white rounded-tr-sm"
                              : "bg-primary/15 text-foreground rounded-tl-sm"
                          }`}
                        >
                          {message.text}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start items-center"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center flex-shrink-0 mr-2">
                        <Bot size={13} className="text-white" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-primary/15 flex gap-1.5 items-center">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary/60"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Suggested Questions */}
                  {showSuggestions && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2 pt-1"
                    >
                      {SUGGESTED_QUESTIONS.map((q, i) => (
                        <motion.button
                          key={i}
                          onClick={() => handleSend(q)}
                          className="w-full text-left text-xs px-3 py-2 rounded-lg border border-primary/25 text-foreground/70 hover:border-primary/60 hover:text-foreground hover:bg-primary/10 transition-all"
                          whileHover={{ x: 2 }}
                        >
                          {q}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-primary/20 flex-shrink-0 bg-primary/5">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about our services..."
                      disabled={isLoading}
                      className="flex-1 px-3.5 py-2.5 bg-input border border-primary/30 rounded-xl text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 text-foreground placeholder-foreground/40 disabled:opacity-60 transition-all"
                    />
                    <motion.button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      className="p-2.5 bg-gradient-to-br from-primary to-accent rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Send message"
                    >
                      <Send size={16} />
                    </motion.button>
                  </div>
                  <p className="text-center text-foreground/30 text-[10px] mt-2">
                    Powered by Gemini 2.5 Flash · NeuraStack Labs
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
