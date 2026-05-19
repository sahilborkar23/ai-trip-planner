import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc"
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [openDialog, setOpenDialog] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const login = useGoogleLogin({
    onSuccess: (res) => GetUserProfile(res),
    onError: (error) => console.log(error)
  })

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
      headers: { Authorization: `Bearer ${tokenInfo.access_token}`, Accept: 'application/json' }
    }).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data))
      setOpenDialog(false)
      window.location.reload()
    }).catch(console.error)
  }

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'} flex justify-between items-center px-6 py-3`}>

      <Link to='/' className='flex items-center gap-2'>
        <div className='w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold'>T</div>
        <span className='font-bold text-xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent'>TripAI</span>
      </Link>

      <div className='hidden md:flex items-center gap-6 text-sm font-medium text-gray-600'>
        <Link to='/' className={`hover:text-orange-500 transition-colors ${location.pathname === '/' ? 'text-orange-500' : ''}`}>Home</Link>
        <Link to='/create-trip' className={`hover:text-orange-500 transition-colors ${location.pathname === '/create-trip' ? 'text-orange-500' : ''}`}>Plan Trip</Link>
        {user && <Link to='/my-trips' className={`hover:text-orange-500 transition-colors ${location.pathname === '/my-trips' ? 'text-orange-500' : ''}`}>My Trips</Link>}
      </div>

      <div>
        {user ? (
          <div className='flex items-center gap-3'>
            <Link to='/create-trip'>
              <Button className='rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 hover:opacity-90'>
                + New Trip
              </Button>
            </Link>
            <Popover>
              <PopoverTrigger>
                <img src={user?.picture} alt='' className='h-9 w-9 rounded-full ring-2 ring-orange-300 cursor-pointer' />
              </PopoverTrigger>
              <PopoverContent className='w-48'>
                <div className='flex flex-col gap-1'>
                  <p className='font-semibold text-sm px-2 py-1'>{user?.name}</p>
                  <p className='text-xs text-gray-400 px-2 pb-2 border-b'>{user?.email}</p>
                  <Link to='/my-trips' className='text-sm px-2 py-2 hover:bg-gray-100 rounded cursor-pointer block'>🗺️ My Trips</Link>
                  <div className='text-sm px-2 py-2 hover:bg-gray-100 rounded cursor-pointer text-red-500'
                    onClick={() => { googleLogout(); localStorage.clear(); window.location.href = '/' }}>
                    🚪 Logout
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)} className='bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 hover:opacity-90 rounded-full'>
            Sign In
          </Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <div className='flex flex-col items-center text-center gap-4 p-4'>
                <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl'>T</div>
                <h2 className='font-bold text-xl text-gray-800'>Welcome to TripAI</h2>
                <p className='text-gray-500'>Sign in to save and access your AI-generated trips</p>
                <Button onClick={login} className="w-full mt-2 flex gap-3 items-center justify-center bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50">
                  <FcGoogle className="h-6 w-6" /> Continue with Google
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Header