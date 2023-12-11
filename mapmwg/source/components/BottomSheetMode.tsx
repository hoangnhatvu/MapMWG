import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {CheckBox, Button} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {primaryColor, textColor} from '../constants/color';
import {useSelector, useDispatch} from 'react-redux';
import RootState from '../../redux';
import {setIsInstructed} from '../redux/slices/isInstructedSlice';
import {setRouteDirection} from '../redux/slices/routeDirectionSlide';
import {setIsDirected} from '../redux/slices/isDirectedSlide';
import {
  initDirectionState,
  updateSearchDirection,
} from '../redux/slices/searchDirectionsSlice';
import {setIsLocated} from '../redux/slices/isLocatedSlice';
import Tts from 'react-native-tts';

const BottomSheetMode: React.FC = () => {
  Tts.setDefaultLanguage('vi-VN');

  const dispatch = useDispatch();

  const close = () => {
    dispatch(setIsInstructed(false));
    dispatch(setIsLocated(true));
    dispatch(setRouteDirection(null));
  };

  const [avoidToll, setAvoidToll] = useState(false);
  const [avoidHighway, setAvoidHighway] = useState(false);
  const [avoidFerry, setAvoidFerry] = useState(false);

  useEffect(() => {
    // Handle the changes in avoidToll, avoidHighway, and avoidFerry variables
    // You can dispatch actions or update the state accordingly
  }, [avoidToll, avoidHighway, avoidFerry]);

  const handleApply = () => {
    // Perform actions when the Apply button is pressed
    // You can access the values of avoidToll, avoidHighway, and avoidFerry here
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity style={styles.button} onPress={close}>
          <Ionicons name="close-circle-outline" size={55} color={textColor} />
        </TouchableOpacity>
        <Text>Các tuỳ chọn lái xe</Text>
      </View>
      <View style={styles.optionsContainer}>
        <View style={styles.option}>
          <CheckBox
            checked={avoidToll}
            onPress={() => setAvoidToll(!avoidToll)}
            title="Tránh trạm thu phí"
          />
        </View>
        <View style={styles.option}>
          <CheckBox
            checked={avoidHighway}
            onPress={() => setAvoidHighway(!avoidHighway)}
            title="Tránh đường cao tốc"
          />
        </View>
        <View style={styles.option}>
          <CheckBox
            checked={avoidFerry}
            onPress={() => setAvoidFerry(!avoidFerry)}
            title="Tránh phà"
          />
        </View>
        <Button title="Áp dụng" onPress={handleApply} />
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
  optionsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default BottomSheetMode;
