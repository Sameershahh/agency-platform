"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const timeline = [
  { year: "2020", event: "Founded NeuraStack Labs with a vision for AI innovation" },
  { year: "2021", event: "Launched first enterprise AI solution" },
  { year: "2022", event: "Expanded to 50+ enterprise clients across industries" },
  { year: "2023", event: "Introduced advanced computer vision platform" },
  { year: "2024", event: "Achieved $50M in customer success metrics" },
  { year: "2025", event: "Expanding to global markets with 200+ team members" },
]

const team = [
  { name: "Alex Chen", role: "CEO & Co-founder", emoji: "👨‍💼" },
  { name: "Sarah Williams", role: "CTO & Co-founder", emoji: "👩‍💻" },
  { name: "Marcus Johnson", role: "VP of Product", emoji: "👨‍🎨" },
  { name: "Emma Rodriguez", role: "VP of Sales", emoji: "👩‍💼" },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* <Navbar /> */}

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            About NeuraStack Labs
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Pioneering the future of artificial intelligence with innovative solutions that empower businesses to
            achieve remarkable growth.
          </motion.p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-primary/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Our Mission",
                desc: "To democratize access to world-class AI solutions for enterprises worldwide.",
              },
              {
                title: "Our Vision",
                desc: "Building intelligent systems that augment human capability and drive innovation.",
              },
              {
                title: "Our Values",
                desc: "Innovation, integrity, and impact—delivering excellence in every interaction.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="glass rounded-xl p-8 border border-primary/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <h3 className="text-2xl font-bold mb-4 gradient-text">{item.title}</h3>
                <p className="text-foreground/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-primary/10">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold mb-16 text-center gradient-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Our Journey
          </motion.h2>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className="flex gap-6 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 w-24 pt-1">
                  <div className="text-lg font-bold gradient-text">{item.year}</div>
                </div>
                <div className="flex-grow">
                  <div className="glass rounded-lg p-6 border border-primary/20">
                    <p className="text-foreground/80">{item.event}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-primary/10">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold mb-16 text-center gradient-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Leadership Team
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="glass rounded-xl p-8 border border-primary/20 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-5xl mb-4">{member.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-foreground/60">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </main>
  )
}
