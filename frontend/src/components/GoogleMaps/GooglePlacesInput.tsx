import Geocoder from "react-native-geocoding";
import React, { useState, useEffect, useRef } from "react";
import MapView, { Circle } from "react-native-maps";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { GooglePlacesInputProps } from "@/types";

// env
const GOOGLE_MAP_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY || "undefined";
import { LocationSearch } from "./LocationSearch";

const { width } = Dimensions.get("window");

const GooglePlacesInput = ({
  onLocationSelect,
  value,
}: GooglePlacesInputProps) => {
  Geocoder.init(GOOGLE_MAP_API_KEY); // use a valid API key
  const [query, setQuery] = useState({ address: "", citystate: "" });
  const [centerCircle, setCenterCircle] = useState("");
  const [coord, setCoord] = useState<{ latitude: number; longitude: number }>({
    latitude: 37.733795,
    longitude: -122.446747,
  });
  const mapRef = useRef(null);
  const [radius, setRadius] = useState(30000);
  const [sliderTimeoutId, setSliderTimeoutId] = useState<NodeJS.Timeout | null>(
    null,
  );
  const handleSliderChange = (value: number) => {
    if (sliderTimeoutId) clearTimeout(sliderTimeoutId);
    const newTimeoutId = setTimeout(() => {
      setRadius(value);
    }, 100);
    setSliderTimeoutId(newTimeoutId);
  };
  const [mapData, setMapData] = useState({
    address: query.address,
    citystate: query.citystate,
    latitude: coord.latitude,
    longitude: coord.longitude,
    radius: radius,
  });

  console.log("query useefect", query);

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

  console.log("mapData 2", mapData);
  console.log("coord 2", coord);

  return (
    <View>
      <View>
        <LocationSearch
          onLocationSelected={(location) => {
            setQuery({
              address: location.address,
              citystate: location.citystate,
            });
            setCenterCircle(location.address + " " + location.citystate);
          }}
          value={value}
        />
      </View>
      <Slider
        minimumValue={800}
        maximumValue={50000}
        //step={1}
        value={radius}
        onValueChange={handleSliderChange}
      />
      <Text className="font-semibold text-base">
        Current radius: {(radius * 0.000621371).toFixed(2)} miles
      </Text>
      {centerCircle && <Text>Current area: {centerCircle}</Text>}
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
          latitudeDelta: (radius / 111139) * 3.2,
          longitudeDelta: (radius / 111139) * 3.2,
        }}
        style={{
          width: width - 40,
          height: width - 40,
        }}
        onPress={async (e) => {
          setCoord({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });

          const { latitude, longitude } = e.nativeEvent.coordinate;
          const response = await Geocoder.from({ latitude, longitude });
          setQuery({
            address: "",
            citystate: response.results[0].formatted_address,
          });
          if (response.results.length > 0) {
            const address = response.results[0].formatted_address;
            setCenterCircle(address);
            setQuery({ ...query, address: address });
          }
        }}
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

export default GooglePlacesInput;
