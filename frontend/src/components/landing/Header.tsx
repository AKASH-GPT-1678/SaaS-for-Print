import React from 'react'
import { dmSans } from '@/lib/fonts/dm_sans'
const Header = () => {
  return (
    <div>
        <div className='bg-printar-deep w-full min-h-8 flex justify-center items-center'>
<div className={`flex gap-2 tracking-[0.02em] ${dmSans.className}`}>
  <p className="text-printar-lite text-xs font-bold">Printar for busy counters</p>
  <p className="font-normal text-pale-green-white text-xs">
    One calm place for every print request
  </p>
</div>
            

        </div>
      
    </div>
  )
}

export default Header
