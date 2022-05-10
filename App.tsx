import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  SafeAreaView,
  Pressable,
} from "react-native";

import * as secrets from "./secrets.json";

export type Animal = {
  name: string;
  image_url: string;
  description: string;
  id: number;
  species_id: number;
};

export default function App() {
  const [token, setToken] = useState(null);
  const [fetchedAnimals, setFetchedAnimals] = useState<Array<Animal>>([]);

  const [selectedFilter, setFilter] = useState("");

  useEffect(() => {
    if (token === null) {
      getToken();
    }
  }, []);

  useEffect(() => {
    if (token !== null) {
      getAnimals();
    }
  }, [token]);

  const getToken = async () => {
    const { data } = await axios.post(secrets.loginUrl, {
      email: secrets.email,
      password: secrets.password,
    });
    setToken(data.token);
  };

  let config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const getAnimals = async () => {
    const { data } = await axios.get(secrets.getPetsUrl, config);
    setFetchedAnimals(data);
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable style={styles.animalContainer}>
        {item.image_url && (
          <Image
            style={styles.image}
            source={{
              uri: item.image_url,
            }}
          />
        )}
        <View style={styles.textContainer}>
          <Text>{item.name}</Text>
          <Text>
            {item.species_id == 1
              ? "Dog"
              : item.species_id == 2
              ? "Cat"
              : item.species_id}
          </Text>
          <Text>{item.description}</Text>
          {item.id === 1680 && (
            <View>
              <Text>chartData</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  const filterAnimals = (animal: Animal) => {
    if (selectedFilter === "dog") {
      return animal.species_id === 1;
    } else if (selectedFilter === "cat") {
      return animal.species_id === 2;
    } else if (selectedFilter === "female") {
      return animal.description == "Weiblich";
    } else if (selectedFilter === "male") {
      return animal.description.split(",")[0] == "Männlich";
    } else {
      return true;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.list}>
        <View style={styles.flatlistHeader}>
          <Text>My pets</Text>
          <View style={styles.buttonContainer}>
            <Button onPress={() => setFilter("")} title={"show all"} />
            <Button onPress={() => setFilter("female")} title={"show female"} />
            <Button onPress={() => setFilter("male")} title={"show male"} />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={() => setFilter("")} title={"show all"} />
            <Button onPress={() => setFilter("dog")} title={"show dog"} />
            <Button onPress={() => setFilter("cat")} title={"show cat"} />
          </View>
        </View>
        <FlatList
          data={fetchedAnimals.filter((animal) => {
            return filterAnimals(animal);
          })}
          keyExtractor={(item: Animal, index) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#91ADC2",
    alignItems: "center",
    justifyContent: "center",
  },
  flatlistHeader: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonStyle: {
    width: 40,
    margin: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  list: {
    width: "100%",
    flex: 1,
  },
  animalContainer: {
    margin: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 20,
  },
});
