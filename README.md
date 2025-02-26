# NammaLakes Dashboard

A real-time dashboard for monitoring water quality parameters across lakes in Bangalore 

###### Note: The master branch of this repo uses sample data for demonstration purposes. The actual dashboard code is in the `prod` branch.

###### To view the sample dashboard, click [here](https://nammalakes.github.io/dashboard). and use password `admin` to access the dashboard.

## Features
- Real-time monitoring
- Interactive maps
- Dynamic metrics and trends
- Alerts for parameter thresholds
- Multilingual support (English and Kannada)
- Responsive design

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- react-i18next
- Recharts
- Leaflet Maps
- React Query

## Getting Started

1. Install dependencies:

```sh
npm install
```

2. Start the development server:

```sh
npm run dev
```

3. Open the browser and navigate to `http://localhost:3000`.

## Project Structure

```
src/
├── components/    # Reusable UI components
├── hooks/        # Custom React hooks
├── lib/          # Utilities and configurations
├── locales/      # Translation files
├── pages/        # Page components
└── App.tsx       # Root component
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.