# Invoice app

A responsive invoice manager built with React/Vite and a Go API backed by MongoDB.

## Requirements

- Node.js 20 or newer
- Go 1.22 or newer
- MongoDB (local or hosted)

## Run locally

1. Start MongoDB. The API defaults to `mongodb://localhost:27017`.
2. Start the API:

   ```powershell
   cd backend
   go mod download
   go run .
   ```

3. In a separate terminal, install frontend dependencies and start Vite:

   ```powershell
   npm install
   npm run dev
   ```

Vite proxies `/api` requests to `http://127.0.0.1:8080`. Open the URL printed by Vite.

Keep MongoDB and the Go API running in separate terminals while using the frontend. If Vite reports `ECONNREFUSED` for `/api/invoices`, the API is not listening on port 8080. Start MongoDB first, then run `go run .` from `backend`; the API exits if it cannot connect to MongoDB.

On Windows, if MongoDB was installed as a Windows service, check and start it from an elevated PowerShell terminal:

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

If that service is not installed, start MongoDB using your MongoDB installation or set `MONGODB_URI` to an available MongoDB instance before running the API.

## Configuration

The Go API supports these environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `MONGODB_URI` | `mongodb://localhost:27017` | MongoDB connection string |
| `MONGODB_DATABASE` | `invoice_app` | Database name |
| `API_ADDRESS` | `:8080` | HTTP listen address |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated browser origins |

Set `VITE_API_URL` when the API is hosted at a different origin or base path. The default is `/api`.

## Features

- Create, view, edit, and delete invoices
- Validate invoice and line-item fields in the browser and API
- Save invoices as drafts or send them as pending
- Mark pending invoices as paid
- Filter invoices by draft, pending, or paid status
- Responsive invoice list and detail views
- Light/dark theme preference saved in `localStorage`

## API

- `GET /api/health`
- `GET /api/invoices?status=draft|pending|paid`
- `POST /api/invoices`
- `GET /api/invoices/{id}`
- `PUT /api/invoices/{id}`
- `PATCH /api/invoices/{id}/status` with `{"status":"paid"}`
- `DELETE /api/invoices/{id}`

## Tests

```powershell
cd backend
go test ./...
```
