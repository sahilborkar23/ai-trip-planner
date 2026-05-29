import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GetPlaceImage } from '@/service/GlobalApi'

function UserTripCardItem({ trip, onDelete }) {
  const [photoUrl, setPhotoUrl] = useState()
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    if (trip?.userSelection?.location?.label)
      GetPlaceImage(trip.userSelection.location.label).then(setPhotoUrl)
  }, [trip])

  const days = Number(trip?.userSelection?.noOfDays) || 0
  const createdDate = trip?.createdAt
    ? new Date(trip.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <div className='bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border group'>
      <Link to={`/view-trip/${trip?.id}`}>
        <div className='relative overflow-hidden h-[200px]'>
          {!imgLoaded && <div className='h-full w-full bg-gray-200 animate-pulse' />}
          <img src={photoUrl || '/placeholder.jpg'} alt='Trip'
            className={`h-full w-full object-cover group-hover:scale-110 transition-all duration-500 ${imgLoaded ? 'block' : 'hidden'}`}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { e.target.src = '/placeholder.jpg'; setImgLoaded(true) }} />

          {trip?.userSelection?.persona && (
            <div className='absolute top-3 left-3'>
              <span className='bg-white/90 text-xs font-bold px-2 py-1 rounded-full text-orange-600'>{trip.userSelection.persona}</span>
            </div>
          )}

          {/* <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(20,24,37,0.8), transparent)'}} />
          <div style={{position:'absolute', top:'10px', left:'10px'}}>
            {trip?.userSelection?.isSurpriseTrip ? (
              <span className='tag'>✦ Surprise</span>
            ) : trip?.userSelection?.persona ? (
              <span className='tag'>{trip.userSelection.persona}</span>
            ) : null}
          </div> */}

          <div className='absolute top-3 right-3'>
            <span className='bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
              {days} Day{days !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </Link>

      <div className='p-4'>
        <Link to={`/view-trip/${trip?.id}`}>
          <h2 className='font-bold text-lg hover:text-orange-500 transition-colors'>
            {trip?.userSelection?.location?.label || 'Unknown Destination'}
          </h2>
          <div className='flex flex-wrap gap-2 mt-2'>
            <span className='text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full'>💰 {trip?.userSelection?.budget}</span>
            <span className='text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full'>👥 {trip?.userSelection?.traveler}</span>
          </div>
          {createdDate && <p className='text-xs text-gray-400 mt-2'>Planned on {createdDate}</p>}
        </Link>

        <div className='flex gap-2 mt-4 pt-3 border-t'>
          <Link to={`/view-trip/${trip?.id}`} className='flex-1'>
            <button className='w-full text-sm bg-orange-50 text-orange-600 font-semibold py-2 rounded-lg hover:bg-orange-100 transition-colors'>
              View Trip →
            </button>
          </Link>
          <button onClick={() => { navigator.clipboard.writeText(window.location.origin + '/view-trip/' + trip?.id); toast?.success?.('Link copied!') || alert('Link copied!') }}
            className='text-sm bg-gray-100 text-gray-600 font-semibold px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors' title='Share'>
            🔗
          </button>
          <button onClick={() => onDelete(trip?.id)}
            className='text-sm bg-red-50 text-red-500 font-semibold px-3 py-2 rounded-lg hover:bg-red-100 transition-colors' title='Delete'>
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserTripCardItem