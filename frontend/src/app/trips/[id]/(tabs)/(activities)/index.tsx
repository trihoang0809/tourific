import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { router, useGlobalSearchParams, usePathname, Link } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Dimensions, StyleSheet } from "react-native";
import ActivityThumbnail from "@/components/ActivityThumbnail";
import { ActivityProps } from "@/types";
import { categories } from "@/utils";
import { categoriesMap } from "@/types";
import { fetchActivities } from "@/utils/fetchAndSaveActivities";
import { useQuery } from "@tanstack/react-query";

const ActivitiesScreen = () => {
  const { id } = useGlobalSearchParams();
  const {
    data: activities,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["activities", id],
    queryFn: () => fetchActivities(id),
    // refetchInterval: 100000, // Refetch every 100 seconds
  });
  const [filteredActivities, setFilteredActivities] = useState<ActivityProps[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (activities) {
      setFilteredActivities(activities);
    }
  }, [activities]);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      const filtered = (activities || []).filter(
        (activity) => !activity.category.includes("lodging"),
      );
      setFilteredActivities(filtered);
    } else {
      const filtered = activities?.filter(
        (activity) =>
          activity.category.some((type) =>
            categories[category].includes(type),
          ) && !activity.category.includes("lodging"),
      );
      setFilteredActivities(filtered || []);
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text) {
      const searchedActivities = activities?.filter((activity) =>
        activity.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredActivities(searchedActivities || []);
    } else {
      setFilteredActivities(activities || []);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: Dimensions.get("window").height,
        backgroundColor: "white",
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
      >
        <View>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="black" />
            <TextInput
              placeholder="Search for activities..."
              value={searchTerm}
              onChangeText={handleSearch}
              style={styles.searchInput}
            />
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={styles.categoryContainer}
            showsHorizontalScrollIndicator={false}
            alwaysBounceVertical={false}
            style={{ height: 70 }}
          >
            {categoriesMap.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.key && styles.selectedCategory,
                ]}
                onPress={() => handleSelectCategory(category.key)}
              >
                {category.icon}
                <Text style={{ fontSize: 16, paddingTop: 0.5 }}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            padding: 5,
          }}
        >
          {filteredActivities.length > 0 ? (
            <ScrollView
            // contentContainerStyle={{
            //   flexGrow: 1,
            //   flexDirection: "row",
            //   flexWrap: "wrap",
            //   padding: 5,
            // }}
            >
              {filteredActivities.map((activity: ActivityProps) => (
                <View key={activity.id} style={{ width: "100%", padding: 15 }}>
                  <ActivityThumbnail activity={activity} tripId={id} />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noActivitiesView}>
              <Text style={styles.noActivitiesText}>
                No activities found for this category.
              </Text>
              <Link href={`../create`}>
                <TouchableOpacity style={styles.updateButton}>
                  <Text style={styles.updateButtonText}>
                    Create a new activity
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </ScrollView>
      </ScrollView>
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 58,
          height: 58,
          position: "absolute",
          bottom: 10,
          right: 10,
          borderRadius: 35,
          backgroundColor: "#006ee6",
          shadowOffset: { width: 1, height: 1 },
          shadowColor: "#333",
          shadowOpacity: 0.3,
          shadowRadius: 2,
        }}
        onPress={() => {
          router.push("../create");
        }}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6E6E6",
    borderRadius: 15,
    borderWidth: 0.1,
    padding: 10,
    margin: 10,
  },
  searchInput: {
    padding: 5,
    flex: 1,
    height: 30,
    fontSize: 16,
    color: "black",
  },
  categoryContainer: {
    height: 70,
    justifyContent: "space-between",
    paddingVertical: 3,
    paddingHorizontal: 3,
  },
  categoryItem: {
    height: 80,
    alignItems: "center",
    padding: 10,
  },
  selectedCategory: {
    transform: [{ translateY: -5 }],
  },
  noActivitiesView: {
    flex: 1,
    alignItems: "center",
  },
  noActivitiesText: {
    fontSize: 18,
    color: "#666",
    paddingBottom: 10,
  },
  updateButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10, // Add margin to give space between the text and button
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ActivitiesScreen;
