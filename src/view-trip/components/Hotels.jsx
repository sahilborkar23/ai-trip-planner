import React from "react"
import HotelCardItem from "./HotelCardItem"

function Hotels({ trip }) {
  const hotels = trip?.tripData?.hotels
  return (
    <div className='mt-8'>
      <div className='flex items-center gap-2 mb-2'>
        <span className='text-2xl'>🏨</span>
        <h2 className="font-bold text-2xl">Hotel Recommendations</h2>
      </div>
      <p className='text-gray-400 text-sm mb-5'>Click any hotel to open in Google Maps</p>
      {!hotels || hotels.length === 0 ? (
        <p className="text-gray-400 bg-gray-50 rounded-xl p-6 text-center">No hotel data available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hotels.map((hotel, i) => <HotelCardItem key={i} hotel={hotel} />)}
        </div>
      )}
    </div>
  )
}

export default Hotels