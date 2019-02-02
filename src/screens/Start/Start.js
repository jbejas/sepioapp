import React, { Component } from "react";
AsyncStorage;
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import { Navigation } from "react-native-navigation";
import SplashScreen from "react-native-splash-screen";
import Image from "react-native-remote-svg";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "sepio.db" });

import logo from "../../assets/images/logo.svg";
import CustomButton from "../../components/CustomButton/CustomButton";

class StartScreen extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  componentDidMount() {
    SplashScreen.hide();
    setTimeout(() => {
      console.log("Get Login Data");
      this.createDB();
      this.getLogin();
    }, 200);
  }

  errorCB(err) {
    console.log("SQL Error: " + err);
  }

  successCB() {
    console.log("SQL executed fine");
  }

  openCB() {
    console.log("Database OPENED");
  }

  createDB = () => {
    console.log("Creating DB");
    /*db.transaction(tx => {
      tx.executeSql("DROP TABLE login;", [], (tx, results) => {
        console.log("DROP TABLE LOGIN", results);
        tx.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='login';",
          [],
          (tx, results) => {
            console.log("GET TABLE NAME", results.rows.item(0).name);
          }
        );
      });
      tx.executeSql("DROP TABLE plan;", [], (tx, results) => {
        console.log("DROP TABLE PLAN", results);
      });
    });*/
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS login (ID INT NOT NULL, status VARCHAR (2) NOT NULL, uid VARCHAR (255) NULL, email VARCHAR (255) NULL, first_name VARCHAR (255) NULL, last_name VARCHAR (255) NULL, phone VARCHAR (255) NULL, employer VARCHAR (255) NULL);",
        [],
        (tx, results) => {
          console.log("TABLE LOGIN CREATED", results);
          tx.executeSql(
            "SELECT status FROM login WHERE ID = 1",
            [],
            (tx, results) => {
              console.log("CHECK IF ID 1 ON LOGIN EXISTS", results);
              if (results.rows.length == 0) {
                tx.executeSql(
                  "INSERT INTO login (ID,status) VALUES (1,'no');",
                  [],
                  (tx, results) => {
                    console.log("INITIAL INSERT OF LOGIN DATA", results);
                  },
                  err => {
                    console.log("Error inserting login data", err);
                  }
                );
              }
            },
            err => {
              console.log("Error checking login existence", err);
            }
          );
        }
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS plan (ID INT NOT NULL, selected_plan VARCHAR (2) NOT NULL, contact_information TEXT NULL, contact_address TEXT NULL, partner_information TEXT NULL, partner_address TEXT NULL, billing_info TEXT NULL, cc_info TEXT NULL, bank_info TEXT NULL);",
        [],
        (tx, results) => {
          console.log("TABLE PLAN CREATED", results);
          tx.executeSql(
            "SELECT selected_plan FROM plan WHERE ID = 1",
            [],
            (tx, results) => {
              console.log("CHECK IF ID 1 ON PLAN EXISTS", results);
              if (results.rows.length == 0) {
                tx.executeSql(
                  "INSERT INTO plan (ID,selected_plan) VALUES (1,'no');",
                  [],
                  (tx, results) => {
                    console.log("INITIAL INSERT OF PLAN DATA", results);
                  },
                  err => {
                    console.log("Error inserting plan data", err);
                  }
                );
              }
            },
            err => {
              console.log("Error checking plan existence", err);
            }
          );
        }
      );
    });
  };

  getLogin = async () => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT status FROM login WHERE ID = 1",
        [],
        (tx, results) => {
          console.log("Result -> ", results.rows.item(0).status);
          if (results.rows.item(0).status == "ok") {
            this.goToScreen("PlanScreen");
          }
        }
      );
    });
  };

  goToScreen = screenName => {
    Navigation.push(this.props.componentId, {
      component: {
        name: screenName
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container1}>
          <Image source={logo} />
        </View>
        <View style={styles.container2}>
          <Text style={styles.text1}>Welcome to</Text>
          <Text style={styles.text2}>Sepio Guard</Text>
          <Text style={styles.text3}>Away From Home Assurance</Text>
        </View>
        <View style={styles.container3}>
          <CustomButton
            title="LOGIN"
            width="50%"
            bgColor="#FFFFFF"
            paddingTop={14}
            paddingRight={10}
            paddingBottom={14}
            paddingLeft={10}
            borderRadius={0}
            textAlign="center"
            color="#0F195B"
            fontWeight="bold"
            borderWith={1}
            borderColor="#FFFFFF"
            fontFamily="Avenir"
            fontSize={16}
            onPressHandler={() => this.goToScreen("LoginScreen")}
          />
          <CustomButton
            title="SIGN UP"
            width="50%"
            bgColor="#F3407B"
            paddingTop={14}
            paddingRight={10}
            paddingBottom={14}
            paddingLeft={10}
            borderRadius={0}
            textAlign="center"
            color="#FFFFFF"
            fontWeight="bold"
            borderWith={1}
            borderColor="#F3407B"
            fontFamily="Avenir"
            fontSize={16}
            onPressHandler={() => this.goToScreen("SignupScreen")}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#01396F",
    flexDirection: "column"
  },
  container1: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "red",
    width: "100%"
  },
  container2: {
    flex: 3,
    alignItems: "center",
    //backgroundColor: "green",
    width: "100%"
  },
  container3: {
    flex: 6,
    justifyContent: "space-between",
    alignItems: "flex-end",
    //backgroundColor: "black",
    width: "100%",
    flexDirection: "row"
  },
  text1: {
    color: "#FFF",
    fontSize: 26,
    fontFamily: "Avenir",
    fontWeight: "bold"
  },
  text2: {
    color: "#FFF",
    fontSize: 30,
    fontFamily: "Avenir",
    fontWeight: "bold",
    paddingTop: 7
  },
  text3: {
    color: "#FFF",
    fontFamily: "Avenir",
    fontWeight: "200",
    fontSize: 16,
    paddingTop: 10
  }
});

export default StartScreen;
