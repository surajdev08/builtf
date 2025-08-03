# Builtf Web App

Builtf is a web application that connects users with various service providers. Users can browse services, view provider profiles, and filter them by category and location.

---

## Features

- **Browse Services**: Users can browse a wide range of services, such as construction, labor, and more.
- **Filter Providers**: Providers can be filtered by category and location to help users find the right professional for their needs.
- **Provider Profiles**: Each provider has a detailed profile with their name, location, service type, price, and a profile image.
- **Provider Listing Page**: When a service is selected, the app displays a list of all related providers in a clean and organized manner.
- **Add/Edit Providers**: Providers can be added or edited on a separate page with the following sections:
  - **Basic Info**: Name, contact information, and service type.
  - **Address & Pricing**: Location and price of the service.
  - **Images**: Profile image and multiple work images uploaded via Cloudinary.
  - **Description & Rating**: A detailed description of the provider's services and their rating.
- **Responsive Design**: The app is built with Material UI (MUI) to ensure a seamless experience across all devices.

---

## Tech Stack

- **Frontend**: Next.js, Material UI (MUI)
- **Backend**: Firebase (Firestore for database)
- **Image Uploads**: Cloudinary

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1.  Clone the repo
    ```sh
    git clone [https://github.com/surajdev08/builtf.git](https://github.com/surajdev08/builtf.git)
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env.local` file in the root of your project and add the following environment variables:
    ```sh
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_Messaginger_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
    NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

### Running the App

```sh
npm run dev
```
