import React from 'react'

const Spinner = () => {
  return (
<div className="flex items-center justify-center h-full">
  <div className="relative ">
    <div className="h-12 w-12 border-project-yellow rounded-full border-4 border-t-transparent border-l-transparent border-b-transparent border-gradient-to-r animate-spin"></div>
    <div className="absolute inset-0 flex items-center justify-center">
    </div>
  </div>
</div>

  )
}

export default Spinner
