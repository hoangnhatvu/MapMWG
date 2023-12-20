import {Pressable, StyleSheet, View, Text} from 'react-native';
import React, {useState} from 'react';
import {primaryColor} from '../constants/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

interface Moving3DButtonProps {
  onPress: () => void;
  is3D: boolean;
}

const Moving3DButton: React.FC<Moving3DButtonProps> = ({onPress, is3D}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: is3D ? '#f9f9f9' : primaryColor,
        },
      ]}>
      <Pressable onPress={onPress}>
        {is3D ? (
          <View>
            <Text>3D</Text>
          </View>
        ) : (
          <View>
            <Text>2D</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default Moving3DButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: primaryColor,
    bottom: '22%',
    right: '5%',
    zIndex: 1,
    elevation: 1.5,
  },
});
