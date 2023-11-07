import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import DirectionScreen from '../screens/DirectionScreen';

const DirectionButton = () => {
  const [isDirection, setIsDirection] = useState<boolean>(false);

  const handleViewPress = () => {
    setIsDirection(!isDirection);
  };

  return (
    <View onTouchStart={handleViewPress} style={styles.turn_right}>
      {isDirection && <DirectionScreen />}
      <FontAwesome6 name="diamond-turn-right" size={25} color="white" />
    </View>
  );
};

export default DirectionButton;

const styles = StyleSheet.create({
  turn_right: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
