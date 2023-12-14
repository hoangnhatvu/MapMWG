import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {primaryColor, textColor} from '../constants/color';
import {useDispatch} from 'react-redux';
import {setIsInstructed} from '../redux/slices/isInstructedSlice';
import {setRouteDirection} from '../redux/slices/routeDirectionSlide';
import {setIsLocated} from '../redux/slices/isLocatedSlice';
import Tts from 'react-native-tts';

interface InstructionProps {
  distance: number | null;
  time: number | null;
}

const InstructionSheet: React.FC<InstructionProps> = ({distance, time}) => {
  Tts.setDefaultLanguage('vi-VN');

  const dispatch = useDispatch();

  const close = () => {
    dispatch(setIsInstructed(false));
    dispatch(setIsLocated(true));
    dispatch(setRouteDirection(null));
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={close}>
        <Ionicons name="close-circle-outline" size={55} color={textColor} />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'column',
          marginBottom: 10,
          alignItems: 'center',
          marginLeft: '20%',
        }}>
        <Text style={{color: 'forestgreen', fontWeight: 'bold', fontSize: 32}}>
          {time} min
        </Text>
        <Text style={{color: 'lightgray', fontSize: 18}}>{distance} km</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '12%',
    position: 'absolute',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: primaryColor,
    bottom: 0,
  },
  button: {
    marginHorizontal: 10,
  },
});

export default InstructionSheet;
