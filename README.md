# 🇧🇹 Bhutan NDI Verification Demo

<h4 align="center">
  <a href="#features">Features</a> |
  <a href="#requirements">Requirements</a> |
  <a href="#setup">Setup</a> |
  <a href="#usage">Usage</a>
</h4>

🏗️ **Built on Scaffold-ETH 2**: A complete demo application showcasing Bhutan's National Digital Identity (NDI) verification service integration.

🆔 **Identity Verification**: Secure, privacy-preserving identity verification using Bhutan's official NDI wallet app through QR code scanning.

⚙️ Built using NextJS, TypeScript, Tailwind CSS, and integrates with Bhutan NDI staging environment.

## Features

- ✅ **QR Code Verification**: Generate verification requests as QR codes for mobile wallet scanning
- 🔐 **Secure Identity Sharing**: Users can securely share their Full Name and National ID Number
- 📊 **Verification Dashboard**: Track verification history and status
- 🪝 **Webhook Integration**: Real-time updates when verification is completed
- 🌐 **Responsive UI**: Modern, accessible interface built with Tailwind CSS and DaisyUI
- 🔄 **Real-time Polling**: Automatic updates when verification status changes

![NDI Verification Demo](https://github.com/user-attachments/assets/verification-demo-screenshot.png)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Ngrok](https://ngrok.com/download) - For local webhook development
- **Bhutan NDI Credentials** - Obtain from the Bhutan NDI portal

## Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd bhutan-ndi
yarn install
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
WEBHOOK_ID=your_unique_webhook_id_here
WEBHOOK_TOKEN=your_webhook_auth_token_here

# Ngrok Configuration (for local development)
NGROK_API=http://localhost:4040/api/tunnels
```

**Getting NDI Credentials:**

1. Register at the Bhutan NDI Developer Portal
2. Create a new application
3. Obtain your `client_id` and `client_secret`
4. Generate a unique `webhook_id` and `webhook_token` for your application

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

## Troubleshooting

### Common Issues

1. **Ngrok Not Working**:

   - Ensure ngrok is running and accessible at `http://localhost:4040`
   - Check that your ngrok authtoken is configured
   - Verify the ngrok URL is HTTPS (required by NDI service)

2. **Environment Variables**:

   - Double-check your NDI credentials are correct
   - Ensure `.env.local` file is in the correct location (`packages/nextjs/`)
   - Restart the development server after changing environment variables

3. **QR Code Not Generating**:

   - Check the browser console for API errors
   - Verify your NDI credentials and network connectivity
   - Ensure the ngrok tunnel is active and reachable

4. **Webhook Not Receiving Data**:
   - Confirm ngrok is exposing port 3000
   - Check that the webhook URL in NDI service matches your ngrok URL
   - Look for webhook registration errors in the console

### Development Notes

- This demo uses Bhutan NDI **staging environment** - not suitable for production
- Verification history is stored in browser localStorage (not persistent)
- For production deployment, implement proper database storage and webhook security
- The application includes smart contract capabilities via Scaffold-ETH 2 for future blockchain integration

## Built With

- [Scaffold-ETH 2](https://scaffoldeth.io) - Ethereum development stack
- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [DaisyUI](https://daisyui.com/) - Component library
- [Bhutan NDI API](https://bhutanndi.com/) - Identity verification service

## Contributing

We welcome contributions! Please see the [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENCE) file for details.
