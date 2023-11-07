import {StyleSheet, View} from 'react-native';
import React from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

interface DirectionButtonProps {
  onPress: () => void;
}

const DirectionButton: React.FC<DirectionButtonProps> = ({onPress}) => {
  return (
    <View onTouchStart={onPress} style={styles.turn_right}>
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
