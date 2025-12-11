import { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string
    icon: LucideIcon
    trend: string
    trendUp: boolean
    color: "purple" | "green" | "yellow" | "blue"
}

export default function StatsCard({ title, value, icon: Icon, trend, trendUp, color }: StatsCardProps) {
    const getGradient = () => {
        switch (color) {
            case "purple": return "from-purple-500/20 to-fuchsia-500/20 border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            case "green": return "from-emerald-500/20 to-green-500/20 border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            case "yellow": return "from-amber-500/20 to-orange-500/20 border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            case "blue": return "from-blue-500/20 to-indigo-500/20 border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        }
    }

    const getIconColor = () => {
        switch (color) {
            case "purple": return "text-fuchsia-400"
            case "green": return "text-emerald-400"
            case "yellow": return "text-amber-400"
            case "blue": return "text-blue-400"
        }
    }

    return (
        <div className={`
      relative overflow-hidden rounded-2xl p-6 border transition-all duration-300
      bg-gradient-to-br backdrop-blur-md bg-[#1a1a2e]/60
      ${getGradient()}
    `}>
            <div className="flex justify-between items-start mb-4">
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <div className={`p-2 rounded-lg bg-white/5 ${getIconColor()}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="mb-2">
                <h3 className="text-3xl font-bold text-white">{value}</h3>
            </div>

            <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                    {trendUp ? '↗' : '↘'} {trend}
                </span>
            </div>
        </div>
    )
}
