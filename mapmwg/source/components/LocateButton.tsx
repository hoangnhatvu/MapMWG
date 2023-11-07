import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {primaryColor} from '../constants/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

interface LocateButtonProps {
  isLocated: boolean;
  onPress: () => void;
}
const LocateButton: React.FC<LocateButtonProps> = ({isLocated, onPress}) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isPressed ? '#f9f9f9' : primaryColor,
        },
      ]}
      onTouchStart={() => {
        onPress();
        setIsPressed(true);
      }}
      onTouchEnd={() => {
        setIsPressed(false);
      }}
      >

      {isLocated ? (
        <FontAwesome6 name="location-crosshairs" size={30} color="#1A73E8" />
      ) : (
        <Ionicons name="locate" size={30} color="gray"/>
      )}
    </View>
  );
};

export default LocateButton;

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
    bottom: '12%',
    right: '5%',
    zIndex: 1,
    elevation: 1.5,
  },
});
