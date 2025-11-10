"use client"

import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"

export default function Terms() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-foreground mb-2">Terms & Conditions</h1>
            <p className="text-foreground/60 mb-8">Last updated: January 2025</p>

            <div className="space-y-8 text-foreground/80">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
                <p>
                  These Terms and Conditions constitute a legally binding agreement made between you and NeuraStack
                  Labs. By accessing and using this website, you accept and agree to be bound by the terms and provision
                  of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
                <p>
                  Permission is granted to temporarily download one copy of the materials (information or software) on
                  NeuraStack Labs' website for personal, non-commercial transitory viewing only. This is the grant of a
                  license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc ml-6 mt-3 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Disclaimer</h2>
                <p>
                  The materials on NeuraStack Labs' website are provided on an "as is" basis. NeuraStack Labs makes no
                  warranties, expressed or implied, and hereby disclaims and negates all other warranties including,
                  without limitation, implied warranties or conditions of merchantability, fitness for a particular
                  purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Limitations</h2>
                <p>
                  In no event shall NeuraStack Labs or its suppliers be liable for any damages (including, without
                  limitation, damages for loss of data or profit, or due to business interruption) arising out of the
                  use or inability to use the materials on NeuraStack Labs' website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Accuracy of Materials</h2>
                <p>
                  The materials appearing on NeuraStack Labs' website could include technical, typographical, or
                  photographic errors. NeuraStack Labs does not warrant that any of the materials on its website are
                  accurate, complete, or current.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Links</h2>
                <p>
                  NeuraStack Labs has not reviewed all of the sites linked to its website and is not responsible for the
                  contents of any such linked site. The inclusion of any link does not imply endorsement by NeuraStack
                  Labs of the site. Use of any such linked website is at the user's own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Modifications</h2>
                <p>
                  NeuraStack Labs may revise these terms of service for its website at any time without notice. By using
                  this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Governing Law</h2>
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of the United
                  States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
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
