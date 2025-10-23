import React from 'react'
import { Spinner } from '../ui/spinner'

const LoadingPage = () => {
  return (
    <div className='size-full flex items-center justify-center'>
        <Spinner size={24}/>
    </div>
  )
}

export default LoadingPage