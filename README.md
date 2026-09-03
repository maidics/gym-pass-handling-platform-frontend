# Overview

Frontend of my **thesis work**: payment facilitator and pass handling application for gyms. 

Provides english and hungarian web UI for the full features set of the [backend application](https://github.com/maidics/gym-pass-handling-platform-backend) using TypeScript and React. Works in demo mode only.

**Find hungarian thesis presentation and other docs [here](https://github.com/maidics/gym-pass-handling-platform-backend/tree/main/docs).**

---

## Features
- Built-in ticketing tool - `Request` system:
  - Open `Request` as a `GymAdministrator`, `PendingGymEmployee` or as a `User`
  - Manage the requests as an `AppAdmin`. E.g: accepting a `GymCreation` type `Request` creates the `Gym` automatically and assigns the `Request` creator to the `GymAdministrator` role
- Register a `PendingGymEmployee` account to open a `Request` to register your own or just register a regular `User` account
- Onboard your created gym with [Stripe](https://stripe.com/)
- Manage your `Gym` as a `GymAdministrator`
- Create and manage tickets and passes to your own `Gym` as a `GymAdministrator`
- Purchase passes through [Stripe](https://stripe.com/) as a `User`
- Use your passes as a `User` by showing the pass' QR code to a `GymStaff` or `GymAdmin`
- Receive feedback about the scanned passes as gym personnel and assigns keys to their gym session

---

## Technologies
- [React](https://react.dev/) - frontend library
- [Stripe](https://stripe.com/) - to handle payments
- [Vite](https://vite.dev/) - development and build tool
- [Axios](https://axios.rest/) - fetching and error handling of backend API
- [Tanstack React Query](https://www.npmjs.com/package/@tanstack/react-query) - API response caching
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - styling
- [Lucide React](https://www.npmjs.com/package/lucide-react) - icon components
- [Sonner](https://www.npmjs.com/package/sonner) - toast components
- [Microsoft Fetch Event Source](https://www.npmjs.com/package/@microsoft/fetch-event-source) - for real time notifications

---

## Testing

Features are verified manually due to the scale and time constraint of this thesis work.

---

## Run the app

- App requires node version >= 20
- To install dependencies: npm install
- To run the app: npm run dev

### Payment features
- **Payment features require Stripe publishable test key** to be inserted in .env (pk_test_... from: [StripeDashboard](https://dashboard.stripe.com/apikeys))

---

**All rights reserved. This code is provided for viewing purposes only. No permission is granted to copy, modify, or distribute without express written consent.**
