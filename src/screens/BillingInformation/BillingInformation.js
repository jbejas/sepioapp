import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import { Navigation } from "react-native-navigation";
import CustomButton from "../../components/CustomButton/CustomButton";
import Image from "react-native-remote-svg";

// IMAGES
import cc from "../../assets/images/cc.svg";
import bank from "../../assets/images/bank.svg";
import menu from "../../assets/images/menu.png";

class BillingInformationScreen extends Component {
  state = {
    menuState: false
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
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

  goToScreen = screenName => {
    Navigation.push(this.props.componentId, {
      component: {
        name: screenName
      }
    });
  };

  goBack = () => {
    Navigation.pop(this.props.componentId);
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.openSideMenu()}
          >
            <Image source={menu} />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Text style={styles.text1}>Billing Information</Text>
        </View>
        <View style={styles.planSelectors}>
          <View style={styles.planContainer}>
            <View style={styles.buttonBg}>
              <TouchableWithoutFeedback style={styles.button}>
                <Image source={cc} />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.buttonBg}>
              <TouchableWithoutFeedback style={styles.button}>
                <Image source={bank} />
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.planDescription}>
            <View style={styles.containerText}>
              <Text style={styles.textPlan}>Add Credit Card</Text>
            </View>
            <View style={styles.containerText}>
              <Text style={styles.textPlan}>Link Bank (ACH)</Text>
            </View>
          </View>
        </View>
        <View style={styles.nextBt}>
          <CustomButton
            title="NEXT"
            width="95%"
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
            onPressHandler={() => this.goToScreen("CardInformationScreen")}
          />
        </View>
        <View style={styles.back}>
          <Text style={styles.steps}>3 of 4</Text>
          <CustomButton
            title="BACK"
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
            onPressHandler={() => this.goBack()}
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
    flex: 2
  },
  containerCol: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  containerColStart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  containerColEnd: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end"
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
  planDescription: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    //backgroundColor: "green",
    width: "93%"
  },
  back: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
    flex: 2.4
  },
  nextBt: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  powered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#FFF",
    flexDirection: "row",
    width: "100%"
  },
  steps: {
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
  text1: {
    color: "#01396F",
    fontSize: 24,
    fontFamily: "Avenir",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10
  },
  textPlan: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir",
    marginTop: 10,
    marginBottom: 10
  }
});

export default BillingInformationScreen;
