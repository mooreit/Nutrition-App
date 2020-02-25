import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";


import {useNavigation} from '@react-navigation/native';

function MaterialButtonSuccess(props) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={[styles.container, props.style]}
      onPress={() => {navigation.navigate('Create Profile')}}
    >
      <Text style={styles.caption}>Join now</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(248,186,28,1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 16,
    paddingLeft: 16,
    elevation: 2,
    minWidth: 88,
    borderRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 5
  },
  caption: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "roboto-700"
  }
});

export default MaterialButtonSuccess;
