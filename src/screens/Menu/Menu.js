import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Navigation } from "react-native-navigation";
import Image from "react-native-remote-svg";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "sepio.db" });

import logo from "../../assets/images/logo.svg";
import home from "../../assets/images/home.svg";
import referrals from "../../assets/images/referrals.svg";
import customers from "../../assets/images/customers.svg";
import settings from "../../assets/images/settings.svg";
import logout from "../../assets/images/logout.svg";

class MenuScreen extends Component {
  state = {
    activeComponentId: null,
    userName: ""
  };

  constructor(props) {
    super(props);
    Navigation.events().registerComponentDidAppearListener(
      ({ componentId }) => {
        console.log("Mounted Component ID -> " + componentId);
        if (componentId != "Drawer") {
          this.setState({
            activeComponentId: componentId
          });
        }
      }
    );
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM login WHERE ID = 1", [], (tx, results) => {
        console.log("GETTING USER DATA", results.rows.item(0));
        if (results && results.rows.item(0).status == "ok") {
          this.setState(prevState => {
            return {
              ...prevState,
              userName:
                results.rows.item(0).first_name +
                " " +
                results.rows.item(0).last_name
            };
          });
        }
      });
    });
  }

  goToScreen = screenName => {
    console.log("Screen Name -> " + screenName);
    console.log("Component ID -> " + this.state.activeComponentId);
    Navigation.mergeOptions(this.state.activeComponentId, {
      sideMenu: {
        left: {
          visible: false
        }
      }
    });
    Navigation.push(this.state.activeComponentId, {
      component: {
        name: screenName
      }
    });
  };

  errorCB(err) {
    console.log("SQL Error: " + err);
  }

  successCB() {
    console.log("SQL executed fine");
  }

  openCB() {
    console.log("Database OPENED");
  }

  logoutUser = () => {
    console.log("Logout");

    db.transaction(tx => {
      tx.executeSql(
        "UPDATE login SET status = 'no' WHERE ID = 1",
        [],
        (tx, results) => {
          console.log("Query completed", results);
          if (results.rowsAffected == 1) {
            this.goToScreen("StartScreen");
          }
        }
      );
    });

    /*fetch("https://sepioguard-test-api.herokuapp.com/v1/auth/logout", {
      method: "GET",
      headers: {
        Accept: "text/plain",
        "Content-Type": "text/plain; charset=utf-8"
      }
    })
      .then(response => {
        console.log("Response Login", response);
        db.transaction(tx => {
          tx.executeSql(
            "UPDATE login SET status = 'no' WHERE ID = 1",
            [],
            (tx, results) => {
              console.log("Query completed", results);
              if (results.rowsAffected == 1) {
                this.goToScreen("StartScreen");
              }
            }
          );
        });
      })
      .catch(error => {
        console.log("Error Login", error._bodyText);
      });*/
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.menuHeader}>
          <Image style={styles.avatar} source={logo} />
          <Text style={styles.username}>{this.state.userName}</Text>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            onPress={() => {
              this.goToScreen("PlanScreen");
            }}
          >
            <View style={styles.menuItem}>
              <Image style={styles.imageIcon} source={home} />
              <Text style={styles.menuText}>Home</Text>
            </View>
          </TouchableOpacity>
          {/*<View style={styles.menuItem}>
            <Image style={styles.imageIcon} source={referrals} />
            <Text style={styles.menuText}>Referrals</Text>
          </View>*/}
          <TouchableOpacity
            onPress={() => {
              this.goToScreen("CustomersScreen");
            }}
          >
            <View style={styles.menuItem}>
              <Image style={styles.imageIcon} source={customers} />
              <Text style={styles.menuText}>Customers</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.goToScreen("SettingsScreen");
            }}
          >
            <View style={styles.menuItem}>
              <Image style={styles.imageIcon} source={settings} />
              <Text style={styles.menuText}>Settings</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.logoutUser();
            }}
          >
            <View style={styles.menuItem}>
              <Image style={styles.imageIcon} source={logout} />
              <Text style={styles.menuText}>Logout</Text>
            </View>
          </TouchableOpacity>
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
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    width: "75%"
  },
  avatar: {
    marginTop: 20,
    width: 120,
    height: 120
  },
  username: {
    color: "#FFF",
    marginTop: 20,
    fontFamily: "Avenir"
  },
  menuHeader: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#01396F",
    flexDirection: "column",
    width: "100%"
  },
  menuContainer: {
    flex: 3,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#01396F",
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#FFF",
    paddingTop: 20
  },
  menuItem: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 10
  },
  imageIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10
  },
  menuText: {
    marginLeft: 15,
    color: "#01396F",
    fontSize: 16,
    width: "70%"
  }
});

export default MenuScreen;
