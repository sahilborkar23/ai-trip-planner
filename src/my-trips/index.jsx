import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore"
import { db } from '@/service/firebaseConfig'
import UserTripCardItem from './components/UserTripCardItem'
import { toast } from 'sonner'

function MyTrips() {
  const navigate = useNavigate()
  const [userTrips, setUserTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { GetUserTrips() }, [])

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) { navigate('/'); return }
    setLoading(true)
    const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email))
    const querySnapshot = await getDocs(q)
    const trips = []
    querySnapshot.forEach((d) => trips.push(d.data()))
    trips.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    setUserTrips(trips)
    setLoading(false)
  }

  const handleDelete = async (tripId) => {
    if (!window.confirm('Delete this trip?')) return
    await deleteDoc(doc(db, 'AITrips', tripId))
    setUserTrips(prev => prev.filter(t => t.id !== tripId))
    toast.success('Trip deleted')
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='sm:px-10 md:px-32 lg:px-56 px-5 py-10'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h2 className='font-bold text-3xl'>My Trips 🗺️</h2>
            <p className='text-gray-400 mt-1'>{userTrips.length} trip{userTrips.length !== 1 ? 's' : ''} planned</p>
          </div>
          <button onClick={() => navigate('/create-trip')}
            className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all'>
            + New Trip
          </button>
        </div>

        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[1,2,3,4,5,6].map(i => <div key={i} className='h-[280px] bg-gray-200 animate-pulse rounded-2xl' />)}
          </div>
        ) : userTrips.length === 0 ? (
          <div className='text-center py-20'>
            <div className='text-6xl mb-4'>✈️</div>
            <h3 className='font-bold text-xl text-gray-600'>No trips yet!</h3>
            <p className='text-gray-400 mt-2 mb-6'>Plan your first AI-powered trip</p>
            <button onClick={() => navigate('/create-trip')}
              className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold'>
              Plan Your First Trip
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {userTrips.map((trip, index) => (
              <UserTripCardItem trip={trip} key={index} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTrips