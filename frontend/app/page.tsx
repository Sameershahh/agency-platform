"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Zap, BarChart3, MessageSquare, Cloud } from "lucide-react"

const services = [
  {
    icon: Zap,
    title: "AI Automation",
    description: "Streamline workflows with intelligent automation powered by cutting-edge neural networks.",
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    description: "Transform raw data into actionable insights with advanced analytics and visualization.",
  },
  {
    icon: MessageSquare,
    title: "Smart Chatbots",
    description: "Deploy conversational AI that understands context and delivers meaningful interactions.",
  },
  {
    icon: Cloud,
    title: "Cloud Integration",
    description: "Seamless integration with enterprise cloud infrastructure for scalable solutions.",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechVenture",
    quote: "NeuraStack transformed how we approach AI integration. Their solutions are elegant and powerful.",
    avatar: "🧠",
  },
  {
    name: "Marcus Johnson",
    role: "Founder at DataFlow",
    quote: "The level of customization and support is unmatched. Highly recommended for enterprises.",
    avatar: "⚡",
  },
  {
    name: "Emma Rodriguez",
    role: "Product Lead at InnovateCo",
    quote: "Implementation was smooth and the ROI was evident within weeks. Exceptional team.",
    avatar: "✨",
  },
]

export default function Home() {
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-background overflow-hidden">
     {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Animated background gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute top-20 left-1/2 w-96 h-96 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -30, 30, 0],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-secondary/20 via-primary/20 to-accent/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 50, 0],
              y: [0, 30, -30, 0],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              AI-Powered Solutions for the Modern Web
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Building the next era of intelligent digital systems. Enterprise-grade AI solutions designed for
              innovation.
            </motion.p>
            <motion.div
              className="flex flex-col md:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-primary via-accent to-secondary rounded-full text-white font-semibold text-lg hover:shadow-lg glow-primary transition-smooth flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 border border-primary/40 rounded-full text-foreground font-semibold hover:bg-primary/10 transition-smooth flex items-center justify-center"
              >
                Explore Solutions
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Card Preview */}
          <motion.div
            className="mt-20 glass rounded-2xl p-8 border border-primary/20 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="flex-1 h-2 bg-muted/30 rounded w-2/3" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <div className="flex-1 h-2 bg-muted/30 rounded w-4/5" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <div className="flex-1 h-2 bg-muted/30 rounded w-3/4" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-primary/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Enterprise <span className="gradient-text">AI Services</span>
            </h2>
            <p className="text-lg text-foreground/60">Comprehensive solutions tailored to your business needs</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={index}
                  className="group relative glass rounded-xl p-8 border border-primary/20 hover:border-primary/50 cursor-pointer transition-smooth"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredService(index)}
                  onHoverEnd={() => setHoveredService(null)}
                  whileHover={{ y: -5 }}
                >
                  {/* Glow effect on hover */}
                  {hoveredService === index && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-xl -z-10"
                      layoutId="hoverGlow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}

                  <Icon className="text-primary mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-foreground/60 mb-4">{service.description}</p>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-primary group-hover:gap-3 transition-all"
                  >
                    Learn More
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-primary/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by <span className="gradient-text">Industry Leaders</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="glass rounded-xl p-8 border border-primary/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <p className="text-foreground/80 mb-6 italic">{`"${testimonial.quote}"`}</p>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-foreground/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </main>
  )
}
