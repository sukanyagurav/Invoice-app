import React from "react";

const Modal = ({ closeModal, children, isOpen }) => {
  return (
    <>
      <div
        className="fixed bg-[rgba(0,0,0,0.39)] top-0 left-0 bottom-0 w-full h-full z-10 "
        onClick={closeModal}
      ></div>
      <dialog
        className="fixed top-[5rem] md:top-0 -left-0  p-6 pt-12 md:p-12 md:pl-[8rem]  min-h-screen  text-black z-20  drop-shadow-2xl rounded-tr-3xl rounded-br-3xl w-full md:w-[700px] md:right-auto "
        open={isOpen}
      >
       
          <h2>Create Invoice</h2>
      
      </dialog>
    </>
  );
};

export default Modal;
