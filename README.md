# Beauty Care AI

An AI-powered beauty specialist application that provides personalized skincare and haircare recommendations based on your unique beauty profile. Built with Next.js, Google Gemini AI, and MongoDB.

## 🌐 Live Demo

[https://beauty-care-ai.vercel.app/](https://beauty-care-ai.vercel.app/)

## ✨ Features

- **AI-Powered Chatbot** - Have natural conversations with an AI beauty specialist trained as a licensed trichologist, dermatologist, and cosmetologist
- **Personalized Recommendations** - Get tailored product suggestions and routines based on your unique skin and hair profile
- **Beauty Profile Onboarding** - Complete a comprehensive beauty profile including hair type, skin type, sensitivity, and more
- **Skin Analysis** - Receive expert analysis of your skin type, texture, and concerns
- **Hair Analysis** - Get evaluations of your hair type, condition, and personalized haircare recommendations
- **Credit System** - Manage credits to access expert advice and personalized treatment plans
- **Chat History** - Resume previous conversations and track your beauty journey
- **Dark/Light Theme** - Choose your preferred visual mode
- **Responsive Design** - Seamless experience across desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Form handling and validation
- [Lucide React](https://lucide.dev/) - Icons

### Backend
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - API endpoints
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) - Database
- [NextAuth.js v5](https://authjs.dev/) - Authentication
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing

### AI
- [Google Gemini AI](https://ai.google.dev/) - AI model (gemini-2.5-flash)
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI integration

### Payments
- [Paystack](https://paystack.com/) - Payment processing (via react-paystack)

### Development Tools
- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Code formatting
- [Husky](https://typicode.github.io/husky/) - Git hooks
- [Commitlint](https://commitlint.js.org/) - Commit message linting
- [lint-staged](https://github.com/lint-staged/lint-staged) - Pre-commit linting

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/)
- [MongoDB](https://www.mongodb.com/) database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Google AI API Key](https://ai.google.dev/) for Gemini access
- [Paystack Account](https://paystack.com/) (for payment features)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/EbubeEvan/Beauty-Care-AI.git
cd Beauty-Care-AI
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
AUTH_SECRET=your_auth_secret_key
AUTH_URL=http://localhost:3000

# Google AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

# Paystack (for payments)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

```
Beauty-Care-AI/
├── public/
│   └── images/              # Static images (hero, profile pics)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Authentication pages (login, signup)
│   │   ├── api/             # API routes
│   │   │   ├── chat/        # AI chat endpoint
│   │   │   ├── credits/     # Credit management
│   │   │   ├── history/     # Chat history
│   │   │   └── prices/      # Pricing data
│   │   ├── buy-credits/     # Credits purchase page
│   │   ├── chat/            # Chat interface
│   │   │   └── [id]/        # Dynamic chat routes
│   │   └── profile/         # User profile page
│   ├── components/          # React components
│   │   ├── Profile/         # Profile components
│   │   ├── buy-credits/     # Pricing components
│   │   ├── chat/            # Chat UI components
│   │   ├── design-system/   # Reusable design components
│   │   ├── landing/         # Landing page sections
│   │   ├── login/           # Login form
│   │   ├── onboarding/      # Beauty profile onboarding
│   │   ├── signup/          # Signup form
│   │   └── ui/              # Base UI components (shadcn/ui)
│   ├── database/
│   │   ├── dbConnect.ts     # MongoDB connection
│   │   └── models/          # Mongoose models
│   │       ├── chatHistory.model.ts
│   │       ├── price.model.ts
│   │       └── user.model.ts
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── actions.ts       # Server actions
│   │   ├── data.ts          # Static data and constants
│   │   ├── fetchData.ts     # Data fetching utilities
│   │   ├── store/           # Zustand store
│   │   ├── types.ts         # TypeScript types and schemas
│   │   └── utils.ts         # Utility functions
│   ├── Providers/           # React context providers
│   ├── styles/              # Global styles
│   ├── auth.config.ts       # NextAuth configuration
│   └── auth.ts              # NextAuth setup
├── .husky/                  # Git hooks
├── components.json          # shadcn/ui configuration
├── eslint.config.mjs        # ESLint configuration
├── next.config.mjs          # Next.js configuration
├── postcss.config.mjs       # PostCSS configuration
├── prettier.config.mjs      # Prettier configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send messages to AI beauty specialist |
| `/api/history` | GET | Retrieve user's chat history |
| `/api/credits` | GET/POST | Manage user credits |
| `/api/prices` | GET | Get credit pricing information |

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |

## 🎨 Beauty Profile Parameters

When onboarding, users provide the following information:

### Hair Profile
- **Hair Color** - Natural hair color (e.g., Black, Brown)
- **Hair Type** - Curl pattern (1a-4c scale)
- **Strand Thickness** - Fine, Medium, or Coarse
- **Chemical Treatment** - Relaxer, Color/Bleach, Perm, Keratin, or None
- **Hair Volume** - Thin, Medium, or Thick

### Skin Profile
- **Skin Color** - Skin tone description
- **Skin Type** - Oily, Combination, or Dry
- **Sensitivity** - Mildly sensitive, Not sensitive, or Very sensitive
- **Albino** - Yes or No

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are validated using commitlint.

Examples:
- `feat: add new skin analysis feature`
- `fix: resolve chat history loading issue`
- `docs: update README with API documentation`
- `style: format code with prettier`
- `refactor: simplify authentication flow`

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com/):

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/EbubeEvan/Beauty-Care-AI)

### Other Platforms

This app can also be deployed on other platforms that support Next.js:
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- Self-hosted with Docker

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Vercel AI SDK](https://sdk.vercel.ai/) for seamless AI integration
- [Google Gemini](https://ai.google.dev/) for the AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [MongoDB](https://www.mongodb.com/) for the database solution

---

Made with ❤️ by [Ebube Evan](https://github.com/EbubeEvan)
