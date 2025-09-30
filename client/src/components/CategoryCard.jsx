import React from 'react'

const CategoryCard = ({image,name,onClick}) => {
  return (
    <div 
    onClick={onClick}
    className='flex justify-center items-center flex-col gap-1 group hover:scale-105 transition-all duration-300 ease-in-out'>
        <img src={image} alt={name} className='w-32 h-32 rounded-full object-cover border-[1px] group-hover:border-yellow-500'/>
        <p className='text-white '>{name}</p>
    </div>
  )
}

export default CategoryCard