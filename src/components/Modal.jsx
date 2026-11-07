import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "./Input";

const itemSchema = z.object({
  itemName: z.string().trim().min(1, "Enter an item name"),
  quantity: z.number({ invalid_type_error: "Enter a quantity" }).int().min(1, "Quantity must be at least 1"),
  price: z.number({ invalid_type_error: "Enter a price" }).positive("Price must be greater than 0"),
});

const invoiceSchema = z.object({
  fromStreetAddress: z.string().trim().min(3, "Enter a street address"),
  fromCity: z.string().trim().min(2, "Enter a city"),
  fromPostalCode: z.string().trim().min(1, "Enter a postal code"),
  fromCountry: z.string().trim().min(2, "Enter a country"),
  clientName: z.string().trim().min(2, "Enter the client's name"),
  clientEmail: z.string().trim().email("Enter a valid email address"),
  clientStreetAddress: z.string().trim().min(3, "Enter a street address"),
  clientCity: z.string().trim().min(2, "Enter a city"),
  clientPostalCode: z.string().trim().min(1, "Enter a postal code"),
  clientCountry: z.string().trim().min(2, "Enter a country"),
  invoiceDate: z.string().min(1, "Choose an invoice date"),
  paymentTerms: z.number().refine((value) => [1, 7, 14, 30].includes(value), "Choose payment terms"),
  description: z.string().trim().min(2, "Enter a description"),
  items: z.array(itemSchema).min(1, "Add at least one item"),
});

const blankItem = { itemName: "", quantity: 1, price: 0 };
const currentDate = new Date();
const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
const emptyInvoice = {
  fromStreetAddress: "",
  fromCity: "",
  fromPostalCode: "",
  fromCountry: "",
  clientName: "",
  clientEmail: "",
  clientStreetAddress: "",
  clientCity: "",
  clientPostalCode: "",
  clientCountry: "",
  invoiceDate: today,
  paymentTerms: 30,
  description: "",
  items: [blankItem],
};

function Field({ label, name, register, errors, type = "text", ...props }) {
  return (
    <Input
      id={name}
      labelText={label}
      name={name}
      type={type}
      register={register}
      errors={errors}
      {...props}
    />
  );
}

const Modal = ({ closeModal, invoice, busy, error, onSave }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoice
      ? { ...invoice, items: invoice.items.map((item) => ({ ...item })) }
      : emptyInvoice,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  function submitWithStatus(status) {
    return handleSubmit((data) => onSave(data, status))();
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeModal();
    }}>
      <section className="invoice-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="modal-close" aria-label="Close form" onClick={closeModal}>
          <span className="fa-solid fa-xmark" />
        </button>
        <div className="modal-scroll">
          <h2 id="modal-title">{invoice ? `Edit #${invoice.id.slice(-6).toUpperCase()}` : "New Invoice"}</h2>
          <p className="modal-intro">{invoice ? "Update the invoice details below." : "Create a new invoice for your client."}</p>
          {error && <p className="form-error-summary" role="alert">{error}</p>}
          <form onSubmit={handleSubmit((data) => onSave(data, invoice?.status || "pending"))} noValidate>
            <fieldset disabled={busy}>
              <legend>Bill From</legend>
              <Field label="Street Address" name="fromStreetAddress" register={register} errors={errors.fromStreetAddress} />
              <div className="form-grid form-grid-three">
                <Field label="City" name="fromCity" register={register} errors={errors.fromCity} />
                <Field label="Postal Code" name="fromPostalCode" register={register} errors={errors.fromPostalCode} />
                <Field label="Country" name="fromCountry" register={register} errors={errors.fromCountry} />
              </div>

              <div className="form-section-title">Bill To</div>
              <div className="form-grid form-grid-two">
                <Field label="Client's Name" name="clientName" register={register} errors={errors.clientName} />
                <Field label="Client's Email" name="clientEmail" type="email" placeholder="e.g. email@example.com" register={register} errors={errors.clientEmail} />
              </div>
              <Field label="Street Address" name="clientStreetAddress" register={register} errors={errors.clientStreetAddress} />
              <div className="form-grid form-grid-three">
                <Field label="City" name="clientCity" register={register} errors={errors.clientCity} />
                <Field label="Postal Code" name="clientPostalCode" register={register} errors={errors.clientPostalCode} />
                <Field label="Country" name="clientCountry" register={register} errors={errors.clientCountry} />
              </div>
              <div className="form-grid form-grid-two">
                <Field label="Invoice Date" name="invoiceDate" type="date" register={register} errors={errors.invoiceDate} />
                <div className="field">
                  <label htmlFor="paymentTerms">Payment Terms <sup>*</sup></label>
                  <select id="paymentTerms" className={`input-control ${errors.paymentTerms ? "input-invalid" : ""}`} {...register("paymentTerms", { valueAsNumber: true })}>
                    <option value={1}>Net 1 Day</option>
                    <option value={7}>Net 7 Days</option>
                    <option value={14}>Net 14 Days</option>
                    <option value={30}>Net 30 Days</option>
                  </select>
                  {errors.paymentTerms && <span className="field-error">{errors.paymentTerms.message}</span>}
                </div>
              </div>
              <Field label="Project Description" name="description" register={register} errors={errors.description} placeholder="e.g. Graphic Design" />

              <div className="line-items-heading">
                <h3>Item List</h3>
                {errors.items?.message && <span className="field-error">{errors.items.message}</span>}
              </div>
              {fields.map((field, index) => (
                <div className="line-item-row" key={field.id}>
                  <Field label="Item Name" name={`items.${index}.itemName`} register={register} errors={errors.items?.[index]?.itemName} />
                  <Field label="Qty." name={`items.${index}.quantity`} type="number" register={register} errors={errors.items?.[index]?.quantity} min="1" valueAsNumber />
                  <Field label="Price" name={`items.${index}.price`} type="number" register={register} errors={errors.items?.[index]?.price} min="0.01" step="0.01" valueAsNumber />
                  <button type="button" className="remove-item" aria-label={`Remove item ${index + 1}`} onClick={() => remove(index)}>
                    <span className="fa-solid fa-trash" />
                  </button>
                </div>
              ))}
              <button type="button" className="add-item-button" onClick={() => append({ ...blankItem })}>
                <span className="fa-solid fa-plus" /> Add New Item
              </button>
            </fieldset>
          </form>
        </div>
        <footer className="modal-footer">
          <button type="button" className="button button-muted" disabled={busy} onClick={closeModal}>Cancel</button>
          <div className="modal-submit-actions">
            <button type="button" className="button button-dark" disabled={busy} onClick={() => submitWithStatus(invoice?.status || "draft")}>
              {busy ? "Saving…" : invoice ? "Save Changes" : "Save as Draft"}
            </button>
            {!invoice && <button type="button" className="button button-primary" disabled={busy} onClick={() => submitWithStatus("pending")}>
              {busy ? "Saving…" : "Save & Send"}
            </button>}
            {invoice?.status === "draft" && <button type="button" className="button button-primary" disabled={busy} onClick={() => submitWithStatus("pending")}>
              {busy ? "Saving…" : "Save & Send"}
            </button>
            }
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Modal;
