import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return <nav>
      <Link>
        <img src="/logo.png" alt="trimmer logo" className='h-16' />
      </Link>
    </nav>

}

export default Header