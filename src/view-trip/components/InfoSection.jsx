import React, { useEffect, useState } from "react"
import { GetPlaceImage } from "@/service/GlobalApi"
import DownloadPDF from "./DownloadPDF"

function InfoSection({ trip }) {
  const [mainImage, setMainImage] = useState(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [weather, setWeather] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!trip?.userSelection?.location?.label) return
    setImgLoaded(false)
    GetPlaceImage(trip.userSelection.location.label).then(setMainImage)
    fetchWeather(trip.userSelection.location.label)
  }, [trip])

  const fetchWeather = async (city) => {
    try {
      const key = import.meta.env.VITE_OPENWEATHER_KEY
      if (!key || key === 'your_free_key_here') return
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`)
      const data = await res.json()
      if (data?.main) setWeather(data)
    } catch { /* weather is optional */ }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const days = Number(trip?.userSelection?.noOfDays) || 0
  const summary = trip?.tripData?.tripSummary

  return (
    <div>
      {/* Hero Image */}
      <div className='relative rounded-2xl overflow-hidden h-[380px]'>
        {!imgLoaded && <div className="h-full w-full bg-gray-200 animate-pulse" />}
        <img src={mainImage || "/placeholder.jpg"} alt="Trip"
          className={`h-full w-full object-cover ${imgLoaded ? "block" : "hidden"}`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => { e.target.src = "/placeholder.jpg"; setImgLoaded(true) }} />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

        {/* Title overlay */}
        <div className='absolute bottom-6 left-6 text-white'>
          <h1 className='font-extrabold text-4xl drop-shadow-lg capitalize'>{trip?.userSelection?.location?.label}</h1>
          <div className='flex gap-3 mt-2 flex-wrap'>
            <span className='bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium'>📅 {days} Day{days !== 1 ? 's' : ''}</span>
            <span className='bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium'>💰 {trip?.userSelection?.budget} Budget</span>
            <span className='bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium'>👥 {trip?.userSelection?.traveler}</span>
            {trip?.userSelection?.persona && (
              <span className='bg-orange-500/80 backdrop-blur px-3 py-1 rounded-full text-sm font-medium'>🎭 {trip.userSelection.persona}</span>
            )}
          </div>
        </div>

        {/* Share button */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <button
            onClick={handleShare}
            className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold hover:bg-white transition-all shadow"
          >
            {copied ? '✅ Link Copied!' : '🔗 Share Trip'}
          </button>

          <DownloadPDF trip={trip} />
        </div>

        {/* Weather widget */}
        {weather && (
          <div className='absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-xl text-sm font-medium shadow flex items-center gap-2'>
            🌡️ {Math.round(weather.main.temp)}°C · {weather.weather[0]?.description}
          </div>
        )}
      </div>

      {/* Trip Summary Cards */}
      {summary && (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
          {summary.bestTimeToVisit && (
            <div className='bg-blue-50 rounded-xl p-4'>
              <p className='text-xs text-blue-400 font-medium uppercase'>Best Time</p>
              <p className='font-bold text-blue-800 mt-1 text-sm'>{summary.bestTimeToVisit}</p>
            </div>
          )}
          {summary.currency && (
            <div className='bg-green-50 rounded-xl p-4'>
              <p className='text-xs text-green-400 font-medium uppercase'>Currency</p>
              <p className='font-bold text-green-800 mt-1 text-sm'>{summary.currency}</p>
            </div>
          )}
          {summary.language && (
            <div className='bg-purple-50 rounded-xl p-4'>
              <p className='text-xs text-purple-400 font-medium uppercase'>Language</p>
              <p className='font-bold text-purple-800 mt-1 text-sm'>{summary.language}</p>
            </div>
          )}
          {summary.totalEstimatedCost && (
            <div className='bg-orange-50 rounded-xl p-4'>
              <p className='text-xs text-orange-400 font-medium uppercase'>Est. Total Cost</p>
              <p className='font-bold text-orange-800 mt-1 text-sm'>{summary.totalEstimatedCost}</p>
            </div>
          )}
        </div>
      )}

      {/* Emergency Info */}
      {(summary?.emergencyNumber || summary?.nearestHospital) && (
        <div className='mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex gap-4'>
          <span className='text-2xl'>🚨</span>
          <div>
            <p className='font-bold text-red-700 text-sm'>Emergency Info</p>
            {summary.emergencyNumber && <p className='text-sm text-red-600'>📞 Emergency: {summary.emergencyNumber}</p>}
            {summary.nearestHospital && <p className='text-sm text-red-600'>🏥 {summary.nearestHospital}</p>}
          </div>
        </div>
      )}

      {/* Local Tips */}
      {trip?.tripData?.localTips?.length > 0 && (
        <div className='mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4'>
          <p className='font-bold text-yellow-800 mb-2'>💡 Local Tips</p>
          <ul className='list-disc list-inside text-sm text-yellow-700 space-y-1'>
            {trip.tripData.localTips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>
      )}

      {/* Transportation Tips */}
      {trip?.tripData?.transportationTips && (
        <div className='mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4'>
          <p className='font-bold text-blue-800 mb-1'>🚌 Getting Around</p>
          <p className='text-sm text-blue-700'>{trip.tripData.transportationTips}</p>
        </div>
      )}
    </div>
  )
}

export default InfoSection