import { useState } from "react";
import { SearchBar } from "@rneui/themed";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityProps, AddActivityProps } from "@/types";

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


const AddActivityToItinerary = ({
  currentDateUpdate,
  input,
  saveActivityId,
  isVisible,
  setIsVisible,
}: AddActivityProps) => {
  // May need the following for search bar
  const [query, setQuery] = useState("scenery");
  const [results, setResults] = useState<Result[]>([]);
  const updateQuery = (query: string) => {
    setQuery(query);
    setSearchBarValue(query);
  };
  const [searchBarValue, setSearchBarValue] = useState("");

  return (
    <Modal animationType="slide" visible={isVisible}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <View style={styles.row}>
          <Text style={styles.text}>{currentDateUpdate.toDateString()}</Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsVisible(false)}
          >
            <Ionicons name="close" size={24} color="black" />
          </Pressable>
        </View>
        <SearchBar
          placeholder="Search a place..."
          onChangeText={updateQuery}
          value={searchBarValue}
          lightTheme={true}
          round={true}
          containerStyle={{
            backgroundColor: "white",
            borderTopColor: "white",
            borderBottomColor: "white",
            padding: 0,
          }}
        />
        <Text style={styles.note}>Or select from existing activities</Text>
        <ScrollView>
          <View style={styles.imageContainer}>
            {input &&
              input.map((activity: ActivityProps) => {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        console.log(
                          "current date in add activity modal, ",
                          currentDateUpdate,
                        );
                        saveActivityId(activity.id);
                        setIsVisible(false);
                      }}
                    >
                      <Text numberOfLines={1} style={styles.author}>
                        {activity.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default AddActivityToItinerary;

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
  author: {
    marginLeft: 5,
    marginBottom: 5,
    textDecorationLine: "underline",
  },
  note: {
    alignSelf: "center",
    fontSize: 15,
  },
});
