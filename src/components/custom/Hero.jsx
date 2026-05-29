import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const destinations = ['Goa', 'Paris', 'Bali', 'Dubai', 'Tokyo', 'Maldives', 'New York', 'Udaipur','Kyoto', 'Santorini', 'Marrakech', 'Queenstown', 'Havana', 'Reykjavik', 'Udaipur', 'Lisbon', 'Barcelona', 'Rome', 'Sydney', 'Cape Town', 'Istanbul', 'Bangkok', 'Prague', 'Amsterdam', 'Vienna', 'Seoul']

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
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50'>

      {/* Hero */}
      <div className='flex flex-col items-center px-6 md:px-20 pt-20 pb-16 text-center'>
        <div className='inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-bounce'>
          🤖 AI-Powered Trip Planning • Completely Free
        </div>

        <h1 className='font-extrabold text-5xl md:text-6xl text-center leading-tight max-w-4xl'>
          Plan Your Trip to{' '}
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-500'>
            {destinations[currentDest]}
          </span>
          <br />in 30 Seconds
        </h1>

        <p className='text-xl text-gray-500 text-center mt-6 max-w-2xl'>
          Our AI creates personalized day-by-day itineraries, hotel recommendations,
          packing lists, and budget breakdowns — better than any travel agent.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 mt-10'>
          <Link to='/create-trip'>
            <button className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all'>
              ✨ Plan My Trip — Free
            </button>
          </Link>
          <button onClick={handleSurprise}
            className='border-2 border-orange-400 text-orange-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all'>
            {surprise ? `🎲 Going to ${surprise}!` : '🎲 Surprise Me!'}
          </button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-2xl'>
          {stats.map((stat, i) => (
            <div key={i} className='text-center'>
              <div className='font-extrabold text-3xl text-orange-500'>{stat.number}</div>
              <div className='text-gray-500 text-sm mt-1'>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className='bg-white py-20 px-6 md:px-20'>
        <h2 className='text-center font-bold text-3xl mb-2'>Why We Beat MakeMyTrip 🏆</h2>
        <p className='text-center text-gray-400 mb-12'>Everything they do, plus AI superpowers</p>
        <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
          {[
            { icon: '🤖', title: 'AI Itinerary', desc: 'Personalized day-by-day plans by Google Gemini AI — not copy-pasted templates' },
            { icon: '💰', title: 'Budget Breakdown', desc: 'Know exactly how much you\'ll spend on hotels, food, transport & sightseeing' },
            { icon: '🎭', title: 'Trip Personas', desc: 'Adventure, Romantic, Foodie, Photography — AI tailors everything to your style' },
            { icon: '🎒', title: 'Smart Packing List', desc: 'AI generates a custom packing list based on your destination and trip type' },
            { icon: '🌤️', title: 'Live Weather', desc: 'Real-time weather at your destination so you know what to expect' },
            { icon: '📤', title: 'Share Your Trip', desc: 'Share your itinerary with friends and family via a single link — free to view' },
          ].map((f, i) => (
            <div key={i} className='p-6 rounded-2xl border hover:shadow-lg transition-all hover:-translate-y-1'>
              <div className='text-4xl mb-3'>{f.icon}</div>
              <h3 className='font-bold text-lg mb-2'>{f.title}</h3>
              <p className='text-gray-500 text-sm'>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className='bg-gradient-to-r from-orange-500 to-pink-500 py-16 px-6 text-center text-white'>
        <h2 className='font-bold text-3xl mb-3'>Ready for your next adventure?</h2>
        <p className='text-orange-100 mb-8'>Join thousands of travelers using AI to plan smarter trips</p>
        <Link to='/create-trip'>
          <button className='bg-white text-orange-500 px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all'>
            Start Planning Now →
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Hero