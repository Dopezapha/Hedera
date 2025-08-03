# HashQuest Frontend

Welcome to the HashQuest Frontend repository! This project is a Next.js application built to provide a user interface for a game dashboard, wallet management, and leaderboard functionalities, with integration into the Hedera network.

## Features

HashQuest Frontend is designed to offer a rich user experience for interacting with the game and its underlying blockchain functionalities. Key features include:

-   **Wallet Management**: Create, import, and connect real wallets (e.g., MetaMask) for in-game transactions.
-   **Game Dashboard**: A central hub for game-related activities and information.
-   **Leaderboard**: View player rankings and progress.
-   **Hedera Integration**: Connects with the Hedera network for blockchain interactions.
-   **Authentication**: User sign-up, sign-in, and password recovery.
-   **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.
-   **Theming**: Customizable UI with shadcn/ui components.

## Technologies Used

This project leverages the following modern web technologies:

-   **Next.js 14**: A React framework for building full-stack web applications, utilizing the App Router for routing and Server Components for performance.
-   **React 18**: A JavaScript library for building user interfaces.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
-   **shadcn/ui**: A collection of reusable components built with Radix UI and Tailwind CSS.
-   **Lucide React**: A collection of beautiful and customizable open-source icons.
-   **MetaMask**: Integration for connecting to Ethereum-compatible wallets.
-   **Hedera SDK**: For interacting with the Hedera network (planned integration).
-   **Vercel AI SDK**: For potential future AI integrations (e.g., ChatGPT).

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js**: Version 18.x or higher. You can download it from [nodejs.org](https://nodejs.org/).
-   **npm** or **Yarn** or **pnpm**: Node.js package manager. npm comes with Node.js.

### Installation

1.  **Clone the repository**:
    \`\`\`bash
    git clone Repo
    cd hashquest-frontend

2.  **Install dependencies**:
    \`\`\`bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    \`\`\`

### Running the Development Server

To start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The application will automatically reload if you make changes to the source code.

## Project Structure

The project follows the Next.js App Router conventions for a modular and scalable structure:

\`\`\`
hashquest-frontend/
├── src/
│   ├── app/                  # Main application routes and pages
│   │   ├── api/              # Route Handlers for backend APIs
│   │   ├── auth/             # Authentication-related pages (signin, signup, forgot-password)
│   │   ├── connect-wallet/   # Page for connecting wallets
│   │   ├── dashboard/        # Game dashboard page
│   │   ├── history/          # Game history page
│   │   ├── leaderboard/      # Leaderboard page
│   │   ├── privacy/          # Privacy policy page
│   │   ├── support/          # Support page
│   │   ├── terms/            # Terms and conditions page
│   │   ├── wallet/           # Wallet management pages (create, import)
│   │   ├── layout.tsx        # Root layout for the application
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global CSS styles (Tailwind CSS directives)
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # shadcn/ui components (button, card, input, etc.)
│   │   ├── navigation.tsx    # Main navigation component
│   │   └── providers.tsx     # Context providers (e.g., ThemeProvider)
│   ├── contexts/             # React Contexts for global state (e.g., WalletContext, GameContext)
│   ├── lib/                  # Utility functions and helper modules (e.g., utils.ts)
├── public/                   # Static assets (images, fonts)
├── tailwind.config.js        # Tailwind CSS configuration
├── next.config.mjs           # Next.js configuration
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
\`\`\`

## Environment Variables

This project may require environment variables for API keys, database connections, or other sensitive information. Create a `.env.local` file in the root of your project and add the necessary variables.

Example `.env.local`:

\`\`\`
# Example environment variables (adjust as needed)
NEXT_PUBLIC_METAMASK_PROJECT_ID=your_metamask_project_id
HEDERA_NETWORK_API_KEY=your_hedera_api_key
\`\`\`