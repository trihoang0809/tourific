import Geocoder from "react-native-geocoding";
import React, { useState, useEffect, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, Circle, Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { GooglePlacesInputProps } from "@/types";

// env
const GOOGLE_MAP_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY || "undefined";
import { LocationSearch } from "./LocationSearch";
import Geocoding from 'react-native-geocoding';

const { width, height } = Dimensions.get("window");
Geocoding.init(GOOGLE_MAP_API_KEY);

const GooglePlacesInput = ({ onLocationSelect }: GooglePlacesInputProps) => {
  Geocoder.init(GOOGLE_MAP_API_KEY); // use a valid API key
  const [query, setQuery] = useState({ address: "", citystate: ""});
  const [centerCircle, setCenterCircle] = useState("");
  const [coord, setCoord] = useState<{ latitude: number; longitude: number; }>({
    latitude: 37.733795,
    longitude: -122.446747,
  });
  const mapRef = useRef(null);
  const [radius, setRadius] = useState(1400);
  const handleSliderChange = (value: number) => {
    setRadius(value);
  };
  const [mapData, setMapData] = useState({ 
    address: query.address, 
    citystate: query.citystate, 
    latitude: coord.latitude, 
    longitude: coord.longitude, 
    radius: radius 
  });

  useEffect(() => {
    if (query.address !== "" && query.citystate !== "") {
      Geocoder.from(query.address + " " + query.citystate)
        .then((json) => {
          const location = json.results[0].geometry.location;
          //console.log(location);
          setCoord({ latitude: location.lat, longitude: location.lng });
        })
        .catch((error) => console.warn(error));
    }
  }, [query]);

  useEffect(() => {
    try {
      setMapData({ address: query.address, citystate: query.citystate, latitude: coord.latitude, longitude: coord.longitude, radius: radius })
      
      onLocationSelect(mapData);
    } catch (error) {
      console.log("Error get location", error);
    }
  }, [query, coord, radius]);
  
  // console.log("----------------")
  // console.log("mapData 2", mapData.citystate);
  // console.log("coord 2", coord);

  return (
    <View>
      <View style={[styles.container, {margin: 30,}]}>
        <LocationSearch onLocationSelected={(location) => {
          setQuery( {address: location.address, citystate: location.citystate} );
        }} />

      </View>

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
          width: "100%",
          height: "100%",
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
          setQuery( {
            address: "",
            citystate: response.results[0].formatted_address,
          } );
          if (response.results.length > 0) {
            const address = response.results[0].formatted_address;
            setCenterCircle(address);
            setQuery({ ...query, address: address});
            // console.log("new address:", address, " lat long: ", { latitude, longitude });
          }
        }}


      // className="flex-1 -mt-10 z-0"
      // mapType="mutedStandard"
      >
          <Marker
            coordinate={{latitude: coord.latitude,
            longitude: coord.longitude}}
            title="Address"
            description={String(mapData.address)}
         />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: "navy",
    // borderRadius: 15,
    // padding: 3,
  },
});

export default GooglePlacesInput;
