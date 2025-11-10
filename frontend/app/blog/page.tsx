"use client"

import React from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Web Development",
    excerpt:
      "Exploring how artificial intelligence is reshaping web development practices and creating new possibilities.",
    date: "Jan 15, 2025",
    author: "Sarah Chen",
    category: "AI",
    image: "/ai-web-development.jpg",
  },
  {
    id: 2,
    title: "Machine Learning Best Practices",
    excerpt: "Learn the essential techniques for implementing machine learning models in production environments.",
    date: "Jan 10, 2025",
    author: "Mike Johnson",
    category: "ML",
    image: "/machine-learning-practices.jpg",
  },
  {
    id: 3,
    title: "Building Scalable AI Systems",
    excerpt: "Deep dive into architectural patterns for creating AI systems that can scale to millions of users.",
    date: "Jan 5, 2025",
    author: "Emma Davis",
    category: "Architecture",
    image: "/scalable-ai-systems.jpg",
  },
  {
    id: 4,
    title: "Neural Networks Demystified",
    excerpt: "A comprehensive guide to understanding how neural networks work and their applications.",
    date: "Dec 28, 2024",
    author: "James Wilson",
    category: "AI",
    image: "/neural-networks.jpg",
  },
  {
    id: 5,
    title: "Real-time Data Processing with AI",
    excerpt: "Techniques for processing massive streams of data in real-time using AI and machine learning.",
    date: "Dec 22, 2024",
    author: "Lisa Anderson",
    category: "Data",
    image: "/real-time-data-processing.jpg",
  },
  {
    id: 6,
    title: "Ethical AI: Building Responsibly",
    excerpt: "Exploring the ethical considerations and best practices for developing responsible AI systems.",
    date: "Dec 15, 2024",
    author: "Robert Chen",
    category: "Ethics",
    image: "/ethical-ai-development.jpg",
  },
]

export default function Blog() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32">
        {/* Header */}
        <section className="px-4 py-16 border-b border-border/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              NeuraStack Blog
            </motion.h1>
            <motion.p
              className="text-xl text-foreground/60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Insights, tips, and stories from the AI frontier
            </motion.p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="glass rounded-xl overflow-hidden group cursor-pointer h-full flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 3) * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Image */}
                  <div className="h-40 bg-card/50 overflow-hidden relative">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary/80 text-foreground text-xs font-semibold">
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-foreground/60 text-sm mb-4 flex-1">{post.excerpt}</p>

                    <div className="flex items-center justify-between text-xs text-foreground/50">
                      <span>{post.date}</span>
                      <span>{post.author}</span>
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="px-6 pb-6">
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <motion.div className="text-center mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
              <button className="px-8 py-3 rounded-lg border border-primary/50 text-foreground hover:bg-primary/10 transition-all font-medium">
                Load More Posts
              </button>
            </motion.div>
          </div>
        </section>

        {/* <Footer /> */}
      </main>
    </>
  )
}
