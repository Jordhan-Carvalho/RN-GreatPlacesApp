import * as FileSystem from "expo-file-system";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";
import { insertPlace, fetchPlaces } from "../helpers/db";

export const addPlace = (title, image) => async dispatch => {
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
      "Dummy address",
      15.6,
      12.3
    );
    console.log(dbResult);
    dispatch({
      type: ADD_PLACE,
      placeData: { id: dbResult.insertId, title, image: newPath }
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
