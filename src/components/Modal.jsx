import React from "react";
import Input from "./Input";

const Modal = ({ closeModal, children, isOpen }) => {
  return (
    <>
      <div
        className="fixed bg-[rgba(0,0,0,0.39)] top-0 left-0 bottom-0 w-full h-full z-10 "
        onClick={closeModal}
      ></div>
      <dialog
        className="fixed top-[5rem] md:top-0 -left-0  p-6 pt-12 md:p-12 md:pl-[8rem]  min-h-screen  text-black z-20  drop-shadow-2xl rounded-tr-3xl rounded-br-3xl w-full md:w-[700px] md:right-auto  "
        open={isOpen}
      >
        <h2 className="text-3xl font-bold">Create Invoice</h2>
        <div className="my-8 mb-0 overflow-y-scroll max-h-[480px] pr-8 pl-1">
          <h3 className="text-[#7C5DFA] font-bold">Bill From</h3>
          <div>
            <Input
              id="fromStreetAddress"
              labelText="Street Address"
              type="text"
            />

            <div className="flex gap-4">
              <Input id="fromCity" labelText="City" type="text" />

              <Input
                id="fromPostalCode"
                labelText="Postal Code"
                type="number"
              />

              <Input id="fromCountry" labelText="Country" type="text" />
            </div>
          </div>
          <h3 className="text-[#7C5DFA] mt-6 font-bold">Bill To</h3>
          <div>
            <Input
              id="billToClientName"
              labelText="Client's Name"
              type="text"
            />

            <Input
              id="billToStreetAddress"
              labelText="Client's Email"
              type="email"
              placeholder="e.g. email@example.com"
            />

            <Input
              id="billToStreetAddress"
              labelText="Street Address"
              type="text"
            />
            <div className="flex gap-4">
              <Input id="billToCity" labelText="City" type="text" />
              <Input
                id="billToPostalCode"
                labelText="Postal Code"
                type="number"
              />
              <Input id="billToCountry" labelText="Country" type="text" />
            </div>
            <div className="flex gap-4 ">
              <Input
                type="date"
                labelText="Invoice Date"
                id="billToInvoiceDate"
              />

              <div className="flex-1 flex flex-col  relative">
                <label htmlFor="payementTerms" className='opacity-[0.8] mt-4 mb-2 '>Payment Terms</label>
                <select id="payementTerms" className="p-[0.6rem] border-[0.1rem]  rounded-lg bg-transparent focus:outline-[#7C5DFA] appearance-none">
                
                  <option value="1">Net 1 Day</option>
                  <option value="7">Net 7 Days</option>
                  <option value="14">Net 14 Days</option>
                  <option value="30">Net 30 Days</option>
                </select>
                <span
                  className={`fa-solid fa-angle-down transition-all duration-300 absolute top-[65%] right-6`}
                ></span>
              </div>
            </div>
            <Input type="text" labelText="Description" id="description" />

            <h3 className="font-bold my-8  opacity-[0.7]">ItemList</h3>

            <button className="mb-8 block w-full lightBtn p-4 rounded-full font-semibold">
             + Add New Item
            </button>
          </div>
        </div>

        <div className="flex justify-between gap-4 py-4 mt-auto ">
          <button className="lightBtn p-3 px-8 rounded-full" onClick={closeModal}>
            Discard
          </button>
          <div className="flex gap-4">
            <button className="p-3 bg-[#363B53] ml-8 px-6 text-gray-300 rounded-full">
              Save as Draft
            </button>
            <button className="p-3 bg-[#7C5DFA]  px-6 text-gray-300 rounded-full">
              Save & Send
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
