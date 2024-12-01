import React from 'react'

const Input = ({labelText, type, id,placeholder=""}) => {
  return (
    <div className='flex flex-col'>
      <label htmlFor={id} className='opacity-[0.8] mt-4 flex-1'>{labelText}</label>
      <input type={type} id={id} placeholder={placeholder} className='w-full border-[0.1rem] my-2 p-2 rounded-lg bg-transparent focus:outline-[#7C5DFA] flex-1 outline-none focus:border-none '  />
    </div>
  )
}

export default Input
