import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {CheckBox, Button} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {bgColor, lightGray, primaryColor, textColor} from '../constants/color';
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
      <View style={styles.optionsContainer}>
        <View style={{alignItems: 'center'}}>
          <Ionicons name="reorder-two-outline" size={30} color={lightGray} />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={styles.button} onPress={close}>
            <Ionicons name="close-outline" size={40} color={textColor} />
          </TouchableOpacity>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
            Các tuỳ chọn lái xe
          </Text>
        </View>
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
            title="Tránh phà (đi bộ, đạp xe và lái xe)"
          />
        </View>
        <Button
          buttonStyle={{borderRadius: 13}}
          title="Áp dụng"
          titleStyle={{fontSize: 18}}
          onPress={handleApply}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '40%',
    position: 'absolute',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: bgColor,
    bottom: 0,
  },
  button: {
    marginHorizontal: 10,
  },
  optionsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
});

export default BottomSheetMode;
