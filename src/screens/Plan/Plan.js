import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal
} from "react-native";
import { Navigation } from "react-native-navigation";
import Image from "react-native-remote-svg";
import CustomButton from "../../components/CustomButton/CustomButton";

// IMAGES
import singlePlan from "../../assets/images/single-plan.svg";
import spousePlan from "../../assets/images/spouse-plan.svg";
import arrow from "../../assets/images/arrow-down.svg";
import menu from "../../assets/images/menu.png";

class PlanScreen extends Component {
  state = {
    modalVisible: false,
    menuState: false,
    currentScreen: false
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);

    /*Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        visible: true,
        hideOnScroll: false,
        background: {
          color: "#FFFFFF"
        },
        noBorder: true,
        leftButtons: [
          {
            id: "Drawer",
            color: "#F3407B",
            icon: menu
          }
        ]
      }
    });*/
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
                <TextInput
                  style={styles.select}
                  onChangeText={text => this.setState({ text })}
                  placeholder="Select a Customer"
                  placeholderTextColor="#0F195B"
                />
                <Image style={styles.arrow} source={arrow} />
              </View>
              <View style={[styles.row, styles.selectBox]}>
                <TextInput
                  style={styles.select}
                  onChangeText={text => this.setState({ text })}
                  placeholder="https://sepioguard.com/share?ref=Lorem Ipsum Dolor Sit Amet"
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
                  onPressHandler={() => this.setModalVisible(false)}
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
                  onPressHandler={() => this.setModalVisible(false)}
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
            <View style={styles.buttonBg}>
              <TouchableWithoutFeedback style={styles.button}>
                <Image source={singlePlan} />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.buttonBg}>
              <TouchableWithoutFeedback style={styles.button}>
                <Image source={spousePlan} />
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.planDescription}>
            <View style={styles.containerText}>
              <Text style={styles.textPlan}>Single Plan</Text>
            </View>
            <View style={styles.containerText}>
              <Text style={styles.textPlan}>Add Spouse</Text>
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
            onPressHandler={() => this.goToScreen("ContactInformationScreen")}
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
    marginBottom: 10
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

export default PlanScreen;
