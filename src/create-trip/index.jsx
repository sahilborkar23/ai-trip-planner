import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { chatSession } from '@/service/AIModel'
import { db } from '@/service/firebaseConfig'
import { doc, setDoc } from "firebase/firestore"
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList, TripPersonas } from '@/constants/options'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'

function CreateTrip() {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [interests, setInterests] = useState('')
  const [destination, setDestination] = useState('')
  const [fromLocation, setFromLocation] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const dest = location.state?.destination || searchParams.get('destination')
    const days = searchParams.get('days')
    const budget = searchParams.get('budget')
    const traveler = searchParams.get('traveler')
    const persona = searchParams.get('persona')

    if (dest) setDestination(dest)

    const newFormData = {}
    if (dest) newFormData.location = { label: dest }
    if (days) newFormData.noOfDays = days
    if (budget) newFormData.budget = budget
    if (traveler) newFormData.traveler = traveler
    if (persona) newFormData.persona = persona

    if (Object.keys(newFormData).length > 0) {
      setFormData(prev => ({ ...prev, ...newFormData }))
    }
  }, [])

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const onGenerateTrip = async () => {
    const user = localStorage.getItem('user')
    if (!user) { toast.error("Please login first"); return }
    if (!fromLocation) { toast.error("Please enter where you are traveling FROM"); return }
    if (!formData?.location || !formData?.noOfDays || !formData?.budget || !formData?.traveler) {
      toast.error("Please fill all details"); return
    }
    if (Number(formData?.noOfDays) > 10) { toast.error("Max 10 days allowed"); return }

    setLoading(true)
    toast.loading("AI is crafting your perfect trip... ✨")

    const FINAL_PROMPT = AI_PROMPT
      .replaceAll('{fromLocation}', fromLocation)
      .replaceAll('{location}', formData?.location?.label || formData?.location)
      .replaceAll('{totalDays}', formData?.noOfDays)
      .replaceAll('{traveler}', formData?.traveler)
      .replaceAll('{budget}', formData?.budget)
      .replaceAll('{persona}', formData?.persona || 'General')
      .replaceAll('{interests}', interests || 'None specified')

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT)
      const tripText = result?.response?.text()
      let cleanJson = tripText
      const codeBlock = tripText.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlock) cleanJson = codeBlock[1]
      else { const m = tripText.match(/\{[\s\S]*\}/); if (m) cleanJson = m[0] }
      const parsed = JSON.parse(cleanJson)
      await SaveAiTrip(parsed)
    } catch (error) {
      console.error("Error:", error)
      toast.dismiss()
      toast.error("Could not generate trip. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const SaveAiTrip = async (parsedData) => {
    const docId = Date.now().toString()
    const user = JSON.parse(localStorage.getItem('user'))
    const normalizedTripData =
      parsedData?.hotels && parsedData?.itinerary ? parsedData :
      parsedData?.tripData?.hotels ? parsedData.tripData : parsedData

    await setDoc(doc(db, "AITrips", docId), {
      userSelection: { ...formData, interests, fromLocation },
      tripData: normalizedTripData,
      userEmail: user?.email,
      id: docId,
      createdAt: new Date().toISOString(),
    })
    toast.dismiss()
    toast.success("Trip Generated Successfully! 🎉")
    navigate('/view-trip/' + docId)
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-orange-50 to-white'>
      <div className='p-6 md:px-20 lg:px-44 xl:px-56 pt-16'>

        <div className='text-center mb-12'>
          <span className='bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold'>AI Powered</span>
          <h2 className='font-bold text-4xl mt-4'>Plan Your Dream Trip ✈️</h2>
          <p className='mt-3 text-gray-500 text-lg'>Answer a few questions and get a full itinerary in seconds</p>
        </div>

        <div className='flex flex-col gap-8'>

          {/* FROM → TO locations side by side */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border'>
            <h2 className='text-xl font-bold mb-1'>🗺️ Your Journey Route</h2>
            <p className='text-gray-400 text-sm mb-5'>Tell us where you're starting from so AI can calculate travel cost & time</p>

            <div className='flex flex-col md:flex-row gap-4 items-center'>
              {/* From */}
              <div className='flex-1 w-full'>
                <label className='text-sm font-semibold text-gray-600 mb-2 block'>📍 Traveling From</label>
                {/* <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                /> */}
                <input
                  placeholder='Ex. Mumbai, Delhi, Bangalore...'
                  type="text"
                  value={fromLocation}
                  className='w-full p-3 border-2 rounded-xl border-gray-200 focus:border-orange-400 focus:outline-none text-base'
                  onChange={(e) => setFromLocation(e.target.value)}
                />
              </div>

              {/* Arrow */}
              <div className='flex flex-col items-center gap-1 flex-shrink-0'>
                <div className='w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md'>
                  ✈️
                </div>
                <span className='text-xs text-gray-400 font-medium'>TO</span>
              </div>

              {/* To */}
              <div className='flex-1 w-full'>
                <label className='text-sm font-semibold text-gray-600 mb-2 block'>🏁 Destination</label>
                <input
                  placeholder='Ex. Paris, Bali, Goa...'
                  type="text"
                  value={destination}
                  className='w-full p-3 border-2 rounded-xl border-gray-200 focus:border-orange-400 focus:outline-none text-base'
                  onChange={(e) => { setDestination(e.target.value); handleInputChange('location', { label: e.target.value }) }}
                />
              </div>
            </div>

            {/* Preview route */}
            {fromLocation && destination && (
              <div className='mt-4 bg-orange-50 rounded-xl p-3 flex items-center gap-3'>
                <span className='text-orange-500 font-bold text-sm'>🛣️ Route:</span>
                <span className='text-sm text-gray-700 font-medium'>{fromLocation}</span>
                <span className='text-orange-400'>→</span>
                <span className='text-sm text-gray-700 font-medium'>{destination}</span>
                <span className='ml-auto text-xs text-orange-400'>AI will calculate travel options</span>
              </div>
            )}
          </div>

          {/* Days */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border'>
            <h2 className='text-xl font-bold mb-1'>📅 How many days?</h2>
            <p className='text-gray-400 text-sm mb-4'>Maximum 10 days per trip</p>
            <input placeholder='Ex. 3' type="number" min="1" max="10"
              value={formData?.noOfDays || ''}
              className='w-full p-3 border-2 rounded-xl border-gray-200 focus:border-orange-400 focus:outline-none text-lg'
              onChange={(e) => handleInputChange('noOfDays', e.target.value)} />
          </div>

          {/* Trip Persona */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border'>
            <h2 className='text-xl font-bold mb-1'>🎭 What's your travel style?</h2>
            <p className='text-gray-400 text-sm mb-4'>AI will tailor activities to your vibe</p>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {TripPersonas.map((item) => (
                <div key={item.id} onClick={() => handleInputChange('persona', item.title)}
                  className={`p-4 border-2 cursor-pointer rounded-xl hover:shadow-md transition-all
                    ${formData?.persona === item.title ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}>
                  <h2 className='text-3xl'>{item.icon}</h2>
                  <h2 className='font-bold mt-1'>{item.title}</h2>
                  <p className='text-xs text-gray-500'>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border'>
            <h2 className='text-xl font-bold mb-1'>💰 What's your budget?</h2>
            <p className='text-gray-400 text-sm mb-4'>Helps AI recommend the right hotels & activities</p>
            <div className='grid grid-cols-3 gap-5'>
              {SelectBudgetOptions.map((item) => (
                <div key={item.id} onClick={() => handleInputChange('budget', item.title)}
                  className={`p-5 border-2 cursor-pointer rounded-xl hover:shadow-md transition-all
                    ${formData?.budget === item.title ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}>
                  <h2 className='text-4xl'>{item.icon}</h2>
                  <h2 className='font-bold text-lg mt-2'>{item.title}</h2>
                  <p className='text-sm text-gray-500'>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Travelers */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border'>
            <h2 className='text-xl font-bold mb-1'>👥 Who's traveling?</h2>
            <p className='text-gray-400 text-sm mb-4'>AI tailors activities to your group</p>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {SelectTravelesList.map((item) => (
                <div key={item.id} onClick={() => handleInputChange('traveler', item.people)}
                  className={`p-4 border-2 cursor-pointer rounded-xl hover:shadow-md transition-all
                    ${formData?.traveler === item.people ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}>
                  <h2 className='text-3xl'>{item.icon}</h2>
                  <h2 className='font-bold mt-1'>{item.title}</h2>
                  <p className='text-xs text-gray-500'>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Special Interests */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border'>
            <h2 className='text-xl font-bold mb-1'>💬 Any special requests?</h2>
            <p className='text-gray-400 text-sm mb-4'>Ex: "I have a 5 year old", "vegetarian food only", "wheelchair accessible"</p>
            <textarea placeholder='Tell us anything special...' rows={3}
              className='w-full p-3 border-2 rounded-xl border-gray-200 focus:border-orange-400 focus:outline-none resize-none'
              value={interests} onChange={(e) => setInterests(e.target.value)} />
          </div>

        </div>

        {/* Generate Button */}
        <div className='my-12 flex flex-col items-center gap-3'>
          <button disabled={loading} onClick={onGenerateTrip}
            className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-16 py-4 rounded-2xl font-bold text-xl
              hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100'>
            {loading ? (
              <span className='flex items-center gap-3'>
                <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24' fill='none'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
                </svg>
                AI is Planning Your Trip...
              </span>
            ) : '✨ Generate My Trip'}
          </button>
          <p className='text-gray-400 text-sm'>Powered by Google Gemini AI • Takes ~15 seconds</p>
        </div>

      </div>
    </div>
  )
}

export default CreateTrip