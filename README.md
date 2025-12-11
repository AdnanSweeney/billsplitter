# BillSplitter

Split bills with different tax rates applied to different charges

## 🚀 Live Application

The app is deployed and accessible at: **https://billsplitter.surge.sh**

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Styled Components** - CSS-in-JS styling
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
├── styles/         # Global styles and styled-components
├── App.tsx         # Main App component
└── main.tsx        # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:5173/

### Build

Create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview

Preview the production build:

```bash
npm run preview
```

## Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Deployment

The app is deployed to surge.sh, a static hosting platform. For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy

```bash
npm run deploy
```

This will build the app and deploy it to https://billsplitter.surge.sh

## Features (Planned)

- [ ] Add bills with different tax rates
- [ ] Split bills among multiple people
- [ ] Apply different tax rates to different charges
- [ ] Calculate individual shares
- [ ] Export/import bill data

## License

ISC
