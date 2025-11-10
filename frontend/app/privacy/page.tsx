"use client"

import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"

export default function Privacy() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-foreground/60 mb-8">Last updated: January 2025</p>

            <div className="space-y-8 text-foreground/80">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                <p>
                  NeuraStack Labs ("we" or "us" or "our") operates the website. This page informs you of our policies
                  regarding the collection, use, and disclosure of personal data when you use our website and the
                  choices you have associated with that data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Information Collection and Use</h2>
                <p>
                  We collect several different types of information for various purposes to provide and improve our
                  website and services.
                </p>
                <h3 className="font-semibold text-foreground mt-4 mb-2">Types of Data Collected:</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    <span className="font-semibold text-foreground">Personal Data:</span> Email address, name, phone
                    number
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Usage Data:</span> Pages visited, time and date of
                    visit, referral source
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Technical Data:</span> IP address, browser type,
                    device type
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Use of Data</h2>
                <p>NeuraStack Labs uses the collected data for various purposes:</p>
                <ul className="list-disc ml-6 mt-3 space-y-2">
                  <li>To provide and maintain our services</li>
                  <li>To notify you about changes to our services</li>
                  <li>To provide customer support and respond to inquiries</li>
                  <li>To gather analysis or valuable information for service improvement</li>
                  <li>To monitor the usage of our services</li>
                  <li>To detect, prevent and address fraud or security issues</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Security of Data</h2>
                <p>
                  The security of your data is important to us, but remember that no method of transmission over the
                  internet or method of electronic storage is 100% secure. While we strive to use commercially
                  acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Data Protection Rights</h2>
                <p>
                  You have certain data protection rights. NeuraStack Labs aims to take reasonable steps to allow you to
                  correct, amend, delete, or limit the use of your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies</h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our website and hold certain
                  information. Cookies are files with small amount of data which may include an anonymous unique
                  identifier.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Children's Privacy</h2>
                <p>
                  Our website does not address anyone under the age of 18. We do not knowingly collect personally
                  identifiable information from children under 18. If you are a parent or guardian and you are aware
                  that your child has provided us with personal data, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at privacy@neurastacklabs.com.
                </p>
              </section>
            </div>
          </motion.div>
        </article>

        {/* Footer 
        <footer className="border-t border-border/20 py-12 px-4 mt-16">
          <div className="max-w-4xl mx-auto text-center text-foreground/50">
            <p>&copy; 2025 NeuraStack Labs. All rights reserved.</p>
          </div>
        </footer> */}
      </main>
    </>
  )
}
