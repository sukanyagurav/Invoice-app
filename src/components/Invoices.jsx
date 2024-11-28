import React, { useEffect, useState } from "react";
import Modal from "./Modal";

const Invoices = () => {
  const [openDropDown, setDropDown] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  return (
    <main className="p-4 py-12 w-full relative ">
      <div className='max-w-[700px]  w-full md:ml-auto lg:mx-auto'>
        <div className="flex flex-col text-center md:text-left gap-4 md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p>There are 6 total invoices.</p>
          </div>

          <div className="flex items-center gap-6 justify-between">
            <div className="relative">
              <button
                className="flex items-center gap-4 px-4"
                onClick={() => setDropDown(!openDropDown)}
              >
                <h2>Filter by status</h2>
                <span
                  className={`fa-solid fa-angle-down transition-all duration-300 ${
                    openDropDown ? "rotate-180" : "rotate-0"
                  }`}
                ></span>
              </button>

              {openDropDown && (
                <ul
                  className="absolute p-4 w-full top-12 bg-[#252945] rounded-lg pb-0"
                  tabIndex={1}
                >
                  <li className="mb-3 relative">
                    <input
                      type="radio"
                      id="paid"
                      name="check"
                      className="opacity-0 top-2 left-2 absolute cursor-pointer"
                    />
                    <label
                      htmlFor="paid"
                      className="flex before:w-[1em] before:h-[1em]  before:mr-2 before:rounded-sm font-semibold p-1 text-md before:bg-[#141625] items-center before:content-[''] cursor-pointer "
                      tabIndex={1}
                    >
                      Paid
                    </label>
                  </li>
                  <li className="mb-3 relative">
                    <input
                      type="radio"
                      id="pending"
                      name="check"
                      className="opacity-0 top-2 left-2 absolute cursor-pointer"
                    />
                    <label
                      htmlFor="pending"
                      className="flex before:w-[1em] before:h-[1em]  before:mr-2 before:rounded-sm font-semibold p-1 text-md before:bg-[#141625] items-center before:content-[''] cursor-pointer "
                      tabIndex={1}
                    >
                      Pending
                    </label>
                  </li>

                  <li className="mb-3 relative">
                    <input
                      type="radio"
                      id="drafts"
                      name="check"
                      className="opacity-0 top-2 left-2 absolute cursor-pointer"
                    />
                    <label
                      htmlFor="drafts"
                      className="flex before:w-[1em] before:h-[1em]  before:mr-2 before:rounded-sm font-semibold p-1 text-md before:bg-[#141625] items-center before:content-[''] cursor-pointer"
                      tabIndex={1}
                    >
                      Drafts
                    </label>
                  </li>
                </ul>
              )}
            </div>

            <button
              className="bg-[#7C5DFA] flex gap-2 items-center rounded-full p-2 pr-[1rem]"
              aria-label="New Invoice"
              onClick={() => setIsCreate(true)}
            >
              <span className=" flex items-center justify-center bg-white text-[#7C5DFA] w-8 h-8 rounded-full">
                <span class="fa-solid fa-plus"></span>
              </span>
              <span className="hidden md:block">New Invoice</span>
              <span className="block md:hidden">New</span>
            </button>
          </div>
        </div>
      </div>

      {isCreate && (
        <Modal isOpen={isCreate} closeModal={() => setIsCreate(false)} />
      )}
    </main>
  );
};

export default Invoices;
