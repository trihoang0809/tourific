import { useState, useEffect } from "react";
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
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityProps, AddActivityProps } from "@/types";

const AddActivityToItinerary = ({
  currentDateUpdate,
  input,
  saveActivityId,
  isVisible,
  setIsVisible,
}: AddActivityProps) => {
  const updateQuery = (query: string) => {
    setSearchBarValue(query);
  };
  const [searchBarValue, setSearchBarValue] = useState("");
  const [filteredActivities, setFilteredActivities] = useState<ActivityProps[]>(
    [],
  );

  useEffect(() => {
    // Filter activities based on query whenever input or query changes
    const filtered = input.filter((activity) =>
      activity.name.toLowerCase().includes(searchBarValue.toLowerCase()),
    );
    setFilteredActivities(filtered);
  }, [input, searchBarValue]);

  return (
    <Modal animationType="slide" visible={isVisible}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={[styles.modalText, { paddingLeft: 15 }]}>
              What to do on {currentDateUpdate.toLocaleDateString()}?
            </Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
          </View>
          <View
            style={{
              backgroundColor: "#e9e9e9",
              padding: 20,
              height: "100%",
              flex: 1,
            }}
          >
            <SearchBar
              placeholder="Search from upvoted activities..."
              onChangeText={updateQuery}
              value={searchBarValue}
              lightTheme={true}
              round={true}
              containerStyle={{
                backgroundColor: "#e9e9e9",
                justifyContent: "space-around",
                borderTopColor: "#e9e9e9",
                borderBottomColor: "#e9e9e9",
                padding: 0,
                paddingBottom: 20,
              }}
              inputContainerStyle={{ backgroundColor: "white" }}
              inputStyle={{ backgroundColor: "white", fontSize: 16 }}
              leftIconContainerStyle={{ backgroundColor: "white" }}
            />
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity: ActivityProps) => {
                    return (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "white",
                          paddingHorizontal: 5,
                          width: "100%",
                          borderRadius: 8,
                          marginBottom: 15,
                          shadowOffset: { width: 1, height: 1 },
                          shadowColor: "#333",
                          shadowOpacity: 0.3,
                          shadowRadius: 2,
                        }}
                        key={activity.id}
                        onPress={() => {
                          console.log(
                            "current date in add activity modal, ",
                            currentDateUpdate,
                          );
                          saveActivityId(activity.id!);
                          setIsVisible(false);
                        }}
                      >
                        <View style={styles.row}>
                          <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.modalText}>
                              {activity.name}
                            </Text>
                            {/* {activity.location.address && (
                            <Text>{activity.location.address}</Text>
                          )} */}
                            {activity.location.citystate && (
                              <View
                                style={{
                                  backgroundColor: "lightblue",
                                  alignSelf: "flex-start",
                                  padding: 3,
                                  marginVertical: 5,
                                }}
                              >
                                <Text
                                  numberOfLines={1}
                                  style={{ color: "darkblue" }}
                                >
                                  {activity.location.citystate}
                                </Text>
                              </View>
                            )}
                            {activity.description && (
                              <Text numberOfLines={3}>
                                {activity.description}
                              </Text>
                            )}
                          </View>
                          <View style={{ width: 100, height: 100 }}>
                            <Image
                              source={{
                                uri: activity.image?.url
                                  ? activity.image?.url
                                  : "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MTM3Mjd8MHwxfHNlYXJjaHw1fHxUcmF2ZWx8ZW58MHx8fHwxNzE2MTczNzc1fDA&ixlib=rb-4.0.3&q=80&w=400",
                              }}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 8,
                              }}
                            />
                            <View style={styles.likeContainer}>
                              <Text style={styles.h4}>
                                {activity.netUpvotes}
                              </Text>
                              <TouchableOpacity style={styles.heartIcon}>
                                <Ionicons
                                  name={"heart"}
                                  color="red"
                                  size={18}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text style={{ fontSize: 18 }}>
                    Visit Suggestion page to upvote activities!
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddActivityToItinerary;

const styles = StyleSheet.create({
  modalText: {
    fontSize: 18,
    overflow: "hidden",
    fontWeight: "500",
  },
  h4: {
    color: "black",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 22,
  },
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
  likeContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: 5,
    borderRadius: 5,
  },
  heartIcon: {
    marginLeft: 5,
  },
});
