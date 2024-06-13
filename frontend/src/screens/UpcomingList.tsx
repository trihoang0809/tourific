import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { useState, useEffect } from "react";
import { TripCard } from "@/components/TripCard/TripCard";
import { Trip } from "../types";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getRecentTrips } from "@/utils";

const onPressCategory = () => {
  console.log("You pressed on this category");
  router.replace("/");
};

export interface listprops {
  isUpcoming: boolean;
}

export const ListFilteredCards = ({ isUpcoming }: listprops) => {
  const [upcomingTrips, setUpcoming] = useState<Trip[]>([]);
  const [filterTrips, setFilterTrips] = useState<Trip[]>([]);
  const [userInput, setUserInput] = useState("");
  const serverUrl = process.env.EXPO_PUBLIC_HOST_URL;
  const windowWidth = Dimensions.get("window").width;
  const tripCardWidth = windowWidth - windowWidth * 0.12;
  const tripCardHeight = 280;

  //Fetching data
  useEffect(() => {
    const getData = async () => {
      try {
        const link = isUpcoming
          ? `http://${serverUrl}:3000/trips?upcoming=true`
          : `http://${serverUrl}:3000/trips?ongoing=true`;
        const upcoming = await fetch(link);
        let data = await upcoming.json();
        setUpcoming(getRecentTrips(data));
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  //Search Bar algorithm
  let thresholdName = 0;
  let thresholdLocation = 0;
  const generate_ngrams = (text: String, n: number = 2) => {
    let ngrams = [];
    for (let i = 0; i < text.length - n + 1; ++i) {
      ngrams.push(text.slice(i, i + n));
    }
    return ngrams;
  };

  const calculate_ngrams_score = (
    text1: String,
    text2: String,
    n: number = 2,
  ) => {
    let text1_ngrams = new Set(generate_ngrams(text1, n));
    let text2_ngrams = new Set(generate_ngrams(text2, n));
    let intersection = new Set();
    let union = new Set(text2_ngrams);

    for (let x of text1_ngrams)
      if (text2_ngrams.has(x)) intersection.add(x);
      else union.add(x);
    console.log(text1);
    console.log(text2);
    console.log(intersection.size);
    return intersection.size / union.size;
  };

  //calculate levenshtein distance
  const levenshtein_distance = (word1: string, word2: string): number => {
    let dp = [];
    let deleteO: number = 1;
    let insertO: number = 1;
    let replaceO: number = 1;

    if (word1.length === 0 && word2.length > 0) return word2.length;

    if (word2.length === 0 && word1.length > 0) return word1.length;

    if (word1.length === 0 && word2.length === 0) return 0;

    for (let i = 0; i <= word1.length; ++i) {
      dp.push([]);
      for (let j = 0; j <= word2.length; ++j) dp[i].push(0);
    }

    for (let i = 0; i <= word1.length; ++i) {
      for (let j = 0; j <= word2.length; ++j) {
        if (i === 0) dp[i][j] = j;
        else if (j === 0) dp[i][j] = i;
        else if (word1[i - 1] === word2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          // Delete Operation
          deleteO = dp[i][j - 1] + 1;

          //Insert Operation
          insertO = dp[i - 1][j] + 1;

          //Replace Operation
          replaceO = dp[i - 1][j - 1] + 1;

          dp[i][j] = Math.min(deleteO, Math.min(insertO, replaceO));
        }
      }
    }

    return dp[word1.length][word2.length];
  };

  //Dynamic threshold
  const setThreshold = (text: String) => {
    if (text.length < 50) return 0.25;
    else if (text.length >= 50 && text.length < 100) return 0.5;
    else return 0.7;
  };

  //Combined Result
  const combinedScore = (
    user_input: String,
    data_string: String,
    n: number = 2,
  ) => {
    let ngram = calculate_ngrams_score(
      user_input.toUpperCase(),
      data_string.toUpperCase(),
      n,
    );
    let levDistance = levenshtein_distance(
      String(user_input).toUpperCase(),
      String(data_string).toUpperCase(),
    );
    levDistance = 1 / (1 + levDistance); // Normalize Levenshtein distance to similarity
    let combined_score = (ngram + levDistance) / 2;
    // let combined_score = ngram;
    return combined_score;
  };

  //Seperate word
  const similarity_score = (user_input: String, data: String) => {
    let word1 = user_input.split(" ");
    let word2 = data.split(" ");
    let score = 0;

    for (let i = 0; i < word1.length; ++i) {
      let wordScore = 0;
      for (let j = 0; j < word2.length; ++j) {
        wordScore = Math.max(wordScore, combinedScore(word1[i], word2[j], 2));
      }

      score += wordScore;
    }

    return score / word1.length;
  };

  //Set filter
  const filter = (input: String) => {
    let filteredTrips: Trip[] = [];
    for (let i = 0; i < upcomingTrips.length; ++i) {
      let locationName =
        upcomingTrips[i].location.address +
        " " +
        upcomingTrips[i].location.citystate;

      thresholdName = setThreshold(input);
      thresholdLocation = setThreshold(input);

      let tripNameScore = similarity_score(input, upcomingTrips[i].name);
      let tripLocationScore = similarity_score(input, locationName);

      if (
        tripNameScore >= thresholdName ||
        tripLocationScore >= thresholdLocation
      )
        filteredTrips.push(upcomingTrips[i]);
    }

    setFilterTrips(filteredTrips);
  };

  return (
    <View>
      <View style={styles.container}>
        {/* <Header isUpcoming={isUpcoming} /> */}
        <View>
          <StatusBar backgroundColor="black" />
          <View style={styles.headerConainner}>
            <View style={styles.headerTitle}>
              <TouchableWithoutFeedback onPress={onPressCategory}>
                <AntDesign name="left" size={24} color="blue" />
              </TouchableWithoutFeedback>
              <Text style={{ fontSize: 22, marginLeft: 10 }}>
                {isUpcoming ? "Upcoming Trips" : "Ongoing Trips"}
              </Text>
            </View>
            <View style={styles.userInput}>
              <MaterialIcons name="search" size={24} color="black" />
              <TextInput
                placeholder="Search"
                style={{ flex: 1, padding: 2.5, fontSize: 16 }}
                onChangeText={(text) => {
                  setUserInput(text);
                  filter(text);
                }}
                value={userInput}
              ></TextInput>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            style={{
              width: "100%",
              alignContent: "center",
              flexWrap: "wrap",
            }}
            data={userInput === "" ? upcomingTrips : filterTrips}
            renderItem={({ item }) => (
              <View style={{ marginVertical: 8 }}>
                <TripCard
                  height={tripCardHeight}
                  width={tripCardWidth}
                  trip={item}
                />
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  headerConainner: {
    width: "100%",
    padding: 10,
  },
  userInput: {
    borderWidth: 2,
    alignContent: "center",
    marginBottom: 10,
    padding: 5,
    paddingLeft: 20,
    flexDirection: "row",
    borderRadius: 20,
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
  },

  headerTitle: {
    flexDirection: "row",
    marginBottom: 18,
    alignContent: "center",
    alignItems: "center",
  },
});
