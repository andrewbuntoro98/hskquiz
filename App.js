import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HSK1_WORDS from "./assets/HSK1.json";
import HSK2_WORDS from "./assets/HSK2.json";
import HSK3_WORDS from "./assets/HSK3.json";
import HSK4_WORDS from "./assets/HSK4.json";
import HSK5_WORDS from "./assets/HSK5.json";
import HSK6_WORDS from "./assets/HSK1.json";

export default function App() {
  //function list
  const [HSK1wordList, setHSK1wordList] = useState([]);
  const [HSK2wordList, setHSK2wordList] = useState([]);
  const [HSK3wordList, setHSK3wordList] = useState([]);
  const [HSK4wordList, setHSK4wordList] = useState([]);
  const [HSK5wordList, setHSK5wordList] = useState([]);
  const [HSK6wordList, setHSK6wordList] = useState([]);
  const [currentWord, setCurrentWord] = useState({});
  const [choices, setChoices] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [viewMode, setViewMode] = useState(1);
  const [log, setLog] = useState(1);
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    // fetch word list from local storage
    const HSK1wordList = HSK1_WORDS;
    const HSK2wordList = HSK2_WORDS;
    const HSK3wordList = HSK3_WORDS;
    const HSK4wordList = HSK4_WORDS;
    const HSK5wordList = HSK5_WORDS;
    const HSK6wordList = HSK6_WORDS;
    setHSK1wordList(HSK1_WORDS);
    setHSK2wordList(HSK2_WORDS);
    setHSK3wordList(HSK3_WORDS);
    setHSK4wordList(HSK4_WORDS);
    setHSK5wordList(HSK5_WORDS);
    setHSK6wordList(HSK6_WORDS);
  }, []);

  useEffect(() => {
    // set up quiz for current word
    if (HSK6wordList.length > 0) {
      const newHSK6wordList = [...HSK6wordList];
      let newCurrentWord = {};
      let newChoices = [];

      // select new word that hasn't been answered correctly on first try
      // while (
      //   newHSK6wordList.length > 0 &&
      //   (!newCurrentWord.hanzi ||
      //     newCurrentWord.pinyin ||
      //     newCurrentWord.guessedCorrectly)
      // ) {
      //   const randomIndex = Math.floor(Math.random() * newHSK6wordList.length);
      //   newCurrentWord = newHSK6wordList[randomIndex];
      //   newHSK6wordList.splice(randomIndex, 1);
      //   setLog(newHSK6wordList.length);
      // }
      while (
        newHSK6wordList.length > 0 &&
        (!newCurrentWord.hanzi ||
          newCurrentWord.pinyin ||
          newCurrentWord.guessedCorrectly)
      ) {
        const randomIndex = Math.floor(Math.random() * newHSK6wordList.length);
        newCurrentWord = newHSK6wordList[randomIndex];
        newHSK6wordList.splice(randomIndex, 1);
        setLog(newHSK6wordList.length);
      }

      // if all words have been guessed correctly on first try, start over
      if (!newCurrentWord.hanzi) {
        setHSK6wordList(
          HSK6wordList.map((word) => {
            word.guessedCorrectly != true;
            return word;
          })
        );
        newCurrentWord = HSK6wordList[0];
        setCorrectCount(0);
      }

      // set up choices for current word
      newChoices = [newCurrentWord];
      while (newChoices.length < 4) {
        const randomIndex = Math.floor(Math.random() * HSK6wordList.length);
        const newChoice = HSK6wordList[randomIndex];
        if (newChoices.indexOf(newChoice) === -1) {
          newChoices.push(newChoice);
        }
      }
      shuffleArray(newChoices);
      setCurrentWord(newCurrentWord);
      setChoices(newChoices);
    }
  }, [correctCount, HSK6wordList, incorrectCount]);

  const handleAnswer = (selectedWord) => {
    if (selectedWord.hanzi === currentWord.hanzi) {
      // answer is correct
      setViewMode(3);
    } else {
      // answer is incorrect
      setViewMode(2);
    }
  };

  const handleCorrectNext = () => {
    setCorrectCount(correctCount + 1);
    setCurrentWord({ ...currentWord, guessedCorrectly: true });
    setChoices([]);
    setViewMode(1);
  };

  const handleIncorrectNext = () => {
    setViewMode(1);
    setIncorrectCount(incorrectCount + 1);
    setChoices([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <MaterialCommunityIcons
            name="language-chinese"
            size={48}
            color="white"
          /> */}
          <Text style={styles.title}>HSK 1 Hanzi Quiz</Text>
        </View>
        <View style={styles.content}>
          <Text>Made by Andrew Buntoro</Text>
          <Text style={styles.subtitle}>Choose the correct Hanzi.</Text>
          <Text style={styles.pinyin}>{currentWord.pinyin}</Text>
          {viewMode == 1 && (
            <View style={styles.choiceContainer}>
              {choices.map((choice) => (
                <View style={styles.choiceButtonContainer}>
                  <Button
                    key={choice.hanzi}
                    title={choice.hanzi}
                    onPress={() => handleAnswer(choice)}
                  />
                </View>
              ))}
            </View>
          )}
          {viewMode == 2 && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                Incorrect. The correct answer is {currentWord.hanzi}.
              </Text>
              <Button title="Next" onPress={handleIncorrectNext} />
            </View>
          )}
          {viewMode == 3 && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Correct!!</Text>
              <Text style={styles.resultText}>
                {currentWord.hanzi} : {currentWord.meaning}.
              </Text>
              <Button title="Next" onPress={handleCorrectNext} />
            </View>
          )}
        </View>
        <View style={styles.footer}>
          <Text style={styles.progressText}>
            Learned = {correctCount} / {HSK6_WORDS.length}
          </Text>
          {/* <MaterialCommunityIcons
            name="book-open-outline"
            size={24}
            color="white"
          /> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingTop: Platform.OS === "android" ? 25 : 0, // additional padding for Android
  },
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    backgroundColor: "#2E2E2E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 10,
  },
  subtitle: {
    marginTop: 250,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  pinyin: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  choiceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  choiceButtonContainer: {
    marginVertical: 10,
    width: "45%",
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
  },
  resultContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  footer: {
    backgroundColor: "#2E2E2E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  progressText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
