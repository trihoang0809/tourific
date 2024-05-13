import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
} from "react-native";
import { useState, useEffect } from "react";
import { useGlobalSearchParams } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Dimensions, StyleSheet } from "react-native";
import ActivityThumbnail from "@/components/ActivityThumbnail";
import { ActivityProps } from "@/types";
import { fetchActivities } from "@/utils/fetchActivities";

type CategoryKeys =
  | "Dining"
  | "Entertainment"
  | "OutdoorRecreation"
  | "Shopping"
  | "Services"
  | "Transportation"
  | "Wellness";

const categories: Record<CategoryKeys, string[]> = {
  Dining: [
    "restaurant",
    "cafe",
    "bakery",
    "bar",
    "meal_delivery",
    "meal_takeaway",
    "food",
  ],
  Entertainment: [
    "movie_theater",
    "night_club",
    "amusement_park",
    "museum",
    "library",
    "art_gallery",
    "bar",
    "tourist_attraction",
    "casino",
    "bowling_alley",
  ],
  OutdoorRecreation: [
    "park",
    "zoo",
    "campground",
    "aquarium",
    "university",
    "stadium",
    "city_hall",
    "church",
  ],
  Shopping: [
    "clothing_store",
    "shopping_mall",
    "book_store",
    "jewelry_store",
    "liquor_store",
    "home_goods_store",
    "store",
    "furniture_store",
    "supermarket",
    "pet_store",
    "florist",
    "convenience_store",
    "movie_rental",
    "hardware_store",
    "",
  ],
  Services: [
    "car_rental",
    "car_repair",
    "laundry",
    "bank",
    "accounting",
    "lawyer",
    "atm",
    "car_dealer",
    "plumber",
    "police",
    "post_office",
    "electrician",
    "electronics_store",
    "embassy",
    "fire_station",
    "storage",
  ],
  Transportation: [
    "airport",
    "transit_station",
    "train_station",
    "subway_station",
    "bus_station",
  ],
  Wellness: [
    "gym",
    "hair_care",
    "hospital",
    "spa",
    "doctor",
    "drugstore",
    "dentist",
    "pharmacy",
    "physiotherapist",
    "beauty_salon",
  ],
};

const ActivitiesScreen = () => {
  const { id } = useGlobalSearchParams();
  const [trip, setTrip] = useState({
    name: "",
    location: {
      address: "",
      citystate: "",
      latitude: 0,
      longitude: 0,
      radius: 0,
    },
    startDate: new Date(),
    endDate: new Date(),
    startHour: 0,
    startMinute: 0,
  });
  const [activities, setActivities] = useState<ActivityProps[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityProps[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getTripAndActivities = async () => {
      try {
        const response = await fetch(`http://localhost:3000/trips/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch trip");
        }
        const data = await response.json();
        setTrip(data);
        if (
          data.location.latitude &&
          data.location.longitude &&
          data.location.radius
        ) {
          const fetchedActivities = await fetchActivities(
            data.location.latitude,
            data.location.longitude,
            data.location.radius,
          );
          setActivities(fetchedActivities);
          setFilteredActivities(fetchedActivities);
          //await saveActivitiesToBackend(fetchedActivities);
        }
      } catch (error: any) {
        console.error("Error fetching trip:", error.toString());
      }
    };
    getTripAndActivities();
  }, [id]);

  const saveActivitiesToBackend = async (activities: ActivityProps[]) => {
    const promises = activities.map(async (activity) => {
      const response = await fetch(
        `http://localhost:3000/trips/${id}/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: activity.name,
            description: activity.description,
            startTime: new Date(),
            endTime: new Date(),
            location: {
              citystate: activity.location.citystate,
              latitude: activity.location.latitude,
              longitude: activity.location.longitude,
            },
            notes: activity.notes,
            netUpvotes: activity.netUpvotes,
            isOnCalendar: activity.isOnCalendar,
            category: activity.category,
            rating: activity.rating,
          }),
        },
      );
      return response.json();
    });
    try {
      //const newActivities = await Promise.all(promises);
      //setActivities(newActivities); // Update the activities state with new data including IDs
    } catch (error) {
      console.error("Error saving activities:", error);
    }
  };

  const handleSelectCategory = (category: CategoryKeys | "All") => {
    if (category === "All") {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter((activity) =>
        activity.category.some((type) => categories[category].includes(type)),
      );
      setFilteredActivities(filtered);
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text) {
      const searchedActivities = activities.filter((activity) =>
        activity.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredActivities(searchedActivities);
    } else {
      setFilteredActivities(activities);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        height: Dimensions.get("window").height,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#E6E6E6",
          borderRadius: 20,
          borderWidth: 1,
          padding: 10,
          margin: 10,
        }}
      >
        <Feather name="search" size={20} color="black" />
        <TextInput
          placeholder="Search activities..."
          value={searchTerm}
          onChangeText={handleSearch}
          style={{
            padding: 5,
            flex: 1,
            height: 30,
            fontSize: 16,
            color: "black",
          }}
        />
      </View>
      <ScrollView horizontal contentContainerStyle={styles.categoryContainer}>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => handleSelectCategory("All")}
        >
          <Ionicons name="apps-outline" size={24} color="black" />
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => handleSelectCategory("Dining")}
        >
          <Ionicons name="restaurant-outline" size={24} color="black" />
          <Text>Dining</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => handleSelectCategory("Entertainment")}
        >
          <Ionicons name="film-outline" size={24} color="black" />
          <Text>Entertainment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => handleSelectCategory("OutdoorRecreation")}
        >
          <Ionicons name="partly-sunny-outline" size={24} color="black" />
          <Text>Outdoor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => handleSelectCategory("Shopping")}
        >
          <Feather name="shopping-cart" size={24} color="black" />
          <Text>Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => handleSelectCategory("Transportation")}
        >
          <Ionicons name="bus-outline" size={24} color="black" />
          <Text>Transportation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => handleSelectCategory("Services")}
        >
          <Ionicons name="settings-outline" size={24} color="black" />
          <Text>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => handleSelectCategory("Wellness")}
        >
          <Feather name="activity" size={24} color="black" />
          <Text>Wellness</Text>
        </TouchableOpacity>
      </ScrollView>
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
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: "row",
              flexWrap: "wrap",
              padding: 5,
            }}
          >
            {filteredActivities.map(
              (activity: ActivityProps, index: number) => (
                <View key={index} style={{ width: "100%", padding: 15 }}>
                  <ActivityThumbnail activity={activity} tripId={id} />
                </View>
              ),
            )}
          </ScrollView>
        ) : (
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 18, color: "#666" }}>
              No activities found for this category.
            </Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 60,
          height: 60,
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
          /* Handle the button press */
        }}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6E6E6",
    borderRadius: 20,
    borderWidth: 1,
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
    justifyContent: "space-between",
    paddingVertical: 3,
    paddingHorizontal: 3,
  },
  categoryItem: {
    alignItems: "center",
    padding: 15,
  },
});

export default ActivitiesScreen;
