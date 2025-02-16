import { Outdent } from 'lucide-react'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Applayout = () => {
  return (
    <div>
      <main>
        {/* Header */}
        {/* body */}
        <Outlet/>
      </main>
      {/* footer */}
    </div>
  )
}

export default Applayout