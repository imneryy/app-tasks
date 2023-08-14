import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

export default function Home() {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState("");

  async function addTask() {
    if (newTask === "") {
      return;
    }
    const search = task.filter((task) => task === newTask);

    if (search.length != 0) {
      Alert.alert("Atenção", "Você já possue uma tarefa com esse nome.");
      return;
    }

    setTask([...task, newTask]);
    setNewTask("");
    Keyboard.dismiss();
  }

  async function removeTask(item) {
    Alert.alert(
      "Remover Tarefa",
      "Tem certeza que deseja remover esta tarefa?",
      [
        {
          text: "Cancelar",
          onPress: () => {
            return;
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => setTask(task.filter((tasks) => tasks != item)),
        },
      ],
      { cancelable: false }
    );
  }

  useEffect(() => {
    async function loadingData() {
      const task = await AsyncStorage.getItem("task");

      if (task) {
        setTask(JSON.parse(task));
      }
    }
    loadingData();
  }, []);

  useEffect(() => {
    async function saveData() {
      AsyncStorage.setItem("task", JSON.stringify(task));
    }
    saveData();
  }, [task]);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={0}
      behavior="padding"
      style={{ flex: 1 }}
      enabled={Platform.OS === "ios"}
    >
      <View style={styles.container}>
        <View style={styles.body}>
          <FlatList
            style={styles.flatlist}
            data={task}
            keyExtractor={(item) => item.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.containerView}>
                <Text style={styles.containerViewText}>{item}</Text>
                <TouchableOpacity onPress={() => removeTask(item)}>
                  <MaterialIcons
                    name="delete-forever"
                    size={25}
                    color="#F64c75"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#999"
            autoCorrect={true}
            placeholder="Adicione uma tarefa"
            maxLength={25}
            onChangeText={(text) => setNewTask(text)}
            value={newTask}
          />
          <TouchableOpacity style={styles.button} onPress={() => addTask()}>
            <Ionicons name="ios-add" size={25} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  body: {
    flex: 1,
  },
  form: {
    padding: 0,
    height: 60,
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  button: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c6cce",
    borderRadius: 4,
    marginLeft: 10,
  },
  flatlist: {
    flex: 1,
    marginTop: 5,
  },
  containerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    alignItems: "center",
    backgroundColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containerViewText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "700",
    textAlign: "center",
  },
});
