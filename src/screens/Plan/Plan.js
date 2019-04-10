import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
  Alert,
  Linking,
  Platform,
  Image
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Text,
  Footer
} from "native-base";
import { Navigation } from "react-native-navigation";

import RNPickerSelect from "react-native-picker-select";
import CustomButton from "../../components/CustomButton/CustomButton";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "sepio.db" });

// IMAGES
import singlePlan from "../../assets/images/single-plan.png";
import spousePlan from "../../assets/images/spouse-plan.png";
import menu from "../../assets/images/menu.png";

class PlanScreen extends Component {
  state = {
    modalVisible: false,
    menuState: false,
    currentScreen: false,
    selectedPlan: 0,
    customer: 0,
    uid: ""
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.inputRefs = {};
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM login WHERE ID = 1",
        [],
        (tx, results) => {
          console.log("Results", results.rows.item(0).uid);
          if (results.rows.item(0).uid) {
            this.setState(prevState => {
              return {
                ...prevState,
                uid:
                  "https://sepioguard.com/share?ref=" + results.rows.item(0).uid
              };
            });

            fetch("https://sepioguard-test-api.herokuapp.com/v1/customer", {
              method: "GET",
              credentials: "include"
            })
              .then(response => {
                console.log("Response Customers", response._bodyText);
                let c = JSON.parse(response._bodyText);
                console.log("Response Customers", c.length);
                let customers = [];

                for (var i = 0; i < c.length; i++) {
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
        },
        err => {
          console.log("Error checking login existence", err);
        }
      );
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
    this.setState(prevState => {
      return {
        ...prevState,
        modalVisible: visible
      };
    });
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
        name: screenName,
        options: {
          topBar: {
            visible: false,
            height: 0
          }
        }
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

  sendSMS = (number, uid) => {
    console.log("Send SMS -> " + number);
    if (Platform.OS === "ios") {
      Linking.openURL(
        "sms:" + number + "&body=https://store.sepioguard.com?sid=" + uid
      );
    } else {
      Linking.openURL(
        "sms:" + number + "?body=https://store.sepioguard.com?sid=" + uid
      );
    }
  };

  sendEmail = (email, uid) => {
    console.log("Send Email -> " + email);
    console.log("UID -> " + uid);

    const canOpen = Linking.canOpenURL(
      "https://store.sepioguard.com?sid=" + uid
    );

    if (canOpen) {
      console.log("Can Open URL");
      if (Platform.OS === "ios") {
        Linking.openURL(
          "mailto:" +
            email +
            "?subject=Contact from Sepio&body=https://store.sepioguard.com?sid=" +
            uid
        );
      } else {
        Linking.openURL(
          "mailto:" +
            email +
            "?subject=Contact from Sepio&body=https://store.sepioguard.com?sid=" +
            uid
        );
      }
    } else {
      console.log("Can Open -> ", canOpen);
    }
  };

  sendLink(type) {
    this.setModalVisible(false);

    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM login WHERE ID = 1",
        [],
        (tx, results) => {
          console.log("Results", results.rows.item(0).uid);
          if (results.rows.item(0).uid) {
            let uid = results.rows.item(0).uid;
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
                  this.sendSMS(customer.phone, uid);
                } else {
                  this.sendEmail(customer.emailAddress, uid);
                }
                this.setModalVisible(false);
              })
              .catch(error => {
                console.log("Error retrieveing customer.", error);
              });
          }
        },
        err => {
          console.log("Error checking login existence", err);
        }
      );
    });
  }

  render() {
    return (
      <Container>
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
                You can send a customer a link to fill
              </Text>
              <Text style={styles.text3}>out the form themselves. Please</Text>
              <Text style={styles.text3}>choose one of the options below.</Text>
              <View
                style={{
                  flex: 1,
                  width: "90%",
                  marginTop: 20
                }}
              >
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
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#efefef",
                  borderRadius: 5,
                  width: "90%",
                  height: 30,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: 10,
                  marginBottom: 0
                }}
              >
                <TextInput
                  style={{ marginHorizontal: 10 }}
                  value={this.state.uid}
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
        <Header
          style={{
            backgroundColor: "white",
            borderBottomWidth: 0,
            elevation: 0
          }}
        >
          <Left>
            <Button transparent onPress={() => this.openSideMenu()}>
              <Image source={menu} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "white" }}>Header</Title>
          </Body>
          <Right />
        </Header>
        <Content>
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
        </Content>
        <Footer
          style={{
            backgroundColor: "rgba(0,0,0,0);",
            borderTopWidth: 0
          }}
        >
          <Text style={styles.textPlan}>
            Powered by <Text style={styles.pink}>Sepio Guard</Text>
          </Text>
        </Footer>
      </Container>
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
    width: 140,
    height: 140,
    backgroundColor: "#F3F3F7",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5
  },
  buttonBgSelected: {
    width: 140,
    height: 140,
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
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
    width: "100%",
    paddingHorizontal: 10
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
    paddingTop: 5,
    paddingHorizontal: 10,
    paddingBottom: 5,
    height: 40,
    borderWidth: 0,
    borderColor: "gray",
    borderRadius: 4,
    backgroundColor: "#efefef",
    color: "#01396F"
  }
});

export default PlanScreen;
