"use client"

import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"
import { useState } from "react"

const pricingPlans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for small projects and startups",
    features: [
      "Up to 100k API calls/month",
      "Basic AI integrations",
      "Email support",
      "Community access",
      "1 team member",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$499",
    period: "/month",
    description: "For growing teams and businesses",
    features: [
      "Up to 1M API calls/month",
      "Advanced AI features",
      "Priority support",
      "Custom integrations",
      "Up to 10 team members",
      "Analytics dashboard",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large-scale deployments",
    features: [
      "Unlimited API calls",
      "Full AI suite",
      "24/7 support",
      "Custom deployment",
      "Unlimited team members",
      "Dedicated account manager",
    ],
    highlighted: false,
  },
]

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  return (
    <>
      {/* <Navbar /> */}
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
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p
              className="text-xl text-foreground/60 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Choose the perfect plan for your needs
            </motion.p>

            {/* Billing Toggle */}
            <motion.div
              className="inline-flex rounded-lg bg-card/50 border border-border/30 p-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  billingCycle === "monthly" ? "bg-primary text-foreground" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  billingCycle === "annual" ? "bg-primary text-foreground" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Annual (Save 20%)
              </button>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  className={`rounded-xl transition-all ${
                    plan.highlighted ? "glass-dark p-8 glow border-2 border-primary" : "glass p-8"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={plan.highlighted ? { y: -10 } : {}}
                >
                  {plan.highlighted && (
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-foreground text-xs font-bold mb-4">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-foreground/60 text-sm mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-foreground/60 text-sm">{plan.period}</span>
                  </div>

                  <button
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all mb-8 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-primary to-accent text-foreground hover:shadow-lg hover:shadow-primary/50"
                        : "border border-primary/50 text-foreground hover:bg-primary/10"
                    }`}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </button>

                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="text-foreground/70 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-20 bg-card/10 border-t border-border/20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can I change plans anytime?", a: "Yes, you can upgrade or downgrade at any time." },
                { q: "Do you offer refunds?", a: "We offer a 30-day money-back guarantee." },
                { q: "What payment methods do you accept?", a: "We accept all major credit cards and wire transfers." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="glass p-4 rounded-lg"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="font-medium text-foreground mb-2">{item.q}</p>
                  <p className="text-foreground/60 text-sm">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer 
        <footer className="border-t border-border/20 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center text-foreground/50">
            <p>&copy; 2025 NeuraStack Labs. All rights reserved.</p>
          </div>
        </footer> */}
      </main>
    </>
  )
}
