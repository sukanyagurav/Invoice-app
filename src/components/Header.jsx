import React, { useEffect, useState } from "react";

const Header = () => {
  const [isDark, setIsDark] = useState(localStorage.getItem('dark-theme') || 'light');
    function handleMode(){
        if(isDark === 'light'){
            document.body.setAttribute('data-theme', 'dark');
            setIsDark('dark');
            localStorage.setItem('dark-theme','dark')
        }else{
            document.body.setAttribute('data-theme', 'light');
            setIsDark('light')
            localStorage.setItem('dark-theme','light')
        }
   
    }
    useEffect(() => {
        document.body.setAttribute('data-theme', isDark);
    }, [isDark]);
  return (
    <header className="bg-[#373B53] z-50 drop-shadow-2xl sticky top-0 flex-row left-0 bottom-0 h-24 w-full md:h-screen md:w-28 flex md:flex-col justify-between md:rounded-tr-xl overflow-hidden">
      <a
        href="#none"
        className="w-24 rounded-tr-3xl rounded-br-3xl md:w-full md:h-24  p-3 flex justify-center md:rounded-none items-center bg-[#7C5DFA]  overflow-hidden "
      >
        <img src="/logo.svg" alt="" className="w-10 h-10" />
      </a>

      <div className="flex flex-row md:flex-col gap-4  ">
        <button className="border-r-2 border-[#606792] md:border-b-2 md:border-r-0 p-8 text-2xl text-[#7E88C3]"  aria-label="Dark mode toggle" onClick={handleMode}>
          { isDark === 'light' ? (
            <i className="fa-regular fa-moon"></i>
          ) : (
            <i className="fa-regular fa-sun"></i>
          )}
        </button>
        <div className="w-20 h-20 self-center p-4 rounded-full ">
          <img
            src="/avatar.jpg"
            alt=""
            className="w-full h-full rounded-full  object-contain border-white border-2 "
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
