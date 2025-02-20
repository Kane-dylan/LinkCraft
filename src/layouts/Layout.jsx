import Header from '@/components/header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      <main className='min-h-screen container mx-auto'>
        <Header />
        <Outlet/>
      </main>
      <div className='p-10 mt-10 bg-gray-800 text-white text-center'>
        Made to help others 😎 by me.
      </div>

    </div>
  )
}

export default Layout