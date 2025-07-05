# World Relief - Disaster Relief Donation Platform

## Project Overview

World Relief is a Worldcoin-based mini-app that enables fast and transparent donations to disaster areas worldwide. This platform maximizes transparency and efficiency in the donation process by leveraging Worldcoin's biometric authentication technology and cryptocurrency payment systems.

## Key Features

- **Worldcoin Authentication**: Secure user authentication through biometric verification
- **Anonymous Donations**: Privacy protection and anonymous giving through Incognito Actions
- **Cryptocurrency Payments**: Minimized international transfer fees using various tokens like USDC
- **Real-time Disaster Information**: Monitoring and information provision for global disaster situations
- **Transparent Donation Tracking**: Blockchain-based donation tracking system

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Authentication**: Worldcoin MiniKit, Next-Auth
- **Payments**: Worldcoin Payment API
- **UI**: Mini Apps UI Kit

## Getting Started

1. Copy `.env.example` to `.env.local`
2. Configure environment variables according to the instructions in the `.env.local` file
3. Run `npm run dev`
4. Run `ngrok http 3000` for development testing
5. Run `npx auth secret` to update the `AUTH_SECRET` in the `.env.local` file
6. Add your domain to `allowedDevOrigins` in the `next.config.ts` file
7. [For Testing] If using a proxy like ngrok, update the `AUTH_URL` in the `.env.local` file to your ngrok URL
8. Ensure your app is connected to the correct ngrok URL in developer.worldcoin.org
9. [Optional] Additional setup in the developer portal is required for Verify and Send Transaction features

## Environment Variables

- `APP_ID`: Worldcoin Developer Portal app ID
- `DEV_PORTAL_API_KEY`: Worldcoin Developer Portal API key
- `WORLDCOIN_API_KEY`: Worldcoin API key (for Incognito Action creation)
- `AUTH_SECRET`: Next-Auth authentication secret
- `AUTH_URL`: Authentication URL (ngrok URL in development environment)

## Architecture

This project follows the Feature-Sliced Design (FSD) architecture:

- `app/`: Global configuration and API routes
- `pages/`: Route-specific pages
- `features/`: User functionalities (donations, authentication, etc.)
- `entities/`: Domain data, API/Graph
- `widgets/`: Composed UI blocks
- `shared/`: Reusable generic components (UI, utils)
