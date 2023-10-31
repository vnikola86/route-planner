import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useEffect, useRef, useState } from 'react'
import { FaCompass } from 'react-icons/fa'
import { GOOGLE_MAPS_LIBRARIES } from './config';
import './index.css';

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  })
  
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const [stopPoints, setStopPoints] = useState([
    { name: 'Origin', location: null },
    { name: 'Destination', location: null },
  ]);

  const [stopPointCount, setStopPointCount] = useState(2);
  const [selectedPlaces, setSelectedPlaces] = useState([null, null]);
  const [validationMessages, setValidationMessages] = useState([]);

  const [isDeleteButtonClicked, setIsDeleteButtonClicked] = useState([]);
  const [isRouteShown, setIsRouteShown] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const defaultCenter = { lat: 42.4304, lng: 19.2594 };

  const origin = document.getElementById(`origin`);
  const destination = document.getElementById(`destination`);
  
  const stopPointAutocompleteRefs = useRef([]);

  useEffect(() => {
    // Check if the Geolocation API is available in the browser
    if ('geolocation' in navigator) {
      // Request the client's location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
          // If there's an error, use the default center (Podgorica)
          setUserLocation(null);
        }
      );
    } else {
      console.error('Geolocation API is not available in this browser');
      // Use the default center (Podgorica)
      setUserLocation(null);
    }
  }, []);


  // Recalculate the route when stop point is deleted
  useEffect(() => {
    if (isDeleteButtonClicked.includes(true) && isRouteShown) {
      handleCalculateRoute();
    }
    
  }, [isDeleteButtonClicked]);
  
  
  
  // Use the user's location if available, otherwise use the default center
  const center = userLocation || defaultCenter;

  if (!isLoaded) {
    return <div className='m-4'>Loading...</div>;
  }

  const handleAddStopPoint = () => {

    const newSelectedPlace = null;
    setSelectedPlaces([...selectedPlaces, newSelectedPlace]);

    const newStopPoint = {
      id: stopPointCount,
      location: null,
    };

    setStopPoints([...stopPoints, newStopPoint]);
    setStopPointCount(stopPointCount + 1);

  };

  const handlePlaceChanged = (index) => {
    const place = stopPointAutocompleteRefs.current[index].getPlace();

    if (place && place.formatted_address) {

      // Update the selectedPlaces state with a new place
      const updatedSelectedPlaces = [...selectedPlaces];
      updatedSelectedPlaces[index] = place.formatted_address;
      setSelectedPlaces(updatedSelectedPlaces);      

      // Update the stopPoints state with a new stopPoint address
      const updatedStopPoints = [...stopPoints];
      updatedStopPoints[index] = { location: place.formatted_address };
      setStopPoints(updatedStopPoints);

      // Update the validation message when a place is selected
      const updatedValidationMessages = [...validationMessages];
      updatedValidationMessages[index] = '';
      setValidationMessages(updatedValidationMessages);

    }
  };

  const handleInputChange = (index) => {
    return () => {
      setSelectedPlaces((prevSelectedPlaces) => {
        const newSelectedPlaces = [...prevSelectedPlaces];
        newSelectedPlaces[index] = null;
        return newSelectedPlaces;
      });
    };
  }

  const handleCalculateRoute = async () => {
  // Check if any of selected places are null
  if (selectedPlaces.some((place) => place === null)) {

    const newValidationMessages = selectedPlaces.map((place) =>
      place === null ? 'Please select a location.' : ''
    );
    setValidationMessages(newValidationMessages);
    return;
  }

  // When all locations are selected, proceed with calculation
  const directionsService = new window.google.maps.DirectionsService();
  const directionsRequest = {
    origin: stopPoints[0].location,
    destination: stopPoints[1].location,
    waypoints: stopPoints.slice(2).map((stopPoint) => ({
      location: stopPoint.location,
      stopover: true,
    })),
    travelMode: window.google.maps.TravelMode.DRIVING,
  };

  const directionsResponse = await directionsService.route(directionsRequest);
  setDirectionsResponse(directionsResponse);

  setIsDeleteButtonClicked([]);
  setIsRouteShown(true);
  };


  const calculateTotalDistance = (legs) => {

    if (!legs) return '';

    let totalDistance = 0;

    legs.forEach((leg) => {
      totalDistance += leg.distance.value;
    });
  
    // Convert meters to km
    return (totalDistance / 1000).toFixed(2) + ' km';

  };
  
  const calculateTotalDuration = (legs) => {
    if (!legs) return '';

    let totalDuration = 0;
    legs.forEach((leg) => {
      totalDuration += leg.duration.value;
    });
  
    // Convert seconds to human-readable format
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    return `${hours} hrs ${minutes} mins`;
  };


  const handleDeleteStopPoint = (index) => {

    const updatedSelectedPlaces = selectedPlaces.filter((_, i) => i !== index);
    setSelectedPlaces(updatedSelectedPlaces);

    const updatedStopPoints = stopPoints.filter((_, i) => i !== index);
    setStopPoints(updatedStopPoints);

    const updatedValidationMessages = validationMessages.filter((_, i) => i !== index);
    setValidationMessages(updatedValidationMessages);

    // Update the isDeleteButtonClicked[] state, which is the useEffect dependency to recalculate the route
    const updatedDeleteButtonClicked = [...isDeleteButtonClicked];
    updatedDeleteButtonClicked[index] = true;
    setIsDeleteButtonClicked(updatedDeleteButtonClicked);
};


  const handleClearForm = () => {
    setDirectionsResponse(null);
    setStopPoints([
      { name: 'Origin', location: null },
      { name: 'Destination', location: null },
    ]);
    setSelectedPlaces([null, null]);
    setValidationMessages([]);
    setStopPointCount(2);
    setIsRouteShown(false);
    
    // Clear the Autocomplete and Input values
    stopPointAutocompleteRefs.current.forEach((autocompleteRef) => {
      if (autocompleteRef) {
        
        if (origin) {
          origin.value = '';
        }
        
        if (destination) {
          destination.value = '';
        }
        
      }
    });
  };
  
  return (
    <div className='container-custom'>
      <div className='absolute left-0 top-0 h-full w-full z-10'>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      <div className='navigation-custom p-4 rounded-lg m-4 bg-violet-200 shadow-md z-20'>
        <div className='h-stack flex-start spacing-2'>
        <div className='flex-grow-1'>
          <Autocomplete
            onLoad={(autocomplete) => {
              stopPointAutocompleteRefs.current[0] = autocomplete;
            }}
            onPlaceChanged={() => handlePlaceChanged(0)}
            >
            <input
              type='text'
              id='origin'
              placeholder='Origin'
              className='bg-white mt-4 px-1 py-2 w-full border-2 border-violet-200 rounded focus:border-violet-400 focus:outline-none'
              defaultValue={stopPoints[0]?.location}
              onChange={handleInputChange(0)}
            />
          </Autocomplete>
          <div className='text-red-500'>{validationMessages[0]}</div>
        </div>
        <div className='flex-grow-1'>
          <Autocomplete
            onLoad={(autocomplete) => {
              stopPointAutocompleteRefs.current[1] = autocomplete;
            }}
            onPlaceChanged={() => handlePlaceChanged(1)}
          >
            <input
              type='text'
              id='destination'
              placeholder='Destination'
              className='bg-white mt-4 px-1 py-2 w-full border-2 border-violet-200 rounded focus:border-violet-400 focus:outline-none'
              defaultValue={stopPoints[1]?.location}
              onChange={handleInputChange(1)}
            />
          </Autocomplete>
          <div className='text-red-500'>{validationMessages[1]}</div>
        </div>
      </div>
          <div className='mt-4 flex flex-wrap'>
            <button
              onClick={handleCalculateRoute}
              className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 mr-2 mb-2 h-full rounded'
            >
              Show Route
            </button>
            <button
            onClick={handleClearForm}
              className='bg-green-400 hover:bg-green-500 text-white font-medium py-3 px-4 mb-2 h-full rounded'
            >
              Clear
            </button>
          </div>
          <div className='mt-4'>
            {stopPoints.length > 2 && (
              <p className='font-bold'>Stop points:</p>
            )}
              <ul className='list-none pb-2 pl-0'>
              {stopPoints.slice(2).map((stopPoint, index) => (
                  <li key={stopPoint.location+index} className='mb-2'>
                  <div className='flex flex-wrap space-around'>
                    <div className='w-4/5 my-1 mr-1'>
                      <Autocomplete
                        className='w-full'
                        onLoad={(autocomplete) => {
                          stopPointAutocompleteRefs.current[index + 2] = autocomplete;
                        }}
                        onPlaceChanged={() => handlePlaceChanged(index + 2)}
                      >
                        <input
                          type='text'
                          placeholder={`Stop point #${index+1}`}
                          className='bg-white px-1 py-2 w-full border-2 border-violet-200 rounded focus:border-violet-400 focus:outline-none'
                          defaultValue={stopPoint.location}
                          onChange={handleInputChange(index + 2)}
                        />
                      </Autocomplete>
                    </div> 
                    <button
                      onClick={() => handleDeleteStopPoint(index + 2)}
                      className='bg-red-400 hover:bg-red-500 text-white font-medium py-2 px-3 my-1 rounded focus:outline-none focus:ring-2 focus:ring-red-400 h-full'
                    >
                      X
                    </button>
                  </div>
                  <div className='text-red-500'>{validationMessages[index + 2]}</div>
                </li>
              ))}
              </ul>
            {directionsResponse && directionsResponse.routes.length > 0 ? (
            <div className='mb-2 space-y-2'>
            <div className='justify-start flex flex-wrap space-y-1 text-gray-600'>
                <p className='flex flex-wrap space-x-1'>
                  <span className='font-bold'>Distance: </span><span>{calculateTotalDistance(directionsResponse.routes[0].legs)}</span>
                </p>

            </div>
            <div className='justify-start flex flex-wrap space-y-1 text-gray-600'>
                <p className='flex flex-wrap space-x-1'>
                  <span className='font-bold'>Duration: </span><span>{calculateTotalDuration(directionsResponse.routes[0].legs)}</span>
                </p>
            </div>
            </div>
            ) : null }
            <div className='flex flex-wrap justify-between'>
              <button
                className='bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 my-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500'
                type='button'
                onClick={handleAddStopPoint}
                >
                  Add stop
              </button>
              <button
                type='button'
                className='text-purple-600 hover:text-purple-700 my-2 mr-2'
                onClick={() => {
                  map.panTo(center);
                  map.setZoom(15);
                }}
              >
                <FaCompass className='text-5xl' />
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}

export default App;