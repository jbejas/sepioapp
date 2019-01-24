import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Linking,
  Modal,
  ActivityIndicator
} from "react-native";
import { Icon } from "react-native-elements";
import { Navigation } from "react-native-navigation";
import Image from "react-native-remote-svg";
import call from "react-native-phone-call";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "sepio.db" });

// IMAGES
import menu from "../../assets/images/menu.png";

class CustomersScreen extends Component {
  state = {
    modalVisible: false,
    menuState: false,
    dataSource: null,
    customers: []
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  componentDidMount() {
    this.setState(prevState => {
      return {
        ...prevState,
        activityDisplay: true
      };
    });
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM login WHERE ID = 1", [], (tx, results) => {
        console.log("Results", results.rows.item(0));
        if (results.rows.item(0).uid) {
          fetch("https://sepioguard-test-api.herokuapp.com/v1/customer", {
            method: "GET",
            credentials: "include"
          })
            .then(response => {
              console.log("Response Customers", response);
              let c = JSON.parse(response._bodyText);
              let customers = [];

              for (var i = 0; i < c.length; i++) {
                var date = new Date(parseInt(c[i]["createdAt"]));
                var month = date.getMonth() + 1;
                if (month < 10) {
                  month = "0" + month;
                }
                var day = date.getDay();
                if (day < 10) {
                  day = "0" + day;
                }
                var year = date.getFullYear();
                var formattedTime = month + "/" + day + "/" + year;

                if (c[i].vendor == results.rows.item(0).employer) {
                  customers.push({
                    key: c[i]["id"],
                    firstName: c[i]["firstName"],
                    lastName: c[i]["lastName"],
                    emailAddress: c[i]["emailAddress"],
                    createdOn: formattedTime,
                    phone: c[i]["phone"]
                  });
                }
              }

              if (customers.length == 0) {
                Alert.alert(
                  "Customers",
                  "You have no customers associated to your profile.",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        console.log("OK Pressed");
                        setTimeout(() => {
                          this.setState(prevState => {
                            return {
                              ...prevState,
                              activityDisplay: false
                            };
                          });
                        }, 200);
                      }
                    }
                  ],
                  { cancelable: false }
                );
              } else {
                this.setState(prevState => {
                  return {
                    ...prevState,
                    customers: customers
                  };
                });
                setTimeout(() => {
                  this.setState(prevState => {
                    return {
                      ...prevState,
                      activityDisplay: false
                    };
                  });
                }, 500);
              }
            })
            .catch(error => {
              Alert.alert(
                "Error",
                "The App failed to load the Customers List.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      console.log("OK Pressed");
                      setTimeout(() => {
                        this.setState(prevState => {
                          return {
                            ...prevState,
                            activityDisplay: false
                          };
                        });
                      }, 200);
                    }
                  }
                ],
                { cancelable: false }
              );
            });
        }
      });
    });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  goToScreen = screenName => {
    Navigation.push(this.props.componentId, {
      component: {
        name: screenName
      }
    });
  };

  openSideMenu = () => {
    if (this.state.menuState == false) {
      this.setState({ menuState: true });
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: true
          }
        }
      });
    } else if (this.state.menuState == true) {
      this.setState({ menuState: false });
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: false
          }
        }
      });
    }
  };

  makeCall = number => {
    console.log("Make Call");
    const args = {
      number: number, // String value with the number to call
      prompt: true // Optional boolean property. Determines if the user should be prompt prior to the call
    };

    call(args).catch(console.error);
  };

  sendSMS = number => {
    console.log("Send SMS");
    Linking.openURL("sms:" + number);
  };

  sendEmail = email => {
    console.log("Send Email");
    Linking.openURL("mailto:" + email + "?subject=Contact from Sepio");
  };

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.activityDisplay}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#F3407B" />
          </View>
        </Modal>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.openSideMenu()}
          >
            <Image source={menu} />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Text style={styles.text1}>Customers</Text>
        </View>
        <View style={styles.planSelectors}>
          <FlatList
            style={styles.customerList}
            data={this.state.customers}
            renderItem={({ item }) => (
              <View style={styles.customer}>
                <View style={styles.customerName}>
                  <View>
                    <Text style={styles.customerText}>
                      {item.firstName} {item.lastName}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.customerEmail}>
                      {item.emailAddress}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.customerEmail}>
                      Signup Date: {item.createdOn}
                    </Text>
                  </View>
                </View>
                <View style={styles.phone}>
                  <Icon
                    name="phone"
                    color="#517fa4"
                    containerStyle={{ marginTop: 8 }}
                    onPress={() => this.makeCall(item.phone)}
                  />
                </View>
                <View style={styles.sms}>
                  <Icon
                    name="textsms"
                    color="#517fa4"
                    containerStyle={{ marginTop: 8 }}
                    onPress={() => this.sendSMS(item.phone)}
                  />
                </View>
                <View style={styles.email}>
                  <Icon
                    name="mail"
                    color="#517fa4"
                    containerStyle={{ marginTop: 6 }}
                    onPress={() => this.sendEmail(item.emailAddress)}
                  />
                </View>
              </View>
            )}
          />
        </View>
        <View style={styles.powered}>
          <Text style={styles.textPlan}>
            Powered by <Text style={styles.pink}>Sepio Guard</Text>
          </Text>
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
    backgroundColor: "#FFF",
    flexDirection: "column"
  },
  topHeader: {
    marginTop: 30,
    height: 50,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginLeft: 40
  },
  header: {
    justifyContent: "center",
    alignItems: "flex-end",
    //backgroundColor: "red",
    flexDirection: "row",
    width: "100%",
    flex: 0.7
  },
  text1: {
    color: "#01396F",
    fontSize: 24,
    fontFamily: "Avenir",
    fontWeight: "bold",
    //backgroundColor: "green",
    textAlign: "center",
    width: "100%"
  },
  planSelectors: {
    flex: 9,
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    //backgroundColor: "green",
    marginTop: 10
  },
  powered: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#FFF",
    flexDirection: "row",
    width: "100%"
  },
  textPlan: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir",
    marginTop: 10,
    marginBottom: 10
  },
  pink: {
    color: "#F3407B",
    fontSize: 15,
    fontFamily: "Avenir",
    marginTop: 10,
    marginBottom: 10
  },
  select: {
    marginLeft: 15
  },
  row: {
    width: "80%",
    height: 50,
    //backgroundColor: "green",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 0
  },
  customerList: {
    width: "100%"
  },
  customer: {
    height: 60,
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    width: "100%"
    //backgroundColor: "red"
  },
  customerName: {
    height: 30,
    width: "64%"
    //backgroundColor: "red"
  },
  customerText: {
    textAlign: "left",
    color: "#01396F",
    lineHeight: 20,
    paddingLeft: "3%"
  },
  customerEmail: {
    textAlign: "left",
    color: "#01396F",
    lineHeight: 15,
    paddingLeft: "3%",
    fontSize: 10
  },
  phone: {
    height: 30,
    width: "12%",
    textAlign: "center"
  },
  sms: {
    height: 30,
    width: "12%",
    textAlign: "center"
  },
  email: {
    height: 30,
    width: "12%",
    textAlign: "center"
  },
  buttonText: {
    textAlign: "center",
    lineHeight: 30,
    fontSize: 11
  },
  buttonIcon: {
    lineHeight: 30
  }
});

export default CustomersScreen;
