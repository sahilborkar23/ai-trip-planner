import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import tokyoImg from "../../assets/tokyo.jpg";
import parisImg from "../../assets/paris.jpg";
import baliImg from "../../assets/bali.jpg";

const destinations = ['Goa', 'Paris', 'Bali', 'Dubai', 'Tokyo', 'Maldives', 'New York', 'Udaipur', 'Kyoto', 'Santorini','Havana', 'Reykjavik', 'Lisbon', 'Barcelona', 'Rome', 'Sydney', 'Cape Town', 'Istanbul', 'Bangkok', 'Prague', 'Amsterdam', 'Vienna', 'Seoul']

const stats = [
  { number: '10K+', label: 'Trips Planned' },
  { number: '150+', label: 'Destinations' },
  { number: '4.9★', label: 'User Rating' },
  { number: '100%', label: 'AI Powered' },
]

function Hero() {
  const [currentDest, setCurrentDest] = useState(0)
  const [surprise, setSurprise] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDest(prev => (prev + 1) % destinations.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleSurprise = () => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
    const dest = pick(destinations)
    const budgets = ['Cheap', 'Moderate', 'Luxury']
    const travelers = ['1', '2 People', '3 to 5 People', '5 to 10 People']
    const personas = ['Adventure', 'Romantic', 'Cultural', 'Foodie', 'Nature', 'Photography']
    const days = Math.floor(Math.random() * 5) + 3 // 3–7 days

    setSurprise(dest)
    const params = new URLSearchParams({
      destination: dest,
      days: days,
      budget: pick(budgets),
      traveler: pick(travelers),
      persona: pick(personas),
    })
    setTimeout(() => { window.location.href = `/create-trip?${params.toString()}` }, 800)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-hidden">

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sky-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero */}
      <div className="relative z-10 px-6 md:px-20 pt-24 pb-20">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

          {/* Left Side */}
          <div>

            <div className="inline-flex items-center bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm mb-8 animate-bounce">
              <span className="text-sky-700 text-sm font-semibold">
                AI Travel Planner
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black leading-tight text-slate-900">
              Travel Smarter.
              <br />

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-violet-600 to-emerald-600">
                Explore {destinations[currentDest]}
              </span>
            </h1>

            <p className="text-slate-600 text-xl mt-8 max-w-xl leading-relaxed">
              Generate personalized itineraries, discover attractions,
              plan budgets, check weather, and build unforgettable journeys
              in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">

              <Link to="/create-trip">
                <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
                  Start Planning →
                </button>
              </Link>

              <button
                onClick={handleSurprise}
                className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                {surprise ? `Explore ${surprise}` : "Surprise Destination"}
              </button>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">

              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-slate-100 shadow-sm"
                >
                  <h3 className="text-3xl font-black text-slate-900">
                    {stat.number}
                  </h3>

                  <p className="text-slate-500 text-sm mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}

            </div>

          </div>

          {/* Right Side */}
          <div className="relative h-[600px] hidden lg:block self-start">

            <div className="absolute top-0 left-10 bg-white rounded-[32px] p-4 shadow-xl w-72 rotate-[-8deg]">

              <img
                src={tokyoImg}
                alt="Tokyo"
                className="w-full h-40 object-cover rounded-2xl shadow-xl hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer"
              />

              <h3 className="font-bold text-slate-900 mt-4">
                📍 Tokyo
              </h3>

              <p className="text-slate-500 text-sm">
                5 Days • 80,000 Budget
              </p>

            </div>

            <div className="absolute top-32 right-0 bg-white rounded-[32px] p-4 shadow-xl w-72 rotate-[8deg]">

              <img
                src={parisImg}
                alt="Paris"
                className="w-full h-40 object-cover rounded-2xl shadow-xl hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer"
              />

              <h3 className="font-bold text-slate-900 mt-4">
                📍 Paris
              </h3>

              <p className="text-slate-500 text-sm">
                7 Days • 120,000 Budget
              </p>

            </div>

            <div className="absolute bottom-0 left-24 bg-white rounded-[32px] p-4 shadow-xl w-72">

              <img
                src={baliImg}
                alt="Bali"
                className="w-full h-40 object-cover rounded-2xl shadow-xl hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer"
              />

              <h3 className="font-bold text-slate-900 mt-4">
                📍 Bali
              </h3>

              <p className="text-slate-500 text-sm">
                4 Days • Beach Escape
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Features */}
      <div className="relative z-10 px-6 md:px-20 py-24">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl font-black text-center text-slate-900 mb-4">
            Everything You Need
          </h2>

          <p className="text-center text-slate-500 mb-16 text-lg">
            Built for modern travelers
          </p>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                title: "Smart Itineraries",
                desc: "Day-by-day travel plans customized for you.",
                color: "bg-sky-100"
              },
              {
                title: "Budget Planning",
                desc: "Track expenses before you even leave home.",
                color: "bg-violet-100"
              },
              {
                title: "Packing Assistant",
                desc: "Know exactly what to pack for every trip.",
                color: "bg-emerald-100"
              },
              {
                title: "Weather Insights",
                desc: "Plan around real destination conditions.",
                color: "bg-yellow-100"
              },
              {
                title: "Trip Personalities",
                desc: "Adventure, luxury, foodie, photography and more.",
                color: "bg-pink-100"
              },
              {
                title: "Easy Sharing",
                desc: "Send itineraries to friends instantly.",
                color: "bg-indigo-100"
              }
            ].map((item, i) => (
              <div
                key={i}
                className={`${item.color} rounded-[32px] p-8 hover:scale-105 transition-all duration-300`}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* CTA */}
      <div className="px-6 md:px-20 pb-20">

        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[40px] p-16 text-center">

          <h2 className="text-5xl font-black text-white mb-5">
            Your Next Journey Awaits
          </h2>

          <p className="text-slate-300 text-lg mb-10">
            Let AI create your perfect travel experience.
          </p>

          <Link to="/create-trip">
            <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all">
              Create My Trip
            </button>
          </Link>

        </div>

      </div>

    </div>
  )
}

export default Hero