import Geocoder from "react-native-geocoding";
import React, { useState, useEffect, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, Circle } from "react-native-maps";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import Slider from "@react-native-community/slider";
const GOOGLE_MAP_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY || "undefined";
import { LocationSearch } from "./LocationSearch";
import Geocoding from 'react-native-geocoding';

const { width, height } = Dimensions.get("window");
Geocoding.init(GOOGLE_MAP_API_KEY);

const GooglePlacesInput = () => {
  Geocoder.init(GOOGLE_MAP_API_KEY); // use a valid API key
  const [query, setQuery] = useState("");
  const [centerCircle, setCenterCircle] = useState("")
  const [coord, setCoord] = useState<{ latitude: number; longitude: number; }>({
    latitude: 37.733795,
    longitude: -122.446747,
  });
  const mapRef = useRef(null);
  const [radius, setRadius] = useState(30000);
  const handleSliderChange = (value: number) => {
    setRadius(value);
  };

  useEffect(() => {
    if (query !== "") {
      Geocoder.from(query)
        .then((json) => {
          const location = json.results[0].geometry.location;
          //console.log(location);
          setCoord({ latitude: location.lat, longitude: location.lng });
        })
        .catch((error) => console.warn(error));
    }
  }, [query]);

  return (
    <View>
      <View style={styles.container}>
        <LocationSearch onLocationSelected={({ location }) => {
            setQuery(location);
        }} />
            
      </View>
      <Slider
        minimumValue={800}
        maximumValue={50000}
        //step={1}
        value={radius}
        onValueChange={handleSliderChange}
      />
      <Text>Select desired radius: {(radius * 0.000621371).toFixed(2)} miles</Text>
      { centerCircle && <Text>Current area: {centerCircle}</Text>}
      <MapView
        ref={mapRef}
        // onRegionChangeComplete={async (val) => {
        //   if (mapRef.current) {
        //     console.log(await (mapRef.current as MapView).getMapBoundaries());
        //   }
        // }}
        region={{
          latitude: coord.latitude,
          longitude: coord.longitude,
          latitudeDelta: radius / 111139 * 3.2,
          longitudeDelta: radius / 111139 * 3.2,
          // latitudeDelta: 0.03,
          // longitudeDelta: 0.03,
        }}
        style={{
          width: width - 40,
          height: width - 40,
        }}
        provider={PROVIDER_GOOGLE}
        onPress={async (e) => {
          //console.log(e.nativeEvent.coordinate);
          setCoord({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });

          const { latitude, longitude } = e.nativeEvent.coordinate;
          const response = await Geocoding.from({ latitude, longitude });

          if (response.results.length > 0) {
            const address = response.results[0].formatted_address;
            setCenterCircle(address);
            console.log(address);
          }
        }}

        
      // className="flex-1 -mt-10 z-0"
      // mapType="mutedStandard"
      >
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
    borderColor: "navy",
    borderRadius: 15,
    padding: 3, 
  },
});

export default GooglePlacesInput;
