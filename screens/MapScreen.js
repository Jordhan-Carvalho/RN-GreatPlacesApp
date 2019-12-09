import React, { useState, useEffect, useCallback } from "react";
import { Platform, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
// import { HeaderButtons, Item } from "react-navigation-header-buttons";

import Colors from "../constants/Colors";
// import HeaderButton from "../components/HeaderButton";

const MapScreen = props => {
  const initialLocation = props.navigation.getParam("initialLocation");
  const readonly = props.navigation.getParam("readonly");
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      // could show an alert
      return;
    }
    props.navigation.navigate("NewPlace", { pickedLocation: selectedLocation });
  }, [selectedLocation]);

  useEffect(() => {
    props.navigation.setParams({ saveLocation: savePickedLocationHandler });
  }, [savePickedLocationHandler]);

  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 37.78,
    longitude: initialLocation ? initialLocation.lng : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  const selectLocationHandler = event => {
    if (readonly) {
      return;
    }
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude
    });
  };

  let markerCoords;

  if (selectedLocation) {
    markerCoords = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng
    };
  }

  return (
    <MapView
      style={styles.map}
      region={mapRegion}
      onPress={selectLocationHandler}
    >
      {markerCoords && (
        <Marker title="Picked location" coordinate={markerCoords}></Marker>
      )}
    </MapView>
  );
};

MapScreen.navigationOptions = navData => {
  const saveFn = navData.navigation.getParam("saveLocation");
  const readonly = navData.navigation.getParam("readonly");
  if (readonly) {
    return {};
  }
  return {
    headerRight: (
      <TouchableOpacity style={styles.headerButton} onPress={saveFn}>
        <Text style={styles.headerButtonText}>Save</Text>
      </TouchableOpacity>
    )
  };
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  headerButton: {
    marginHorizontal: 20
  },
  headerButtonText: {
    fontSize: 16,
    color: Platform.OS === "android" ? "white" : Colors.primary
  }
});

export default MapScreen;
