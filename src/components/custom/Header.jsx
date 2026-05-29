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

  if (location.pathname === '/surprise-me') return null

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
    <div
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-xl border-b border-slate-200'
          : 'bg-transparent'
        } flex justify-between items-center px-6 py-4`}
    >

      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-3 group">

        <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 font-black text-lg group-hover:rotate-12 transition-all duration-300">
          ✈
        </div>

        <div>
          <h1 className="font-black text-xl text-slate-900">
            TripAI
          </h1>

          <p className="text-xs text-slate-400 -mt-1">
            Smart Travel Planning
          </p>
        </div>

      </Link>



      <div className="hidden md:flex items-center gap-2 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-full px-2 py-2 shadow-sm">
        <Link
          to="/"
          className={`px-4 py-2 rounded-full transition-all ${location.pathname === "/"
            ? "bg-sky-100 text-sky-700 font-semibold"
            : "text-slate-600 hover:bg-slate-100"
            }`}
        >
          Home
        </Link>

        <Link
          to="/create-trip"
          className={`px-4 py-2 rounded-full transition-all ${location.pathname === "/create-trip"
            ? "bg-violet-100 text-violet-700 font-semibold"
            : "text-slate-600 hover:bg-slate-100"
            }`}
        >
          Plan Trip
        </Link>

        <Link
          to="/surprise-me"
          className={`px-4 py-2 rounded-full transition-all ${location.pathname === "/surprise-me"
            ? "bg-amber-100 text-amber-700 font-semibold"
            : "text-slate-600 hover:bg-slate-100"
            }`}
        >
          <span aria-hidden="true">✦</span> Surprise Me
        </Link>

        {user && (
          <Link
            to="/my-trips"
            className={`px-4 py-2 rounded-full transition-all ${location.pathname === "/my-trips"
              ? "bg-emerald-100 text-emerald-700 font-semibold"
              : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            My Trips
          </Link>
        )}
      </div>

      <div>
        {user ? (
          <div className='flex items-center gap-3'>
            <Link to='/create-trip'>
              <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                + New Trip
              </Button>
            </Link>
            <Popover>
              <PopoverTrigger>
                <img src={user?.picture} alt='' className="h-10 w-10 rounded-full ring-4 ring-sky-100 cursor-pointer hover:scale-105 transition-all" />
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
          <Button
            onClick={() => setOpenDialog(true)}
            className="bg-slate-900 text-white rounded-full px-6 hover:bg-slate-800"
          >
            Sign In
          </Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <div className='flex flex-col items-center text-center gap-4 p-4'>
                <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-2xl">
                  ✈
                </div>
                <h2 className="font-black text-2xl text-slate-900">Welcome to TripAI</h2>
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