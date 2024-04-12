import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Geocoder from "react-native-geocoding";
import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";
import { StyleSheet, View, ViewStyle, Dimensions, Text } from "react-native";
import Slider from "@react-native-community/slider";
const GOOGLE_MAP_API_KEY = "";

const { width, height } = Dimensions.get("window");

const GooglePlacesInput = () => {
  Geocoder.init(GOOGLE_MAP_API_KEY); // use a valid API key
  console.log("key", GOOGLE_MAP_API_KEY)
  const [query, setQuery] = useState("");
  const [coord, setCoord] = useState<{ latitude: number; longitude: number }>({
    latitude: 0,
    longitude: 0,
  });
  const mapRef = useRef(null);
  const [radius, setRadius] = useState(1000);
  const handleSliderChange = (value: number) => {
    setRadius(value);
  };

  useEffect(() => {
    if (query !== "") {
      Geocoder.from(query)
        .then((json) => {
          const location = json.results[0].geometry.location;
          console.log(location);
          setCoord({ latitude: location.lat, longitude: location.lng });
        })
        .catch((error) => console.warn(error));
    }
  }, [query]);

  return (
    <View>
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          placeholder="Search the center location"
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log("press")
            console.log("data: ", data, "details: ", details);
            setQuery(data.description);
          }}
          keepResultsAfterBlur={true}
          query={{
            key: GOOGLE_MAP_API_KEY,
            language: "en",
          }}
        />
      </View>
      <Slider
        minimumValue={800}
        maximumValue={50000}
        //step={1}
        value={radius}
        onValueChange={handleSliderChange}
        />
      <Text>Current radius: {(radius * 0.000621371).toFixed(2)} miles</Text>
      <MapView
        ref = {mapRef}
        onRegionChangeComplete={async (val) => {
          if (mapRef.current) {
            console.log(await (mapRef.current as MapView).getMapBoundaries());
          }
        }}
        region={{
          latitude: coord.latitude,
          longitude: coord.longitude,
          latitudeDelta: radius / 111139 * 2,
          longitudeDelta: radius / 111139 * 2,
          // latitudeDelta: 0.03,
          // longitudeDelta: 0.03,
        }}
        style={{
          width: width-40,
          height: width-40,
        }}
        provider={PROVIDER_GOOGLE}
        onPress={(e) => {
          console.log(e.nativeEvent.coordinate);
          setCoord({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });
        }}
        // className="flex-1 -mt-10 z-0"
        // mapType="mutedStandard"
      >
        <Marker
        coordinate={{
          latitude: coord.latitude,
          longitude: coord.longitude,
        }}
        // title={"Title"}
        // description={"Description"}
        // identifier="origin"
        pinColor="#00CCBB"
        />
        <Circle
          center={{
            latitude: coord.latitude,
            longitude: coord.longitude,
          }}
          radius={radius}
          strokeColor="rgba(255, 0, 0, 0.8)"
          fillColor="rgba(255, 0, 0, 0.2)"
        ></Circle>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    margin: 10,
  },
});

export default GooglePlacesInput;
