import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {primaryColor, textColor} from '../constants/color';
import {useSelector, useDispatch} from 'react-redux';
import RootState from '../../redux';
import {setIsInstructed} from '../redux/slices/isInstructedSlice';
import {setRouteDirection} from '../redux/slices/routeDirectionSlide';
import {setDestination} from '../redux/slices/destinationSlice';
import {setIsDirected} from '../redux/slices/isDirectedSlide';

interface InstructionProps {
  distance: number | null;
  time: number | null;
}

const InstructionSheet: React.FC<InstructionProps> = ({distance, time}) => {
  const isInstructed = useSelector(
    (state: RootState) => state.isInstructed.value,
  );
  const isDirected = useSelector((state: RootState) => state.isDirected.value);
  const isSearch = useSelector((state: RootState) => state.isSearch.value);
  const destination = useSelector(
    (state: RootState) => state.destination.value,
  );
  const routeDirection = useSelector(
    (state: RootState) => state.routeDirection.value,
  );

  const dispatch = useDispatch();

  const close = () => {
    dispatch(setIsInstructed(false));
    dispatch(setRouteDirection(null));
    dispatch(setDestination(null));
    dispatch(setIsDirected(false));
  };

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
        }}>
        <Text style={{color: 'forestgreen', fontWeight: 'bold', fontSize: 32}}>
          {time} min
        </Text>
        <Text style={{color: 'lightgray', fontSize: 18}}>{distance} km</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={close}>
          <Ionicons
            name="chevron-up-circle-outline"
            size={55}
            color={textColor}
          />
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: primaryColor,
    bottom: 0,
  },
  button: {
    marginHorizontal: 10,
  },
});

export default InstructionSheet;
