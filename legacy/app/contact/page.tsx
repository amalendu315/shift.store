"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Mail,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Tracking & Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate mock server action response
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    "Namaste ShiftStore Team! I would like to inquire about my festive order and delivery status.",
  );
  const whatsappUrl = `https://wa.me/919876543210?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#141412] font-sans selection:bg-[#b48849] selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-[#141412] text-[#f6f3ec] py-2 px-4 text-center text-xs tracking-wider font-medium">
        <span>
          ⚡ PUJA SPECIAL: FLAT 33% OFF + FREE FAST SHIPPING • COD AVAILABLE
          ACROSS INDIA
        </span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#f6f3ec]/90 backdrop-blur-md border-b border-[#e7e1d6] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#6b6963] hover:text-[#141412] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight text-[#141412]"
            >
              ShiftStore
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#6b6963]">
            <Link
              href="/about"
              className="hover:text-[#141412] transition-colors"
            >
              Our Story
            </Link>
            <Link
              href="/policies"
              className="hover:text-[#141412] transition-colors"
            >
              Policies
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-xs font-semibold text-[#f6f3ec] bg-[#141412] rounded-lg hover:bg-[#2b2823] transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </header>

      {/* Main Contact Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#b48849] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Support Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#141412]">
            We're Here to Help.
          </h1>
          <p className="text-sm text-[#6b6963] max-w-lg mx-auto">
            Direct access to real human support in West Bengal. Connect on
            WhatsApp for lightning-fast replies or send us a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quick Channels & Info Cards (Left Column) */}
          <div className="lg:col-span-5 space-y-4">
            {/* WhatsApp Priority Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">WhatsApp Support</h3>
                    <p className="text-xs text-white/90">
                      Instant Human Chat (Under 5 mins)
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/20 text-xs font-semibold flex items-center justify-between">
                <span>+91 98765 43210</span>
                <span>Open Chat →</span>
              </div>
            </a>

            {/* Email Support Card */}
            <div className="p-6 bg-white border border-[#e7e1d6] rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f0ece1] flex items-center justify-center text-[#b48849]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#141412]">
                    Email Concierge
                  </h3>
                  <p className="text-xs text-[#6b6963]">
                    support@shiftstore.in
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#6b6963] leading-relaxed">
                For order modifications, corporate gifting inquiries, or bulk
                festive orders. Responses within 4 hours.
              </p>
            </div>

            {/* Business Hours & Warehouse Card */}
            <div className="p-6 bg-white border border-[#e7e1d6] rounded-2xl shadow-xs space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#b48849] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#141412] block">
                    Operating Hours
                  </span>
                  <span className="text-[#6b6963]">
                    Monday – Saturday: 10:00 AM – 7:00 PM IST
                  </span>
                  <span className="text-[#6b6963] block mt-0.5">
                    Sunday: WhatsApp Support Only
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#e7e1d6]/70">
                <MapPin className="w-4 h-4 text-[#b48849] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#141412] block">
                    Fulfillment Center
                  </span>
                  <span className="text-[#6b6963]">
                    ShiftStore India Logistics Hub, Sevoke Road, Siliguri, West
                    Bengal – 734001
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Column) */}
          <div className="lg:col-span-7 bg-white/80 border border-[#e7e1d6] rounded-2xl p-6 sm:p-8 shadow-xs">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#141412]">
                  Message Received!
                </h3>
                <p className="text-xs sm:text-sm text-[#6b6963] max-w-md mx-auto">
                  Thank you for reaching out, {formData.name}. Our Siliguri
                  customer support desk will reply via email and WhatsApp
                  shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "Order Inquiry",
                      message: "",
                    });
                  }}
                  className="px-5 py-2.5 bg-[#141412] text-[#f6f3ec] rounded-xl text-xs font-semibold hover:bg-[#2b2823] transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h2 className="font-serif font-bold text-xl text-[#141412]">
                    Send Us an Inquiry
                  </h2>
                  <p className="text-xs text-[#6b6963] mt-0.5">
                    Have a question regarding shipping times, COD, or custom
                    gifting?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141412] uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Rahul Sen"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-xl text-xs text-[#141412] focus:outline-none focus:border-[#b48849]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141412] uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="rahul@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-xl text-xs text-[#141412] focus:outline-none focus:border-[#b48849]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141412] uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="10-digit phone for WhatsApp update"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-xl text-xs text-[#141412] focus:outline-none focus:border-[#b48849]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141412] uppercase tracking-wider mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-xl text-xs text-[#141412] focus:outline-none focus:border-[#b48849]"
                    >
                      <option value="Order Tracking">
                        Order Tracking & Dispatch
                      </option>
                      <option value="COD Inquiry">
                        Cash on Delivery Details
                      </option>
                      <option value="Damage Replacement">
                        Damage Replacement Request
                      </option>
                      <option value="Corporate Gifting">
                        Puja Corporate Gifting
                      </option>
                      <option value="Other">Other Query</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141412] uppercase tracking-wider mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="How can our Siliguri team assist you today?"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-xl text-xs text-[#141412] focus:outline-none focus:border-[#b48849] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#b48849]" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e7e1d6] py-8 text-center text-xs text-[#6b6963] max-w-7xl mx-auto px-6 mt-16">
        <p>
          © 2026 ShiftStore India. Siliguri Fulfillment Hub. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
