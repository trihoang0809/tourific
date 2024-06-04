import { useState, useEffect } from "react";
import { SearchBar } from "@rneui/themed";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Result {
  id: string;
  urls: {
    small: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}
interface PhotoAPIProps {
  savePhoto: (photo: string) => void;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

const screenWidth = Dimensions.get("window").width;

const PhotoAPI = ({ savePhoto, isVisible, setIsVisible }: PhotoAPIProps) => {
  const UNSPLASH_API_KEY = process.env.EXPO_PUBLIC_UNSPLASH_API_KEY;
  const [query, setQuery] = useState("scenery");
  const [searchBarValue, setSearchBarValue] = useState("");
  const updateQuery = (query: string) => {
    setQuery(query);
    setSearchBarValue(query);
  };
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchImage = async (query: string) => {
      try {
        let response = await fetch(
          `https://api.unsplash.com/search/photos?page=1&per_page=30&query=${query}&client_id=${UNSPLASH_API_KEY}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        let data = await response.json();
        console.log("First image fetched:", data.results[0]?.urls?.small);
        setResults(data.results);
      } catch (error: any) {
        console.error("Error fetching trip:", error.toString());
      }
    };
    fetchImage(query);
  }, [query]);

  return (
    <Modal animationType="slide" visible={isVisible}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <View style={styles.row}>
          <Text style={styles.text}>Set cover</Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsVisible(false)}
          >
            <Ionicons name="close" size={24} color="black" />
          </Pressable>
        </View>
        <SearchBar
          placeholder="Search an image..."
          onChangeText={updateQuery}
          value={searchBarValue}
        />
        <ScrollView>
          <View style={styles.imageContainer}>
            {results &&
              results.map((result: Result) => {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        savePhoto(result.urls.small);
                        setIsVisible(false);
                      }}
                    >
                      <Image
                        key={result.id}
                        source={{
                          uri: result.urls.small,
                        }}
                        style={styles.image}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => router.push(result.user.links.html)}
                    >
                      <Text numberOfLines={1} style={styles.author}>
                        by {result.user.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
          </View>
          <Text style={styles.note}>Search to find more results.</Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default PhotoAPI;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  closeButton: {
    position: "absolute",
    right: 10,
  },
  text: {
    textAlign: "center",
    flex: 1,
    fontWeight: "500",
    fontSize: 18,
  },
  imageContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    padding: 5,
  },
  image: {
    margin: 5,
    width: screenWidth / 2 - 15,
    height: 100,
    borderRadius: 5,
  },
  author: {
    width: screenWidth / 2 - 15,
    marginLeft: 5,
    marginBottom: 5,
    textDecorationLine: "underline",
  },
  note: {
    alignSelf: "center",
    fontSize: 15,
  },
});
