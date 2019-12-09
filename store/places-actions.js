import * as FileSystem from "expo-file-system";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";
import { insertPlace, fetchPlaces } from "../helpers/db";
import ENV from "../env";

export const addPlace = (title, image, location) => async dispatch => {
  // reverse geocoding for address
  const apiKey = ENV().googleApiKey;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${apiKey}`
  );

  if (!res.ok) {
    throw new Error("Something wrong with reverse geocoding");
  }

  const data = await res.json();
  if (!data.results) {
    throw new Error("Something went wrong at the resul fo geocoding");
  }

  const address = data.results[0].formatted_address;
  //save on the device
  // work like => someFolder/myimage.jpg => ['someFolder', 'myimage.jpg'] => myimage.jpg
  const fileName = image.split("/").pop();
  const newPath = FileSystem.documentDirectory + fileName;

  try {
    await FileSystem.moveAsync({
      from: image,
      to: newPath
    });
    const dbResult = await insertPlace(
      title,
      newPath,
      address,
      location.lat,
      location.lng
    );
    console.log(dbResult);
    dispatch({
      type: ADD_PLACE,
      placeData: {
        id: dbResult.insertId,
        title,
        image: newPath,
        address,
        coords: { lat: location.lat, lng: location.lng }
      }
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loadPlaces = () => async dispatch => {
  try {
    const res = await fetchPlaces();
    dispatch({ type: SET_PLACES, places: res.rows._array });
  } catch (error) {
    throw error;
  }
};
