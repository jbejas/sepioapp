import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  Alert,
  Linking
} from "react-native";
import { Navigation } from "react-native-navigation";
import Image from "react-native-remote-svg";
import RNPickerSelect from "react-native-picker-select";
import CustomButton from "../../components/CustomButton/CustomButton";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "sepio.db" });

// IMAGES
import singlePlan from "../../assets/images/single-plan.svg";
import spousePlan from "../../assets/images/spouse-plan.svg";
import menu from "../../assets/images/menu.png";

class PlanScreen extends Component {
  state = {
    modalVisible: false,
    menuState: false,
    currentScreen: false,
    selectedPlan: 0,
    customer: 0,
    link: "https://sepioguard.com/share?ref=Lorem Ipsum Dolor Sit Amet"
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.inputRefs = {};
  }

  componentDidMount() {
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
                    value: c[i]["id"],
                    label: c[i]["firstName"] + " " + c[i]["lastName"]
                  });
                }
              }

              if (customers.length == 0) {
                console.log("No Customers");
              } else {
                this.setState(prevState => {
                  return {
                    ...prevState,
                    customers: customers
                  };
                });
              }
            })
            .catch(error => {
              console.log("Error retrieveing customers.");
            });
        }
      });
    });
  }

  navigationButtonPressed({ buttonId }) {
    console.log("Button ID -> " + buttonId);
    if (buttonId == "Drawer" && this.state.menuState == false) {
      this.setState({ menuState: true });
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: true
          }
        }
      });
    } else if (buttonId == "Drawer" && this.state.menuState == true) {
      this.setState({ menuState: false });
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: false
          }
        }
      });
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  setCustomer = value => {
    console.log("Customer -> " + value);
    this.setState(prevState => {
      return {
        ...prevState,
        customer: value
      };
    });
  };

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

  selectPlan = p => {
    this.setState(prevState => {
      return {
        ...prevState,
        selectedPlan: p
      };
    });
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE plan SET selected_plan = " + p + " WHERE ID = 1",
        [],
        (tx, results) => {
          console.log("Results", results);
        }
      );
    });
  };

  processPlan() {
    if (this.state.selectedPlan != 0) {
      this.goToScreen("ContactInformationScreen");
    } else {
      Alert.alert(
        "Choose Plan",
        "Please select a Plan.",
        [
          {
            text: "OK",
            onPress: () => {
              console.log("OK Pressed");
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  sendSMS = number => {
    console.log("Send SMS");
    Linking.openURL("sms:" + number + "?body=" + this.state.link);
  };

  sendEmail = email => {
    console.log("Send Email");
    Linking.openURL(
      "mailto:" + email + "?subject=Contact from Sepio&body=" + this.state.link
    );
  };

  sendLink(type) {
    this.setModalVisible(false);
    fetch(
      "https://sepioguard-test-api.herokuapp.com/v1/customer/" +
        this.state.customer,
      {
        method: "GET",
        credentials: "include"
      }
    )
      .then(response => {
        console.log("Response Customer", response);
        let customer = JSON.parse(response._bodyText);
        if (type == "sms") {
          this.sendSMS(customer.phone);
        } else {
          this.sendEmail(customer.emailAddress);
        }
      })
      .catch(error => {
        console.log("Error retrieveing customer.", error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={[styles.text1, styles.paddingBottom]}>
                Send a Link
              </Text>
              <Text style={styles.text3}>
                Your can send a customer a link to fill
              </Text>
              <Text style={styles.text3}>out the form themselves. Please</Text>
              <Text style={styles.text3}>choose one of the options below.</Text>
              <View style={[styles.row, styles.selectBox]}>
                <RNPickerSelect
                  placeholder={{
                    label: "Select Customer...",
                    value: null,
                    color: "#01396F"
                  }}
                  items={this.state.customers}
                  hideIcon={true}
                  onValueChange={value => {
                    this.setCustomer(value);
                  }}
                  onUpArrow={() => {
                    this.inputRefs.name.focus();
                  }}
                  onDownArrow={() => {
                    this.inputRefs.picker2.togglePicker();
                  }}
                  style={{ ...pickerSelectStyles }}
                  ref={el => {
                    this.inputRefs.picker = el;
                  }}
                />
              </View>
              <View style={[styles.row, styles.selectBox]}>
                <TextInput
                  style={styles.select}
                  value={this.state.link}
                  placeholderTextColor="#0F195B"
                />
              </View>
              <View style={styles.buttonsContainer}>
                <CustomButton
                  title="VIA TEXT"
                  width="47%"
                  bgColor="#F3407B"
                  paddingTop={14}
                  paddingRight={10}
                  paddingBottom={14}
                  paddingLeft={10}
                  marginBottom={15}
                  textAlign="center"
                  color="#FFFFFF"
                  fontWeight="bold"
                  borderWidth={0}
                  borderColor="#01396F"
                  fontFamily="Avenir"
                  fontSize={16}
                  borderRadius={5}
                  onPressHandler={() => this.sendLink("sms")}
                />
                <CustomButton
                  title="VIA EMAIL"
                  width="47%"
                  bgColor="#F3407B"
                  paddingTop={14}
                  paddingRight={10}
                  paddingBottom={14}
                  paddingLeft={10}
                  marginBottom={15}
                  textAlign="center"
                  color="#FFFFFF"
                  fontWeight="bold"
                  borderWidth={0}
                  borderColor="#01396F"
                  fontFamily="Avenir"
                  fontSize={16}
                  borderRadius={5}
                  onPressHandler={() => this.sendLink("email")}
                />
              </View>
              <CustomButton
                title="BACK"
                width="90%"
                bgColor="#FFFFFF"
                paddingTop={14}
                paddingRight={10}
                paddingBottom={14}
                paddingLeft={10}
                marginBottom={15}
                textAlign="center"
                color="#F3407B"
                fontWeight="bold"
                borderWidth={0}
                borderColor="#01396F"
                fontFamily="Avenir"
                fontSize={16}
                borderRadius={5}
                onPressHandler={() => this.setModalVisible(false)}
              />
            </View>
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
          <Text style={styles.text1}>Choose a Plan</Text>
        </View>
        <View style={styles.planSelectors}>
          <View style={styles.planContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.selectPlan(1);
              }}
            >
              <View
                style={
                  this.state.selectedPlan == 1
                    ? styles.buttonBgSelected
                    : styles.buttonBg
                }
              >
                <Image source={singlePlan} />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                this.selectPlan(2);
              }}
            >
              <View
                style={
                  this.state.selectedPlan == 2
                    ? styles.buttonBgSelected
                    : styles.buttonBg
                }
              >
                <Image source={spousePlan} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.planDescription}>
            <View style={styles.containerText}>
              <Text style={styles.textPlan}>Single Plan</Text>
            </View>
            <View style={styles.containerText}>
              <Text style={styles.textPlan}>
                Add Family{"\n"}Member / Partner
              </Text>
            </View>
          </View>
          <CustomButton
            title="NEXT"
            width="90%"
            bgColor="#F3407B"
            paddingTop={14}
            paddingRight={10}
            paddingBottom={14}
            paddingLeft={10}
            textAlign="center"
            color="#FFFFFF"
            fontWeight="bold"
            borderWith={1}
            borderColor="#F3407B"
            fontFamily="Avenir"
            fontSize={16}
            borderRadius={5}
            marginTop={15}
            onPressHandler={() => this.processPlan()}
          />
        </View>
        <View style={styles.sendLink}>
          <Text style={styles.textPlan}>
            Need to send the form directly to a customer?
          </Text>
          <CustomButton
            title="SEND A LINK"
            width="90%"
            bgColor="#FFFFFF"
            paddingTop={14}
            paddingRight={10}
            paddingBottom={14}
            paddingLeft={10}
            textAlign="center"
            color="#01396F"
            fontWeight="bold"
            borderWidth={1}
            borderColor="#01396F"
            fontFamily="Avenir"
            fontSize={16}
            borderRadius={5}
            onPressHandler={() => this.setModalVisible(true)}
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
    flex: 1
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
    flex: 3,
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    //backgroundColor: "green",
    marginTop: 30
  },
  planContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "93%"
  },
  buttonBg: {
    width: 150,
    height: 150,
    backgroundColor: "#F3F3F7",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5
  },
  buttonBgSelected: {
    width: 150,
    height: 150,
    backgroundColor: "#F3F3F7",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#01396F"
  },
  planDescription: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    //backgroundColor: "green",
    width: "93%"
  },
  sendLink: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "green",
    flexDirection: "column",
    width: "100%"
  },
  powered: {
    flex: 1,
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
    marginBottom: 10,
    textAlign: "center",
    width: "100%"
  },
  containerText: {
    width: "50%"
  },
  pink: {
    color: "#F3407B",
    fontSize: 15,
    fontFamily: "Avenir",
    marginTop: 10,
    marginBottom: 10
  },
  modalContainer: {
    flex: 1,
    marginTop: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.4)"
  },
  modalContent: {
    width: "85%",
    height: 460,
    backgroundColor: "#fefefe",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  party: {
    marginTop: 20,
    marginBottom: 20,
    width: 150,
    height: 147
  },
  text3: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir"
  },
  select: {
    marginLeft: 15
  },
  selectBox: {
    backgroundColor: "#efefef",
    borderRadius: 5
  },
  arrow: {
    marginRight: 13,
    width: 9,
    height: 9
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    paddingTop: 20
  },
  paddingBottom: {
    paddingTop: 30,
    paddingBottom: 30
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    paddingTop: 12,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderWidth: 0,
    borderColor: "gray",
    borderRadius: 4,
    backgroundColor: "#efefef",
    color: "#01396F",
    textAlign: "center"
  },
  inputAndroid: {
    fontSize: 16,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderWidth: 0,
    borderColor: "gray",
    borderRadius: 4,
    backgroundColor: "#efefef",
    color: "#01396F"
  }
});

export default PlanScreen;
