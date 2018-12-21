import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Navigation } from "react-native-navigation";
import Image from "react-native-remote-svg";

import logo from "../../assets/images/logo.svg";
import home from "../../assets/images/home.svg";
import referrals from "../../assets/images/referrals.svg";
import customers from "../../assets/images/customers.svg";
import settings from "../../assets/images/settings.svg";
import logout from "../../assets/images/logout.svg";

class MenuScreen extends Component {
  goToScreen = screenName => {
    console.log("Screen Name -> " + screenName);
    console.log("Component ID -> " + this.props.componentId);
    Navigation.push(this.props.componentId, {
      component: {
        name: screenName
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.menuHeader}>
          <Image style={styles.avatar} source={logo} />
          <Text style={styles.username}>Chris Jhonson</Text>
        </View>
        <View style={styles.menuContainer}>
          <View style={styles.menuItem}>
            <Image style={styles.imageIcon} source={home} />
            <Text style={styles.menuText} onPress={() => console.log("Home")}>
              Home
            </Text>
          </View>
          <View style={styles.menuItem}>
            <Image style={styles.imageIcon} source={referrals} />
            <Text
              style={styles.menuText}
              onPress={this.goToScreen("LoginScreen")}
            >
              Referrals
            </Text>
          </View>
          <View style={styles.menuItem}>
            <Image style={styles.imageIcon} source={customers} />
            <Text
              style={styles.menuText}
              onPress={this.goToScreen("LoginScreen")}
            >
              Customers
            </Text>
          </View>
          <View style={styles.menuItem}>
            <Image style={styles.imageIcon} source={settings} />
            <Text
              style={styles.menuText}
              onPress={this.goToScreen("LoginScreen")}
            >
              Settings
            </Text>
          </View>
          <View style={styles.menuItem}>
            <Image style={styles.imageIcon} source={logout} />
            <Text
              style={styles.menuText}
              onPress={this.goToScreen("LoginScreen")}
            >
              Logout
            </Text>
          </View>
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
