"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FolderTree, 
  Search, 
  Shield, 
  Clock, 
  CheckCircle2, 
  BarChart3 
} from "lucide-react";

export default function OrganizedPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Image src="/Logo.jpg" alt="HAA" width={110} height={110} />
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                href="/auto"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Auto
              </Link>
              <Link
                href="/organized"
                className="text-sm font-medium text-primary hover:text-primary-600"
              >
                Organized
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:bg-[#f1f5f9] hover:text-[#186bbf]"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary-600 text-black rounded-full px-6">
                  Join Us for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-secondary">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/carousels/homepage-1.png')] bg-cover bg-center" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              STAY ORGANIZED
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              All your home and vehicle information in one place, searchable and always up-to-date
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Organization Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to keep your life organized and accessible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FolderTree,
                title: "Centralized Storage",
                description: "All your home and vehicle information stored in one secure location.",
                color: "bg-primary",
              },
              {
                icon: Search,
                title: "Powerful Search",
                description: "Quickly find any document, receipt, or piece of information you need.",
                color: "bg-primary-400",
              },
              {
                icon: Shield,
                title: "Secure & Safe",
                description: "Bank-level encryption ensures your data is always protected.",
                color: "bg-secondary",
              },
              {
                icon: Clock,
                title: "Real-Time Updates",
                description: "Always up-to-date information with automatic synchronization.",
                color: "bg-primary-600",
              },
              {
                icon: CheckCircle2,
                title: "Task Management",
                description: "Track maintenance tasks, reminders, and important deadlines.",
                color: "bg-primary-300",
              },
              {
                icon: BarChart3,
                title: "Analytics & Insights",
                description: "View your spending patterns and maintenance history at a glance.",
                color: "bg-gray-700",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow bg-white border border-gray-200 rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Organized?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Start organizing your home and vehicle information today and never lose track again.
          </p>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary-600 text-black rounded-full px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

