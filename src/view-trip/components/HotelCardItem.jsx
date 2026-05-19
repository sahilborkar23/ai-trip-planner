import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GetPlaceImage } from '@/service/GlobalApi'

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState()
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    if (hotel) { setImgLoaded(false); GetPlaceImage(hotel?.hotelName).then(setPhotoUrl) }
  }, [hotel])

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel?.hotelName + " " + hotel?.hotelAddress)}`

  return (
    <Link to={googleMapsUrl} target='_blank'>
      <div className='bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border group cursor-pointer'>
        <div className='relative overflow-hidden h-[170px]'>
          {!imgLoaded && <div className='h-full w-full bg-gray-200 animate-pulse' />}
          <img src={photoUrl || '/placeholder.jpg'}
            className={`h-full w-full object-cover group-hover:scale-110 transition-all duration-500 ${imgLoaded ? 'block' : 'hidden'}`}
            alt={hotel?.hotelName}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { e.target.src = '/placeholder.jpg'; setImgLoaded(true) }} />
          <div className='absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-orange-600'>
            View on Maps →
          </div>
        </div>
        <div className='p-4'>
          <h2 className='font-bold text-base group-hover:text-orange-500 transition-colors'>{hotel?.hotelName}</h2>
          <p className='text-xs text-gray-400 mt-1'>📍 {hotel?.hotelAddress}</p>
          {hotel?.description && <p className='text-xs text-gray-500 mt-2 line-clamp-2'>{hotel.description}</p>}
          <div className='flex justify-between items-center mt-3 pt-3 border-t'>
            <span className='font-bold text-orange-600 text-sm'>💰 {hotel?.price}</span>
            <span className='text-sm'>⭐ {hotel?.rating}</span>
          </div>
          {hotel?.amenities && <p className='text-xs text-gray-400 mt-2'>✨ {hotel.amenities}</p>}
        </div>
      </div>
    </Link>
  )
}

export default HotelCardItem