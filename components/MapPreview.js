import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

import ENV from "../env";

const MapPreview = props => {
  let imgUrl;

  if (props.location) {
    imgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${
      props.location.lat
    },${props.location.lng}&zoom=14&size=400x200&maptype=roadmap
  &markers=color:red%7Clabel:C%7C${props.location.lat},${props.location.lng}
  &key=${ENV().googleApiKey}`;
  }

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{ ...styles.mapPreview, ...props.style }}
    >
      {props.location ? (
        <Image style={styles.mapImage} source={{ uri: imgUrl }} />
      ) : (
        props.children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapPreview: {
    justifyContent: "center",
    alignItems: "center"
  },
  mapImage: {
    width: "100%",
    height: "100%"
  }
});

export default MapPreview;
