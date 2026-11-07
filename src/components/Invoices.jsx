import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "./Modal";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
  } catch {
    const apiLocation = API_URL.startsWith("/")
      ? "the Go API at http://127.0.0.1:8080"
      : `the API at ${API_URL}`;
    throw new Error(`Cannot reach ${apiLocation}. Start the Go API and MongoDB, then retry.`);
  }
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `Request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function dueDate(invoice) {
  const date = new Date(`${invoice.invoiceDate}T00:00:00`);
  date.setDate(date.getDate() + Number(invoice.paymentTerms));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isCreate, setIsCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await request("/invoices");
      setInvoices(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const visibleInvoices = useMemo(
    () => filter === "all" ? invoices : invoices.filter((invoice) => invoice.status === filter),
    [filter, invoices],
  );
  const counts = useMemo(
    () => ({
      all: invoices.length,
      draft: invoices.filter((invoice) => invoice.status === "draft").length,
      pending: invoices.filter((invoice) => invoice.status === "pending").length,
      paid: invoices.filter((invoice) => invoice.status === "paid").length,
    }),
    [invoices],
  );

  async function saveInvoice(data, status) {
    setBusy(true);
    setError("");
    try {
      const payload = { ...data, status };
      const invoice = editing
        ? await request(`/invoices/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
        : await request("/invoices", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      setInvoices((current) => editing
        ? current.map((item) => item.id === invoice.id ? invoice : item)
        : [invoice, ...current]);
      setSelected(invoice);
      setEditing(null);
      setIsCreate(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  }

  async function markAsPaid(invoice) {
    setBusy(true);
    setError("");
    try {
      const updated = await request(`/invoices/${invoice.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "paid" }),
      });
      setInvoices((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSelected(updated);
    } catch (paymentError) {
      setError(paymentError.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteInvoice(invoice) {
    if (!window.confirm(`Are you sure you want to delete invoice #${invoice.id.slice(-6).toUpperCase()}? This action cannot be undone.`)) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      await request(`/invoices/${invoice.id}`, { method: "DELETE" });
      setInvoices((current) => current.filter((item) => item.id !== invoice.id));
      setSelected(null);
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setBusy(false);
    }
  }

  function openCreate() {
    setError("");
    setSelected(null);
    setEditing(null);
    setIsCreate(true);
  }

  function openEdit(invoice) {
    setError("");
    setSelected(null);
    setEditing(invoice);
    setIsCreate(true);
  }

  return (
    <main className="invoice-main">
      <div className="invoice-content">
        {selected ? (
          <section aria-label="Invoice details">
            <button className="back-button" onClick={() => setSelected(null)}>
              <span className="fa-solid fa-arrow-left" aria-hidden="true" /> Go back
            </button>
            <div className="detail-toolbar">
              <div className="detail-status">
                <span>Status</span>
                <Status status={selected.status} />
              </div>
              <div className="detail-actions">
                <button className="button button-muted" disabled={busy} onClick={() => openEdit(selected)}>Edit</button>
                <button className="button button-danger" disabled={busy} onClick={() => deleteInvoice(selected)}>Delete</button>
                {selected.status === "pending" && (
                  <button className="button button-primary" disabled={busy} onClick={() => markAsPaid(selected)}>Mark as Paid</button>
                )}
              </div>
            </div>
            <article className="detail-card">
              <div className="detail-top">
                <div>
                  <h1><span className="muted-hash">#</span>{selected.id.slice(-6).toUpperCase()}</h1>
                  <p>{selected.description}</p>
                </div>
                <Address lines={[selected.fromStreetAddress, selected.fromCity, selected.fromPostalCode, selected.fromCountry]} />
              </div>
              <div className="detail-meta">
                <div>
                  <Meta label="Invoice Date" value={formatDate(selected.invoiceDate)} />
                  <Meta label="Payment Due" value={formatDate(dueDate(selected))} />
                </div>
                <div>
                  <Meta label="Bill To" value={selected.clientName} />
                  <Address lines={[selected.clientStreetAddress, selected.clientCity, selected.clientPostalCode, selected.clientCountry]} />
                </div>
                <Meta label="Sent to" value={selected.clientEmail} />
              </div>
              <div className="items-panel">
                <div className="items-table">
                  <div className="items-head"><span>Item Name</span><span>QTY.</span><span>Price</span><span>Total</span></div>
                  {selected.items.map((item, index) => (
                    <div className="items-row" key={`${item.itemName}-${index}`}>
                      <strong>{item.itemName}</strong>
                      <span>{item.quantity}</span>
                      <span>{currency.format(item.price)}</span>
                      <strong>{currency.format(item.quantity * item.price)}</strong>
                    </div>
                  ))}
                </div>
                <div className="amount-due">
                  <span>Amount Due</span>
                  <strong>{currency.format(selected.total)}</strong>
                </div>
              </div>
            </article>
          </section>
        ) : (
          <>
            <div className="page-heading">
              <div>
                <h1>Invoices</h1>
                <p>{counts.all === 0 ? "No invoices yet" : `There ${counts.all === 1 ? "is" : "are"} ${counts.all} total invoice${counts.all === 1 ? "" : "s"}`}</p>
              </div>
              <div className="list-controls">
                <label className="filter-control">
                  <span className="filter-label">Filter <span className="wide-label">by status</span></span>
                  <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter invoices by status">
                    <option value="all">All invoices</option>
                    <option value="draft">Draft ({counts.draft})</option>
                    <option value="pending">Pending ({counts.pending})</option>
                    <option value="paid">Paid ({counts.paid})</option>
                  </select>
                  <span className="fa-solid fa-angle-down select-icon" aria-hidden="true" />
                </label>
                <button className="button button-primary new-invoice" onClick={openCreate}>
                  <span className="plus-circle"><span className="fa-solid fa-plus" aria-hidden="true" /></span>
                  <span className="wide-label">New Invoice</span><span className="mobile-label">New</span>
                </button>
              </div>
            </div>

            {error && <div className="notice" role="alert">{error}<button onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}
            {loading ? (
              <div className="empty-state"><span className="fa-solid fa-circle-notch fa-spin" /> Loading invoices…</div>
            ) : visibleInvoices.length ? (
              <div className="invoice-list">
                {visibleInvoices.map((invoice) => (
                  <button className="invoice-card" key={invoice.id} onClick={() => setSelected(invoice)}>
                    <span className="invoice-id"><span className="muted-hash">#</span>{invoice.id.slice(-6).toUpperCase()}</span>
                    <span className="invoice-due">Due {formatDate(dueDate(invoice))}</span>
                    <span className="invoice-client">{invoice.clientName}</span>
                    <strong className="invoice-total">{currency.format(invoice.total)}</strong>
                    <Status status={invoice.status} />
                    <span className="fa-solid fa-chevron-right invoice-chevron" aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-illustration"><span className="fa-regular fa-file-lines" /></div>
                <h2>{invoices.length ? "No matching invoices" : "There is nothing here"}</h2>
                <p>{invoices.length ? "Try a different status filter." : "Create an invoice to get started. Get paid for your work with just a few clicks."}</p>
                {!invoices.length && <button className="button button-primary" onClick={openCreate}>Create an invoice</button>}
              </div>
            )}
          </>
        )}
        {error && selected && <div className="notice" role="alert">{error}<button onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}
      </div>
      {isCreate && (
        <Modal
          invoice={editing}
          busy={busy}
          error={error}
          closeModal={() => { setIsCreate(false); setEditing(null); }}
          onSave={saveInvoice}
        />
      )}
    </main>
  );
};

function Status({ status }) {
  return <span className={`status status-${status}`}><span className="status-dot" />{status[0].toUpperCase() + status.slice(1)}</span>;
}

function Address({ lines }) {
  return <address>{lines.filter(Boolean).map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}</address>;
}

function Meta({ label, value }) {
  return <div className="meta-block"><span>{label}</span><strong>{value}</strong></div>;
}

export default Invoices;
