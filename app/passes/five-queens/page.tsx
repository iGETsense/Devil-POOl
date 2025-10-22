import Image from "next/image"
import Link from "next/link"

export default function FiveQueensPage() {
  return (
    <main className="min-h-screen bg-black pt-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="neon-border rounded-[3rem] overflow-hidden bg-black/90 backdrop-blur-md p-8">
          <h1
            className="text-5xl font-bold text-center gold-text mb-3"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            FIVE QUEENS
          </h1>
          <p className="text-4xl text-center neon-text font-bold mb-8">5 000 FCFA</p>

          <div className="relative h-[500px] rounded-3xl overflow-hidden mb-8">
            <Image
              src="/group-of-five-women-in-elegant-black-and-red-dress.jpg"
              alt="Five Queens Pass"
              fill
              className="object-cover"
            />
          </div>

          <Link
            href="/reservation?pass=five-queens"
            className="block w-full py-4 bg-gradient-to-r from-red-900 to-red-700 text-white text-xl text-center rounded-full font-semibold hover:from-red-800 hover:to-red-600 transition-all hover:shadow-lg hover:shadow-red-500/50"
          >
            Sélectionner ce pass
          </Link>
        </div>
      </div>
    </main>
  )
}
