import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className='mt-16 border-t pt-10 pb-6'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold'>T</div>
          <span className='font-bold text-xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent'>TripAI</span>
        </div>
        <p className='text-gray-400 text-sm'>AI-powered travel planning — smarter than any travel agent</p>
        <Link to='/create-trip'>
          <button className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:opacity-90'>
            Plan Another Trip →
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Footer