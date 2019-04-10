import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Alert,
  FlatList,
  Linking,
  Platform,
  Modal,
  ActivityIndicator,
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
import moment from "moment";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Icon } from "react-native-elements";
import { Navigation } from "react-native-navigation";
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
    customers: [],
    companies: [],
    salespersons: []
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

    fetch("https://sepioguard-test-api.herokuapp.com/v1/salesperson", {
      method: "GET",
      credentials: "include"
    })
      .then(response => {
        //console.log("Response Salespersons", response._bodyText);
        let c = JSON.parse(response._bodyText);
        this.setState(prevState => {
          return {
            ...prevState,
            salespersons: c
          };
        });
      })
      .catch(error => {
        console.log("Error retrieveing Salespersons.", error);
      });

    fetch("https://sepioguard-test-api.herokuapp.com/v1/company", {
      method: "GET",
      credentials: "include"
    })
      .then(response => {
        //console.log("Response Companies", response._bodyText);
        let c = JSON.parse(response._bodyText);
        this.setState(prevState => {
          return {
            ...prevState,
            companies: c
          };
        });
      })
      .catch(error => {
        console.log("Error retrieveing Companies.", error);
      });

    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM login WHERE ID = 1",
        [],
        (tx, results) => {
          console.log("Login Results", results.rows.item(0));
          if (results.rows.item(0).uid) {
            fetch("https://sepioguard-test-api.herokuapp.com/v1/customer", {
              method: "GET",
              credentials: "include"
            })
              .then(response => {
                let c = JSON.parse(response._bodyText);

                console.log("Response Customers", c);
                let customers = [];

                for (var i = 0; i < c.length; i++) {
                  var formattedTime = moment(
                    parseInt(c[i]["createdAt"])
                  ).format("MM/DD/YYYY");

                  //console.log("DATE -> " + formattedTime);

                  if (c[i].salesperson == results.rows.item(0).uid) {
                    //if (c[i].vendor == results.rows.item(0).employer) {
                    customers.push({
                      key: c[i]["id"],
                      firstName: c[i]["firstName"],
                      lastName: c[i]["lastName"],
                      emailAddress: c[i]["emailAddress"],
                      createdOn: formattedTime,
                      phone: c[i]["phone"],
                      isFunded: c[i]["isFunded"],
                      hasSepio: c[i]["hasSepio"],
                      vendor: c[i]["vendor"],
                      salesperson: c[i]["salesperson"]
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
                  customers.sort(function(a, b) {
                    var keyA = a.updatedAt,
                      keyB = b.updatedAt;
                    // Compare the 2 dates
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                  });
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
        },
        err => {
          console.log("Error checking login existence", err);
        }
      );
    });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
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

  sendSMS = (
    number,
    hasSepio,
    isFunded,
    salesperson,
    vendor,
    firstName,
    lastName,
    customerid
  ) => {
    console.log("Send SMS");
    console.log("Has Sepio -> " + hasSepio);
    console.log("Is Funded -> " + isFunded);
    console.log("Customers", this.state.customers);
    console.log("Sales Persons", this.state.salespersons);
    console.log("Companies", this.state.companies);
    console.log("Sale Person -> " + salesperson);
    console.log("Vendor -> " + vendor);

    let salesperson_data = false;
    let salesperson_id = false;

    for (let i = 0; i < this.state.salespersons.length; i++) {
      console.log(this.state.salespersons[i].id + " -> " + salesperson);
      if (this.state.salespersons[i].id == salesperson) {
        salesperson_data = this.state.salespersons[i].fullName;
        salesperson_id = this.state.salespersons[i].id;
      }
    }

    for (let i = 0; i < this.state.companies.length; i++) {
      console.log(this.state.companies[i].id + " -> " + vendor);
      if (this.state.companies[i].id == vendor) {
        company_data = this.state.companies[i].name;
        company_id = this.state.companies[i].id;
      }
    }

    if (Platform.OS === "ios") {
      if (isFunded && !hasSepio) {
        console.log("Is Funded -> No Sepio");
        Linking.openURL(
          "sms:" +
            number +
            "&body=" +
            firstName +
            ", this is " +
            salesperson_data +
            " from " +
            company_data +
            ". I was looking over your plans and noticed that you don’t have an Out of Area Protection plan. Out of Area Protection ensures that if death occurs 75 miles or more away from home you’ll be brought back with no additional cost falling onto your loved ones. It’s a one-time purchase for a lifetime of worldwide protection. Click on this link [https://store.sepioguard.com] to get Out of Area Protection included in your plans. Please do not hesitate to reach out with any questions about this service or anything else."
        );
      }
      if (!isFunded && !hasSepio) {
        console.log("No Fundes -> No Sepio");
        Linking.openURL(
          "sms:" +
            number +
            "&body=" +
            firstName +
            ", this is " +
            salesperson_data +
            " from " +
            company_data +
            ". I was recently reviewing your file and whether you decide to pre-fund your plans or not, we highly recommend purchasing an Out of Area Protection plan. This ensures that if death occurs 75 miles or more away from home you will be brought back with no additional out of pocket costs left to your loved ones. We include this protection in our funded plans, but you are able to purchase it by itself as well. It’s just a one-time fee for a lifetime of worldwide protection. Click on this link [https://store.sepioguard.com] to find out more and include this protection in your plan. Please do not hesitate to text or call me with any additional questions."
        );
      }
      if (isFunded && hasSepio) {
        console.log("Funded -> Sepio");
        Linking.openURL(
          "sms:" +
            number +
            "&body=" +
            firstName +
            ", this is " +
            salesperson_data +
            " from " +
            company_data +
            ". I wanted to reach out and let you know about our referral program! If you send this link [https://store.sepioguard.com?ref=" +
            customerid +
            "&sid=" +
            salesperson_id +
            ", you’ll be credited with the signup and receive compensation for the referral. We appreciate you looking out for your friends and family. They will be grateful you did too. Please do not hesitate to reach out with any questions about this program or anything else."
        );
      }
    } else {
      if (isFunded && !hasSepio) {
        Linking.openURL(
          "sms:" +
            number +
            "?body=body=" +
            firstName +
            ", this is " +
            salesperson_data +
            " from " +
            company_data +
            ". I was looking over your plans and noticed that you don’t have an Out of Area Protection plan. Out of Area Protection ensures that if death occurs 75 miles or more away from home you’ll be brought back with no additional cost falling onto your loved ones. It’s a one-time purchase for a lifetime of worldwide protection. Click on this link [https://store.sepioguard.com] to get Out of Area Protection included in your plans. Please do not hesitate to reach out with any questions about this service or anything else."
        );
      }
      if (!isFunded && !hasSepio) {
        Linking.openURL(
          "sms:" +
            number +
            "?body=" +
            firstName +
            ", this is " +
            salesperson_data +
            " from " +
            company_data +
            ". I was recently reviewing your file and whether you decide to pre-fund your plans or not, we highly recommend purchasing an Out of Area Protection plan. This ensures that if death occurs 75 miles or more away from home you will be brought back with no additional out of pocket costs left to your loved ones. We include this protection in our funded plans, but you are able to purchase it by itself as well. It’s just a one-time fee for a lifetime of worldwide protection. Click on this link [https://store.sepioguard.com] to find out more and include this protection in your plan. Please do not hesitate to text or call me with any additional questions."
        );
      }
      if (isFunded && hasSepio) {
        Linking.openURL(
          "sms:" +
            number +
            "?body=" +
            firstName +
            ", this is " +
            salesperson_data +
            " from " +
            company_data +
            ". I wanted to reach out and let you know about our referral program! If you send this link [https://store.sepioguard.com?ref=" +
            customerid +
            "&sid=" +
            salesperson_id +
            ", you’ll be credited with the signup and receive compensation for the referral. We appreciate you looking out for your friends and family. They will be grateful you did too. Please do not hesitate to reach out with any questions about this program or anything else."
        );
      }
    }
  };

  sendEmail = (
    email,
    hasSepio,
    isFunded,
    salesperson,
    vendor,
    firstName,
    lastName,
    customerid
  ) => {
    console.log("Send Email");

    let salesperson_data = false;
    let salesperson_id = false;
    let salesperson_phone = false;
    let salesperson_email = false;

    for (let i = 0; i < this.state.salespersons.length; i++) {
      console.log(this.state.salespersons[i].id + " -> " + salesperson);
      if (this.state.salespersons[i].id == salesperson) {
        salesperson_name = this.state.salespersons[i].fullName;
        salesperson_phone = this.state.salespersons[i].phone;
        salesperson_email = this.state.salespersons[i].emailAddress;
        salesperson_id = this.state.salespersons[i].id;
      }
    }

    for (let i = 0; i < this.state.companies.length; i++) {
      console.log(this.state.companies[i].id + " -> " + vendor);
      if (this.state.companies[i].id == vendor) {
        company_name = this.state.companies[i].name;
        company_id = this.state.companies[i].id;
      }
    }

    if (Platform.OS === "ios") {
      /*if (isFunded && !hasSepio) {
        Linking.openURL(
          "mailto:" +
            email +
            "?subject=Contact from Sepio&body=Dear " +
            lastName +
            " Family,\nI hope this letter finds you well. I am reaching out to you regarding Out of Area Protection, an important enhancement to the prearrangement you have made with {{company.name}}. It ensures that if you pass away more than 75 miles from home, your remains will be transported back to {{company.name}} at no cost to your loved ones.\nUnfortunately, we did not have this option available last time we met. Now that we include this in all of our burial and cremation plans, I want to extend this same protection to you.\nEvery year we serve families who experience the loss of a loved one while away from home. When a death occurs away from home, the additional cost can be as much as $5,000 — or more if it occurs outside the country. But we’re offering this protection for a one-time cost of only $449, or a monthly payment plan of $45 per month for 12 months. It will cover you anywhere you go for the rest of your life.\nWe encourage everyone to take advantage of this cost-saving option. It only takes a few minutes to add to your arrangements, but the protection lasts a lifetime.I will be reaching out to you to answer any questions. In the meantime, here is a link to get protected now:\nhttps://store.sepioguard.com?sid={{salesperson.id}}\nRegards,\n" +
            salesperson_name +
            "\n" +
            company_name +
            "\n" +
            salesperson_phone +
            "\n" +
            salesperson.emailAddress
        );
      } else {
        Linking.openURL(
          "mailto:" +
            email +
            "?subject=Contact from Sepio&body=Dear " +
            lastName +
            " Family,"
        );
      }*/

      Linking.openURL(
        "mailto:" +
          email +
          "?subject=Contact from Sepio&body=Dear " +
          lastName +
          " Family,"
      );
    } else {
      /*if (isFunded && !hasSepio) {
        Linking.openURL(
          "mailto:" +
            email +
            "?subject=Contact from Sepio&body=Dear " +
            lastName +
            " Family,\nI hope this letter finds you well. I am reaching out to you regarding Out of Area Protection, an important enhancement to the prearrangement you have made with {{company.name}}. It ensures that if you pass away more than 75 miles from home, your remains will be transported back to {{company.name}} at no cost to your loved ones.\nUnfortunately, we did not have this option available last time we met. Now that we include this in all of our burial and cremation plans, I want to extend this same protection to you.\nEvery year we serve families who experience the loss of a loved one while away from home. When a death occurs away from home, the additional cost can be as much as $5,000 — or more if it occurs outside the country. But we’re offering this protection for a one-time cost of only $449, or a monthly payment plan of $45 per month for 12 months. It will cover you anywhere you go for the rest of your life.\nWe encourage everyone to take advantage of this cost-saving option. It only takes a few minutes to add to your arrangements, but the protection lasts a lifetime.I will be reaching out to you to answer any questions. In the meantime, here is a link to get protected now:\nhttps://store.sepioguard.com?sid={{salesperson.id}}\nRegards,\n" +
            salesperson_name +
            "\n" +
            company_name +
            "\n" +
            salesperson_phone +
            "\n" +
            salesperson.emailAddress
        );
      } else {
        Linking.openURL(
          "mailto:" +
            email +
            "?subject=Contact from Sepio&body=Dear " +
            lastName +
            " Family,"
        );
      }*/

      Linking.openURL(
        "mailto:" +
          email +
          "?subject=Contact from Sepio&body=Dear " +
          lastName +
          " Family,"
      );
    }
  };

  showSepio = state => {
    if (state) {
      return (
        <Col size={10}>
          <View>
            <Image
              style={{
                width: 20,
                height: 20
              }}
              source={require("../../assets/images/logo.png")}
              resizeMode="contain"
            />
          </View>
        </Col>
      );
    } else {
      return (
        <Col size={10}>
          <View>
            <Image
              style={{
                width: 20,
                height: 20,
                opacity: 0.4
              }}
              source={require("../../assets/images/logo.png")}
              resizeMode="contain"
            />
          </View>
        </Col>
      );
    }
  };

  showDollar = state => {
    if (state) {
      return (
        <Col size={10}>
          <View>
            <Image
              style={{
                width: 18,
                height: 18,
                marginTop: 2
              }}
              source={require("../../assets/images/dollar.png")}
              resizeMode="contain"
            />
          </View>
        </Col>
      );
    } else {
      return (
        <Col size={10}>
          <View>
            <Image
              style={{
                width: 18,
                height: 18,
                marginTop: 2,
                opacity: 0.4
              }}
              source={require("../../assets/images/dollar.png")}
              resizeMode="contain"
            />
          </View>
        </Col>
      );
    }
  };

  render() {
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
            <Text style={styles.text1}>Customers</Text>
          </View>
          <View style={styles.planSelectors}>
            <FlatList
              style={styles.customerList}
              data={this.state.customers}
              renderItem={({ item }) => (
                <View style={styles.customer}>
                  <Grid>
                    <Row>
                      <Col size={55}>
                        <Grid>
                          <Row>
                            <Col>
                              <Grid>
                                <Col size={80}>
                                  <Text style={styles.customerText}>
                                    {item.firstName} {item.lastName}
                                  </Text>
                                </Col>
                                {this.showSepio(item.hasSepio)}
                                {this.showDollar(item.isFunded)}
                              </Grid>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Text style={styles.customerEmail}>
                                {item.emailAddress}
                              </Text>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Text style={styles.customerEmail}>
                                Signup Date: {item.createdOn}
                              </Text>
                            </Col>
                          </Row>
                        </Grid>
                      </Col>
                      <Col size={15}>
                        <Icon
                          name="phone"
                          color="#517fa4"
                          containerStyle={{ marginTop: 8 }}
                          onPress={() => this.makeCall(item.phone)}
                        />
                      </Col>
                      <Col size={15}>
                        <Icon
                          name="textsms"
                          color="#517fa4"
                          containerStyle={{ marginTop: 8 }}
                          onPress={() =>
                            this.sendSMS(
                              item.phone,
                              item.hasSepio,
                              item.isFunded,
                              item.salesperson,
                              item.vendor,
                              item.firstName,
                              item.lastName,
                              item.key
                            )
                          }
                        />
                      </Col>
                      <Col size={15}>
                        <Icon
                          name="mail"
                          color="#517fa4"
                          containerStyle={{ marginTop: 6 }}
                          onPress={() =>
                            this.sendEmail(
                              item.emailAddress,
                              item.hasSepio,
                              item.isFunded,
                              item.salesperson,
                              item.vendor,
                              item.firstName,
                              item.lastName,
                              item.key
                            )
                          }
                        />
                      </Col>
                    </Row>
                  </Grid>
                </View>
              )}
            />
          </View>
          <View style={styles.powered} />
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
