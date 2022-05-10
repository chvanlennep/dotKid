import React from "react";
import { StyleSheet } from "react-native";

import Icon from "../Icon";
import colors from "../../config/colors";

const SmallButton = ({ name }) => {
  return (
    <Icon
      name={name}
      width={40}
      height={40}
      borderRadius={5}
      backgroundColor={colors.medium}
    ></Icon>
  );
};

export default SmallButton;

const styles = StyleSheet.create({});
