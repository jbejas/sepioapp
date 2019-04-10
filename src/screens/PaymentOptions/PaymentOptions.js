import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Linking,
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
import SplashScreen from "react-native-splash-screen";
import { Navigation } from "react-native-navigation";
import CustomButton from "../../components/CustomButton/CustomButton";
import RNPickerSelect from "react-native-picker-select";

import party from "../../assets/images/party.png";
import menu from "../../assets/images/menu.png";
import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "sepio.db" });

const theme = {
  primaryBackgroundColor: "#FFFFFF",
  secondaryBackgroundColor: "#01396F",
  primaryForegroundColor: "#FFFFFF",
  secondaryForegroundColor: "#01396F",
  accentColor: "#F3407B",
  errorColor: "#F3407B"
};

class PaymentOptionsScreen extends Component {
  state = {
    activityDisplay: false,
    modalVisible: false,
    setContent: 1,
    menuState: false,
    payment: 0,
    customer: 0,
    plan: 0,
    method_data: 0
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.inputRefs = {};
  }

  componentDidMount() {
    SplashScreen.hide();
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM login WHERE ID = 1",
        [],
        (tx, results) => {
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
        },
        err => {
          console.log("Error checking login existence", err);
        }
      );
    });
  }

  setCustomer = value => {
    this.setState(prevState => {
      return {
        ...prevState,
        customer: value
      };
    });
  };

  setModalVisible(visible, content) {
    this.setState(prevState => {
      return {
        ...prevState,
        setContent: content,
        modalVisible: visible
      };
    });

    if (content == 2) {
      setTimeout(() => {
        this.setState(prevState => {
          return {
            ...prevState,
            modalVisible: true
          };
        });
      }, 500);
    }

    if (content == 3) {
      this.goToScreen("PlanScreen");
    }
  }

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

  modalClosed = () => {
    if (this.state.setContent == 2) {
      this.setState({ modalVisible: true });
    } else {
      this.goToScreen("PlanScreen");
    }
  };

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

  setPaymentOption = value => {
    this.setState(prevState => {
      return {
        ...prevState,
        payment: value
      };
    });
  };

  completePurchase = () => {
    //Publishable Key: `pk_live_8tcRfySbefdvEyvdcmkc2VhR`
    //Secret Key: `sk_live_oCfgpuOJHuaSUoIWJ6Go4P4W`

    if (this.state.payment == 0) {
      Alert.alert(
        "Choose Plan",
        "Please choose a paymetn option.",
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
    } else {
      this.setState(prevState => {
        return {
          ...prevState,
          activityDisplay: true
        };
      });

      db.transaction(tx => {
        tx.executeSql("SELECT * FROM plan WHERE ID = 1", [], (tx, results) => {
          console.log("UPDATING STATUS", results.rows.item(0));
          let cc_info = JSON.parse(results.rows.item(0).cc_info);
          let bank_info = JSON.parse(results.rows.item(0).bank_info);
          let contact_information = JSON.parse(
            results.rows.item(0).contact_information
          );

          console.log("Creating Customer");

          fetch("https://sepioguard-test-api.herokuapp.com/v1/customer", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
              firstName: contact_information.first_name,
              lastName: contact_information.last_name,
              phone: contact_information.phone,
              emailAddress: contact_information.email
            })
          })
            .then(response => {
              console.log("Response Create Customer", response);
              if (response.status == 200) {
                // CREATE CARD

                if (bank_info.info == "no") {
                  console.log("USING CREDIT CARD");
                  this.setState(prevState => {
                    return {
                      ...prevState,
                      method_data:
                        "card[number]=" +
                        cc_info.card_number +
                        "&card[exp_month]=" +
                        cc_info.month +
                        "&card[exp_year]=" +
                        cc_info.year +
                        "&card[cvc]=" +
                        cc_info.ccv
                    };
                  });
                } else {
                  console.log("USING BANK ACCOUNT");
                  this.setState(prevState => {
                    return {
                      ...prevState,
                      method_data:
                        "bank_account[country]=US&bank_account[currency]=usd" +
                        "&bank_account[account_holder_name]=" +
                        contact_information.first_name +
                        " " +
                        contact_information.last_name +
                        "&bank_account[account_holder_type]=" +
                        bank_info.selectedAccount +
                        "&bank_account[routing_number]=" +
                        bank_info.routing_number +
                        "&bank_account[account_number]=" +
                        bank_info.account_number
                    };
                  });
                }

                console.log("Method Data -> " + this.state.method_data);

                fetch("https://api.stripe.com/v1/tokens", {
                  body: this.state.method_data,
                  headers: {
                    Authorization:
                      "Bearer " + "sk_live_oCfgpuOJHuaSUoIWJ6Go4P4W",
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST"
                }).then(response => {
                  console.log(
                    "CARD TOKEN RESPONSE",
                    JSON.parse(response._bodyText)
                  );
                  let tokens = JSON.parse(response._bodyText);

                  if (tokens.id) {
                    fetch("https://api.stripe.com/v1/customers", {
                      body:
                        "description=Customer for " +
                        contact_information.email +
                        "&source=" +
                        tokens.id,
                      headers: {
                        Authorization:
                          "Bearer " + "sk_live_oCfgpuOJHuaSUoIWJ6Go4P4W",
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      method: "POST"
                    }).then(customer => {
                      console.log(
                        "CUSTOMER CREATION",
                        JSON.parse(customer._bodyText)
                      );

                      let customer_data = JSON.parse(customer._bodyText);

                      if (customer_data.id) {
                        if (this.state.payment == "449") {
                          console.log("SINGLE PAYMENT");
                          this.setState(prevState => {
                            return {
                              ...prevState,
                              plan: "singlePayment"
                            };
                          });
                        } else if (this.state.payment == "150") {
                          console.log("3 MONTHS PAYMENT");
                          this.setState(prevState => {
                            return {
                              ...prevState,
                              plan: "threePayment"
                            };
                          });
                        } else if (this.state.payment == "45") {
                          console.log("12 MONTHS PAYMENT");
                          this.setState(prevState => {
                            return {
                              ...prevState,
                              plan: "twelvePayment"
                            };
                          });
                        }

                        fetch("https://api.stripe.com/v1/subscriptions", {
                          body:
                            "items[0][plan]=" +
                            this.state.plan +
                            "&customer=" +
                            customer_data.id,
                          headers: {
                            Authorization:
                              "Bearer " + "sk_live_oCfgpuOJHuaSUoIWJ6Go4P4W",
                            "Content-Type": "application/x-www-form-urlencoded"
                          },
                          method: "POST"
                        }).then(response => {
                          console.log(
                            "SUBSCRIPTION CREATION",
                            JSON.parse(response._bodyText)
                          );

                          let subscription = JSON.parse(response._bodyText);

                          if (subscription.id) {
                            this.setState(prevState => {
                              return {
                                ...prevState,
                                activityDisplay: false
                              };
                            });
                            setTimeout(() => {
                              this.setModalVisible(true, 1);
                            }, 250);
                          } else {
                            this.setState(prevState => {
                              return {
                                ...prevState,
                                activityDisplay: false
                              };
                            });
                            setTimeout(() => {
                              Alert.alert(
                                "Error",
                                subscription.error.message,
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
                            }, 250);
                          }
                        });
                      } else {
                        this.setState(prevState => {
                          return {
                            ...prevState,
                            activityDisplay: false
                          };
                        });
                        setTimeout(() => {
                          Alert.alert(
                            "Error",
                            customer_data.message,
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
                        }, 250);
                      }
                    });
                  } else {
                    this.setState(prevState => {
                      return {
                        ...prevState,
                        activityDisplay: false
                      };
                    });
                    setTimeout(() => {
                      Alert.alert(
                        "Error",
                        tokens.error.message,
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
                    }, 250);
                  }
                });
              } else {
                console.log("Error Creating Customer");
                this.setState(prevState => {
                  return {
                    ...prevState,
                    activityDisplay: false
                  };
                });
                setTimeout(() => {
                  Alert.alert(
                    "Error",
                    "Error creating customer.",
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
                }, 250);
              }
            })
            .catch(error => {
              console.log("Error Creating New Customer", error._bodyText);
            });
        });
      });
    }
  };

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
        this.setModalVisible(true);
      })
      .catch(error => {
        console.log("Error retrieveing customer.", error);
      });
  }

  render() {
    const purchase = (
      <View style={styles.modalContent}>
        <Text style={styles.text1}>Purchase Complete</Text>
        <Text style={styles.text3}>Your customer will receive an</Text>
        <Text style={styles.text3}>email confirmation shortly</Text>
        <Image style={styles.party} source={party} />
        <CustomButton
          title="SEND REFERRAL LINK"
          width="90%"
          bgColor="#FFFFFF"
          paddingTop={14}
          paddingRight={10}
          paddingBottom={14}
          paddingLeft={10}
          marginBottom={15}
          textAlign="center"
          color="#01396F"
          fontWeight="bold"
          borderWidth={1}
          borderColor="#01396F"
          fontFamily="Avenir"
          fontSize={16}
          borderRadius={5}
          onPressHandler={() => this.setModalVisible(false, 2)}
        />
        <CustomButton
          title="HOME"
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
          onPressHandler={() => this.setModalVisible(false, 3)}
        />
      </View>
    );

    const referral = (
      <View style={styles.modalContent}>
        <Text style={[styles.text1, styles.paddingBottom]}>Send a Link</Text>
        <Text style={styles.text3}>
          Your can send a customer a link to fill
        </Text>
        <Text style={styles.text3}>out the form themselves. Please</Text>
        <Text style={styles.text3}>choose one of the options below.</Text>
        <View
          style={{ flex: 1, width: "95%", marginLeft: "2.5%", marginTop: 40 }}
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
              this.inputRefs.picker3.togglePicker();
            }}
            style={{ ...pickerSelectStyles }}
            ref={el => {
              this.inputRefs.picker3 = el;
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            borderRadius: 5,
            width: "90%",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginTop: 10,
            marginBottom: 0
          }}
        >
          <TextInput
            style={{
              marginHorizontal: 10,
              height: 45,
              backgroundColor: "#efefef"
            }}
            value="https://sepioguard.com/share?ref=Lorem Ipsum Dolor Sit Amet"
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
          title="HOME"
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
          onPressHandler={() => this.setModalVisible(false, 3)}
        />
      </View>
    );

    let modalContent;
    console.log("Set Content -> " + this.state.setContent);
    if (this.state.setContent == 1) {
      console.log("Show Purchase");
      modalContent = purchase;
    } else if (this.state.setContent == 2) {
      console.log("Show Referral");
      modalContent = referral;
    }
    return (
      <Container>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.activityDisplay}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#F3407B" />
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
          onDismiss={() => this.modalClosed()}
        >
          <View style={styles.modalContainer}>{modalContent}</View>
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
            <Text style={styles.text1}>Payment Options</Text>
          </View>
          <View
            style={{ flex: 1, width: "95%", marginLeft: "2.5%", marginTop: 20 }}
          >
            <RNPickerSelect
              placeholder={{
                label: "Select Payment Option...",
                value: null,
                color: "#01396F"
              }}
              items={[
                {
                  value: "449",
                  label: "Single pay - $449"
                },
                {
                  value: "150",
                  label: "Three months - $150"
                },
                {
                  value: "45",
                  label: "12 months - $45"
                }
              ]}
              hideIcon={true}
              onValueChange={value => {
                this.setPaymentOption(value);
              }}
              onUpArrow={() => {
                this.inputRefs.name.focus();
              }}
              onDownArrow={() => {
                this.inputRefs.picker2.togglePicker();
              }}
              style={{ ...pickerSelectStyles }}
              value={this.state.favColor}
              ref={el => {
                this.inputRefs.picker = el;
              }}
            />
          </View>
          <View style={styles.row1}>
            <Text style={styles.text2}>Total Due Today:</Text>
            <Text style={styles.text2}>${this.state.payment}</Text>
          </View>
          <View style={styles.nextBt}>
            <CustomButton
              title="COMPLETE PURCHASE"
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
              onPressHandler={() => this.completePurchase()}
            />
          </View>
          <View style={styles.back}>
            <Text style={styles.steps}>4 of 4</Text>
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
  row: {
    width: "95%",
    height: 50,
    //backgroundColor: "green",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 30
  },
  row1: {
    width: "95%",
    height: 50,
    //backgroundColor: "green",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 30
  },
  back: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
    flex: 2.2
  },
  nextBt: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  select: {
    marginLeft: 15
  },
  selectBox: {
    //backgroundColor: "#efefef",
    //borderRadius: 5,
    marginLeft: "10%"
  },
  arrow: {
    marginRight: 13,
    width: 9,
    height: 9
  },
  powered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#FFF",
    flexDirection: "row",
    width: "100%"
  },
  text1: {
    color: "#01396F",
    fontSize: 24,
    fontFamily: "Avenir",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10
  },
  text2: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10
  },
  text3: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir"
  },
  textPlan: {
    color: "#01396F",
    fontSize: 15,
    fontFamily: "Avenir",
    marginTop: 10,
    marginBottom: 10
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
    width: 120,
    height: 147
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    paddingTop: 20
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
    textAlign: "center",
    width: "100%"
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
    color: "#01396F",
    width: "100%"
  }
});

export default PaymentOptionsScreen;
