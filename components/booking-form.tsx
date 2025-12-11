"use client"

import { useState } from "react"
import { Check, Smartphone, User, CreditCard, ChevronRight } from "lucide-react"

export default function BookingForm() {
    const [selectedOperator, setSelectedOperator] = useState<"MTN" | "Orange" | "Cash">("MTN")

    return (
        <div className="w-full max-w-md mx-auto relative group">
            {/* Decorative Glow Background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple to-royal-purple rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

            {/* Form Container */}
            <div className="relative glass-panel rounded-2xl p-8 backdrop-blur-xl border border-white/10">

                {/* Name Field */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-stardust mb-2 ml-1">Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-purple w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full pl-12 pr-4 py-4 glass-input rounded-xl focus:ring-2 focus:ring-neon-purple/50 bg-white/5 border border-white/10 placeholder-stardust/50 text-platinum"
                        />
                    </div>
                </div>

                {/* Phone Number Field */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-stardust mb-2 ml-1">Phone Number</label>
                    <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-purple w-5 h-5" />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full pl-12 pr-4 py-4 glass-input rounded-xl focus:ring-2 focus:ring-neon-purple/50 bg-white/5 border border-white/10 placeholder-stardust/50 text-platinum"
                        />
                    </div>
                </div>

                {/* Payment Operator Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-stardust mb-2 ml-1">Select Payment Operator</label>
                    <div className="grid grid-cols-3 gap-3">
                        {["MTN", "Orange", "Cash"].map((op) => (
                            <button
                                key={op}
                                onClick={() => setSelectedOperator(op as any)}
                                className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${selectedOperator === op
                                        ? "bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                                        : "bg-white/5 border-white/10 text-stardust hover:bg-white/10"
                                    }`}
                            >
                                {op}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Pass Display */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-stardust mb-2 ml-1">Selected Pass</label>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-neon-purple/20 rounded-lg">
                                <CreditCard className="w-5 h-5 text-neon-purple" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">VIP ACCESS</p>
                                <p className="text-xs text-stardust">$250</p>
                            </div>
                        </div>
                        <button className="text-xs text-neon-purple hover:text-white transition-colors">Change</button>
                    </div>
                </div>

                {/* Confirm Button */}
                <button className="w-full py-5 btn-primary rounded-xl text-lg font-bold shadow-[0_4px_20px_rgba(124,58,237,0.5)] hover:shadow-[0_6px_30px_rgba(168,85,247,0.6)] transition-all transform hover:-translate-y-1">
                    CONFIRM BOOKING
                </button>

            </div>
        </div>
    )
}
