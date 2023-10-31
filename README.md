### Route Planner

---

***A React-based application that enables users to plan routes with multiple stops using the Google Maps API.***

---

### Table of Contents

1. [Project Setup](#1-project-setup)
2. [Usage](#2-usage)
3. [Styling](#3-styling)


### 1. Project Setup

This section provides an overview of how to set up the project on your local machine.

- **Prerequisites**. Ensure you have the following programs installed on your computer:
    * git
    * Node.js
    * npm

- **Clone the project repository**. In your terminal, clone the project repository using the following git command:

    git clone https://github.com/vnikola86/route-planner

- **Navigate to the project directory**. Navigate to the directory of the cloned route-planner repository:

    cd route-planner

- **Install the required dependencies**. In the route-planner directory, run the following command:

    npm install

- **Setting up the REACT_APP_GOOGLE_MAPS_API_KEY**. For the web application to work properly, you'll need to store your Google Maps Platform API key locally in the project. Follow these steps to set up the key:
    - Visit the Google Cloud Platform Console at https://console.cloud.google.com/.
    - Obtain an API key for the Google Maps Platform.
    - Create a file named '.env.local' in the root directory of your project.
    - Add the following line to the '.env.local' file:
        REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
    - Replace YOUR_API_KEY with the API key you obtained from the Google Cloud Platform Console.
    - Save the '.env.local' file.


### 2. Usage

This section provides instructions on how to run the Route Planner application and explains its main features and functionalities.

- **Run the Application**. To start the Route Planner, navigate to the route-planner directory and run the following command:

    npm start

    This will start the application in development mode, and you can access it in your web browser by opening http://localhost:3000.



- **Main features and functionalities**.

    When the page loads, a Google Map is displayed, showing your current location if geolocation is enabled in your browser.

    Use the input fields for "Origin" and "Destination" to define your starting and ending points.
    Click the "Add Stop" button to include additional stops along your route.
    Autocomplete ensures you enter valid addresses for each location.

    To view the route connecting all locations, click the "Show Route" button.

    The application uses the Google Maps Directions API to determine the optimal route between your selected locations, which is then displayed on the map.

    To remove a specific stop point, click the "X" button next to the stop point. The map will then display the updated route.

    To clear the entire route, click the "Clear" button.

    To return to your current location, click the compass icon. If geolocation is not enabled in your browser, the default location will be displayed. You can configure the default location in the code.


### 3. Styling

This section provides an overview of the project's styling approach, which uses Tailwind CSS to achieve efficient and consistent design.

  Note: Tailwind CSS dependencies are installed automatically when you run 'npm install', as described in the Project Setup section. You do not need to install them separately. However to manually install, configure and intergrate Tailwind CSS, key guidelines are included.

  - **Installation**. To set up Tailwind CSS, follow these steps:

    - Install Tailwind CSS via npm:

        npm install -D tailwindcss

    - Generate your `tailwind.config.js` file:

        npx tailwindcss init

  - **Template Paths Configuration**. Make sure to configure your template paths in the `tailwind.config.js` file:

    module.exports = {
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }

  - **Tailwind CSS Directives**. Add the Tailwind directives to your `./src/index.css` file:

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

  - **Official Tailwind CSS documentation**:
    https://tailwindcss.com/docs/installation
