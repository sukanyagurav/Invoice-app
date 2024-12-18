import React, { useState } from "react";
import Input from "./Input";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Errors from "./Errors";

const itemsType = z.object({
  itemName: z.string().min(1, { message: "Item Name is required" }),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  price: z.number().min(1, { message: "Price must be a positive number" }),
});
const schemaTypes = {
  fromStreetAddress: z
    .string()
    .min(15, { message: "Please enter Street address" }),
  fromCity: z.string().min(3, { message: "Please enter City" }),
  fromPostalCode: z.number({ message: "This field is required!" }),
  fromCountry: z.string().min(3, { message: "Please enter Country" }),
  clientName: z.string().min(2, { message: "Please enter Client Name" }),
  clientEmail: z.string().email({ message: "Please enter a valid email" }),
  clientStreetAddress: z
    .string()
    .min(15, { message: "Please enter Client Street address" }),
  clientCity: z.string().min(3, { message: "Please enter Client City" }),
  clientPostalCode: z.number({ message: "This field is required!" }),
  clientCountry: z.string().min(3, { message: "Please enter client Country" }),
  description: z.string().min(2, { message: "Please enter description" }),
  items: z
    .array(itemsType)
    .min(1, { message: "At least one item is required" }),
};
const Modal = ({ closeModal, children, isOpen }) => {
  const [itemList, setItemList] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const schema = z.object(schemaTypes);
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      items: [],
    },
  });
  const invalidInputs = Object.keys(errors).length;
  function addItem(e) {
    e.preventDefault();
    setItemList([
      ...itemList,
      { name: "", quantity: 0, price: 0, total: 0, id: uuidv4() },
    ]);
  }

  function removeItem(index) {
    const newArray = [...itemList].filter((item) => item.id !== index);
    setItemList(newArray);
  }

  function validateData(data) {
    console.log(data);
  }
  return (
    <>
      <div
        className="fixed bg-[rgba(0,0,0,0.39)] top-0 left-0 bottom-0 w-full h-full z-10 "
        onClick={closeModal}
      ></div>
      <dialog
        className="fixed top-[5rem] md:top-0 -left-0  p-4 pt-12 md:p-12 md:pl-[8rem]  min-h-screen   text-black z-20  drop-shadow-2xl rounded-tr-3xl rounded-br-3xl w-full md:w-[700px] md:right-auto  "
        open={isOpen}
      >
        <h2 className="text-3xl font-bold mb-6">Create Invoice</h2>
        <form
          noValidate="noValidate"
          className=" overflow-y-scroll h-[56vh] md:h-[70vh] "
        >
          <div className="mb-0 h-full pr-4 md:pr-8 pl-1">
            <h3 className="text-[#7C5DFA] font-bold">Bill From</h3>
            <div>
              <Input
                id="fromStreetAddress"
                labelText="Street Address"
                type="text"
                name="fromStreetAddress"
                register={register}
                errors={errors.fromStreetAddress}
              />

              <div className="flex gap-4">
                <Input
                  id="fromCity"
                  labelText="City"
                  type="text"
                  name="fromCity"
                  register={register}
                  errors={errors.fromCity}
                />

                <Input
                  id="fromPostalCode"
                  labelText="Postal Code"
                  type="number"
                  name="fromPostalCode"
                  register={register}
                  errors={errors.fromPostalCode}
                  valueAsNumber={true}
                />

                <Input
                  id="fromCountry"
                  labelText="Country"
                  type="text"
                  name="fromCountry"
                  register={register}
                  errors={errors.fromCountry}
                />
              </div>
            </div>
            <h3 className="text-[#7C5DFA] mt-6 font-bold">Bill To</h3>
            <div>
              <Input
                id="billToClientName"
                labelText="Client's Name"
                type="text"
                name="clientName"
                register={register}
                errors={errors.clientName}
              />

              <Input
                id="billToStreetAddress"
                labelText="Client's Email"
                type="email"
                placeholder="e.g. email@example.com"
                name="clientEmail"
                register={register}
                errors={errors.clientEmail}
              />

              <Input
                id="billToStreetAddress"
                labelText="Street Address"
                type="text"
                name="clientStreetAddress"
                register={register}
                errors={errors.clientStreetAddress}
              />
              <div className="flex gap-4">
                <Input
                  id="billToCity"
                  labelText="City"
                  type="text"
                  name="clientCity"
                  register={register}
                  errors={errors.clientCity}
                />
                <Input
                  id="billToPostalCode"
                  labelText="Postal Code"
                  type="number"
                  name="clientPostalCode"
                  register={register}
                  errors={errors.clientPostalCode}
                  valueAsNumber={true}
                />
                <Input
                  id="billToCountry"
                  labelText="Country"
                  type="text"
                  name="clientCountry"
                  register={register}
                  errors={errors.clientCountry}
                />
              </div>
              <div className="flex gap-4 ">
                <div className="flex-1 flex flex-col  relative">
                  <label
                    htmlFor="payementTerms"
                    className="opacity-[0.8] mt-4 mb-2 "
                  >
                    Invoice Date
                  </label>
                  <input
                    value={date}
                    type="date"
                    onChange={(e) => setDate(e.target.value)}
                    className="p-[0.5rem] border-[0.1rem] border-[#e5e7eb] rounded-lg !bg-transparent "
                  />
                </div>

                <div className="flex-1 flex flex-col  relative">
                  <label
                    htmlFor="payementTerms"
                    className="opacity-[0.8] mt-4 mb-2 "
                  >
                    Payment Terms
                  </label>
                  <select
                    id="payementTerms"
                    className="p-[0.6rem] border-[0.1rem] border-[#e5e7eb] rounded-lg bg-transparent focus:outline-[#7C5DFA] appearance-none"
                  >
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
              <Input
                type="text"
                labelText="Description"
                id="description"
                name="description"
                register={register}
                errors={errors.description}
              />

              <h3 className="font-bold my-8  opacity-[0.7]">ItemList</h3>
              <div className="flex flex-col itemList ">
                {errors.items && <p>{errors.items.message}</p>}
                {itemList.length > 0 &&
                  itemList.map((item, index) => (
                    <div className="flex gap-4 " key={item.id}>
                      <Input
                        type="text"
                        labelText="Item Name"
                        id={`items.${index}.itemName`}
                        name={`items.${index}.itemName`}
                        register={register}
                        errors={errors.items?.[index]?.itemName}
                      />
                      <Input
                        type="number"
                        labelText="Qty."
                        id={`items.${index}.quantity`}
                        name={`items.${index}.quantity`}
                        register={register}
                        errors={errors.items?.[index]?.quantity}
                        valueAsNumber={true}
                      />
                      <Input
                        type="number"
                        labelText="Price"
                        id={`items.${index}.price`}
                        name={`items.${index}.price`}
                        register={register}
                        errors={errors.items?.[index]?.price}
                        valueAsNumber={true}
                      />
                      <div className="flex flex-col ">
                        <label htmlFor="total" className="opacity-[0.8] mt-4  ">
                          Total
                        </label>
                        <span className=" p-2 mt-3 block w-10">
                          {item.total}
                        </span>
                      </div>
                      <button
                        className="my-4 block hover:text-red-400 self-center"
                        onClick={() => removeItem(item.id)}
                      >
                        <span className="fa-solid fa-trash"></span>
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={(e) => addItem(e)}
                className="my-4 block w-full lightBtn p-4 rounded-full font-semibold mb-20"
              >
                + Add New Item
              </button>
            </div>
          </div>

          {invalidInputs > 0 && (
            <Errors errors={errors} length={invalidInputs} />
          )}

          <div className="flex md:bottom-0 fixed justify-between gap-4 py-4 mt-auto ">
            <button
              className="lightBtn p-3 rounded-lg px-4 md:px-8 md:rounded-full"
              onClick={closeModal}
            >
              Discard
            </button>
            <div className="flex gap-2">
              <button className="p-3 bg-[#363B53] px-3 rounded-lg md:ml-8 md:px-6 text-gray-300 md:rounded-full">
                Save as Draft
              </button>
              <button
                className="p-3 bg-[#7C5DFA] px-3  md:px-6 text-gray-300 rounded-lg md:rounded-full"
                onClick={handleSubmit(validateData)}
              >
                Save & Send
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default Modal;
