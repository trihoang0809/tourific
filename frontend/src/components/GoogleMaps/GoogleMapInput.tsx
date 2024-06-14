import Geocoder from "react-native-geocoding";
import React, { useState, useEffect, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { GoogleMapInputProps } from "@/types";

// env
const GOOGLE_MAP_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY || "undefined";
import { LocationSearch } from "./LocationSearch";
import Geocoding from "react-native-geocoding";

Geocoding.init(GOOGLE_MAP_API_KEY);

const GoogleMapInput = ({
  onLocationSelect,
  value,
  location,
}: GoogleMapInputProps) => {
  Geocoder.init(GOOGLE_MAP_API_KEY); // use a valid API key
  const [query, setQuery] = useState({
    address: "",
    citystate: "",
  });
  const [coord, setCoord] = useState<{ latitude: number; longitude: number }>({
    latitude: location.latitude,
    longitude: location.longitude,
  });
  const mapRef = useRef(null);
  const radius = 500;
  const [mapData, setMapData] = useState({
    address: query.address,
    citystate: query.citystate,
    latitude: coord.latitude,
    longitude: coord.longitude,
    radius: radius,
  });

  useEffect(() => {
    if (query.address !== "" && query.citystate !== "") {
      Geocoder.from(query.address + " " + query.citystate)
        .then((json) => {
          const location = json.results[0].geometry.location;
          setCoord({ latitude: location.lat, longitude: location.lng });
        })
        .catch((error) => console.warn(error));
    }
  }, [query]);

  useEffect(() => {
    try {
      setMapData({
        address: query.address,
        citystate: query.citystate,
        latitude: coord.latitude,
        longitude: coord.longitude,
        radius: radius,
      });
      onLocationSelect(mapData);
    } catch (error) {
      console.log("Error get location", error);
    }
  }, [query, coord, radius]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <LocationSearch
          onLocationSelected={(location) => {
            setQuery({
              address: location.address,
              citystate: location.citystate,
            });
          }}
          value={value}
        />
      </View>

      <MapView
        ref={mapRef}
        region={{
          latitude: coord.latitude,
          longitude: coord.longitude,
          latitudeDelta: (radius / 111139) * 3.2,
          longitudeDelta: (radius / 111139) * 3.2,
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
          setQuery({
            address: "",
            citystate: response.results[0].formatted_address,
          });

          console.log(response);

          if (response.results.length > 0) {
            const address = response.results[0].formatted_address;
            setQuery({ ...query, address: address });
          }
        }}
      >
        <Marker
          coordinate={{ latitude: coord.latitude, longitude: coord.longitude }}
          title={
            mapData.address + " " + mapData.citystate === " "
              ? location.address + " " + location.citystate
              : mapData.address + " " + mapData.citystate
          }
          description={""}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});

export default GoogleMapInput;
