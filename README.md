# 🇧🇹 Bhutan NDI Verification Demo

<img width="1512" alt="Screenshot 2025-06-25 at 10 22 19 AM" src="https://github.com/user-attachments/assets/7717e179-5042-473b-b425-b04928261c71" />


🏗️ **Built on Scaffold-ETH 2**: A complete demo application showcasing Bhutan's National Digital Identity (NDI) verification service integration.

🆔 **Identity Verification**: Secure, privacy-preserving identity verification using Bhutan's official NDI wallet app through QR code scanning.

⚙️ Built using NextJS, TypeScript, Tailwind CSS, and integrates with Bhutan NDI staging environment.

## Features

- ✅ **QR Code Verification**: Generate verification requests as QR codes for mobile wallet scanning
- 🔐 **Secure Identity Sharing**: Users can securely share their Full Name and National ID Number
- 📊 **Verification Dashboard**: Track verification history and status
- 🪝 **Webhook Integration**: Real-time updates when verification is completed


## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Ngrok](https://ngrok.com/download) - For local webhook development
- **Bhutan NDI Credentials** - Obtain from the Bhutan NDI portal

## Setup

### 1. Setup the repo: 

```bash
npx create-eth@latest -e technophile-04/ndi-bhutan
```

### 2. Environment Configuration

Copy the environment example file and configure your credentials:

```bash
cd packages/nextjs
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Bhutan NDI Configuration
NDI_CLIENT_ID=your_ndi_client_id_here
NDI_CLIENT_SECRET=your_ndi_client_secret_here

# Webhook Configuration
WEBHOOK_ID=your_unique_webhook_id_here (can be random)
WEBHOOK_TOKEN=your_webhook_auth_token_here (can be random)

# Ngrok Configuration (for local development)
NGROK_API=http://localhost:4040/api/tunnels
```

**Getting NDI Credentials:**

1. Register at the Bhutan NDI Developer Portal
2. Create a new application
3. Obtain your `client_id` and `client_secret`

### 3. Setup Ngrok (Required for Webhooks)

Ngrok is required to expose your local development server for webhook callbacks from the NDI service.

1. [Download and install Ngrok](https://ngrok.com/download)
2. Sign up for a free Ngrok account
3. Authenticate ngrok with your authtoken:
   ```bash
   ngrok authtoken <your-auth-token>
   ```

## Usage

### Development Workflow

1. **Start Ngrok** (in a separate terminal):

   ```bash
   ngrok http 3000
   ```

   Keep this running - the NDI service needs to reach your webhook endpoint.

2. **Start the Application**:

   ```bash
   yarn start
   ```

3. **Access the Application**:
   Visit `http://localhost:3000` to use the NDI verification demo.

### Application Routes

- **`/`** - Landing page with overview and navigation
- **`/verify`** - Identity verification page with QR code generation
- **`/dashboard`** - Verification history and status dashboard
- **`/debug`** - Smart contract debugging (Scaffold-ETH 2 feature)

### Verification Process

1. **Generate QR Code**: Visit `/verify` to create a new verification request
2. **Scan with NDI Wallet**: Use the official Bhutan NDI wallet app to scan the QR code
3. **Approve Sharing**: Review and approve sharing your identity credentials
4. **View Results**: See verification results in real-time on the webpage
5. **Check Dashboard**: View verification history on the `/dashboard` page

## API Endpoints

- **`GET /api/proof`** - Generates a new verification request and QR code
- **`POST /api/webhook`** - Receives verification completion notifications from NDI service
- **`GET /api/webhook`** - Returns the latest verification result

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   NDI Wallet    │    │  Your Browser   │    │ Bhutan NDI API  │
│     (Mobile)    │    │  (localhost)    │    │   (Staging)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Scan QR Code       │ 2. Generate Request   │
         │◄──────────────────────┼──────────────────────►│
         │                       │                       │
         │ 3. Share Credentials  │ 4. Webhook Callback   │
         │──────────────────────►│◄──────────────────────│
         │                       │                       │
         │                  5. Display Results          │
         │                       │                       │
```

