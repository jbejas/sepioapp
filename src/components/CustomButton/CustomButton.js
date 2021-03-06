import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class CustomButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.touchableOpacity, { width: this.props.width }]}
        onPress={this.props.onPressHandler}
      >
        <View
          style={
            ([styles.listItem],
            {
              backgroundColor: this.props.bgColor,
              paddingTop: this.props.paddingTop,
              paddingRight: this.props.paddingRight,
              paddingBottom: this.props.paddingBottom,
              paddingLeft: this.props.paddingLeft,
              marginTop: this.props.marginTop,
              marginRight: this.props.marginRight,
              marginBottom: this.props.marginBottom,
              marginLeft: this.props.marginLeft,
              borderRadius: this.props.borderRadius,
              alignItems: this.props.textAlign,
              borderColor: this.props.borderColor,
              borderWidth: this.props.borderWidth,
            })
          }
        >
          <Text style={[styles.text, { color: this.props.color, fontWeight: this.props.fontWeight, fontFamily: this.props.fontFamily, fontSize: this.props.fontSize }]}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  listItem: {
    width: '100%',
    padding: 10,
    margin: 5,
    backgroundColor: '#eee',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000'
  },
  touchableOpacity: {
    width: '100%',
  },
  text: {
    color: 'white',
    fontWeight: 'normal',
  },
});

export default CustomButton;