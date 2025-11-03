"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Zap, BarChart3, MessageSquare, Cloud, Eye, Cpu, Shield, Trello } from "lucide-react"

const detailedServices = [
  {
    icon: Zap,
    title: "AI Automation",
    description:
      "Streamline workflows and reduce manual tasks with intelligent automation powered by cutting-edge neural networks.",
    features: ["Process Automation", "Workflow Optimization", "Task Scheduling", "Smart Triggers"],
    gradient: "from-primary via-purple-500 to-primary",
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    description: "Transform raw data into actionable insights with advanced analytics and real-time visualization.",
    features: ["Real-time Analytics", "Predictive Modeling", "Custom Dashboards", "Data Visualization"],
    gradient: "from-accent via-blue-500 to-accent",
  },
  {
    icon: MessageSquare,
    title: "Smart Chatbots",
    description: "Deploy conversational AI that understands context and delivers meaningful customer interactions.",
    features: ["NLP Integration", "24/7 Support", "Multi-language", "Context Awareness"],
    gradient: "from-cyan-500 via-blue-500 to-accent",
  },
  {
    icon: Cloud,
    title: "Cloud Integration",
    description: "Seamless integration with enterprise cloud infrastructure for infinitely scalable solutions.",
    features: ["Multi-cloud Support", "API Integration", "Scalability", "Security Compliance"],
    gradient: "from-secondary via-teal-500 to-secondary",
  },
  {
    icon: Eye,
    title: "Computer Vision",
    description: "Advanced image recognition and video analysis for intelligent visual data processing.",
    features: ["Image Recognition", "Video Analysis", "Object Detection", "Quality Control"],
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    icon: Cpu,
    title: "ML Infrastructure",
    description: "Enterprise-grade machine learning infrastructure for developing and deploying models at scale.",
    features: ["Model Training", "GPU Computing", "MLOps Pipeline", "Model Deployment"],
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Robust security measures and compliance frameworks to protect your AI investments.",
    features: ["Data Encryption", "Access Control", "Audit Logs", "Compliance Reports"],
    gradient: "from-green-500 via-emerald-500 to-teal-500",
  },
  {
    icon: Trello,
    title: "Custom Solutions",
    description: "Bespoke AI solutions tailored to your unique business requirements and challenges.",
    features: ["Consultation", "Custom Development", "Integration", "Support & Maintenance"],
    gradient: "from-fuchsia-500 via-purple-500 to-primary",
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-primary/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">Comprehensive Services</h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
              From automation to analytics, we offer a complete suite of AI-powered solutions designed for enterprise
              success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {detailedServices.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={index}
                  className="group glass rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-smooth"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-foreground/60 text-sm mb-4">{service.description}</p>
                  <ul className="space-y-1 text-xs text-foreground/50">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
