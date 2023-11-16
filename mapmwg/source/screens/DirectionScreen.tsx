import {StyleSheet, TextInput, View, Animated, Easing} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import React, {useEffect} from 'react';
import {primaryColor, tertiaryColor} from '../constants/color';
import RootState from '../../redux';
import {useSelector, useDispatch} from 'react-redux';
import {setIsDirected} from '../redux/slices/isDirectedSlide';
import {setIsSearchCurrent} from '../redux/slices/isSearchCurrentSlice';
import {setIsSearchDestination} from '../redux/slices/isSearchDestinationSlice';
import SearchScreen from './SearchScreen';
import DirectionButton from '../components/DirectionButton';
import {setIsSearchBar} from '../redux/slices/isSearchBarSlice';
import { setDestinationInfo } from '../redux/slices/destinationInfoSlice';
import { setCurrentInfo } from '../redux/slices/currentInfoSlice';

const DirectionScreen = () => {
  const isDirected = useSelector((state: RootState) => state.isDirected.value);
  const currentInfo = useSelector(
    (state: RootState) => state.currentInfo.value,
  );
  const destinationInfo = useSelector(
    (state: RootState) => state.destinationInfo.value,
  );
  const isSearch = useSelector((state: RootState) => state.isSearch.value);
  const isSearchCurrent = useSelector(
    (state: RootState) => state.isSearchCurrent.value,
  );
  const isSearchDestination = useSelector(
    (state: RootState) => state.isSearchDestination.value,
  );
  const searchText = useSelector((state: RootState) => state.searchText.value);
  const slideAnimation = new Animated.Value(0);
  const dispatch = useDispatch();

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isDirected]);

  const slideDown = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 100],
  });

  const slideUp = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -200],
  });
  const handleBack = () => {
    dispatch(setIsDirected(false));
    dispatch(setIsSearchCurrent(false));
    dispatch(setIsSearchDestination(false));
    dispatch(setIsSearchBar(true));
    dispatch(setDestinationInfo(null));
    dispatch(setCurrentInfo(null));
  };

  const handleOnPress = () => {
    dispatch(setIsDirected(true));
    dispatch(setIsSearchBar(false));
  };

  return (
    <>
      <DirectionButton onPress={handleOnPress} />
      {isDirected && (
        <Animated.View
          style={{
            transform: isDirected
              ? [{translateY: slideDown}]
              : [{translateY: slideUp}],
            width: '100%',
            height: '20%',
            backgroundColor: primaryColor,
            position: 'absolute',
            elevation: 5,
            top: -100,
          }}>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                marginLeft: 10,
              }}>
              <FontAwesome6
                name="arrow-left"
                size={25}
                style={{marginRight: 10}}
                onPress={handleBack}
              />
              <FontAwesome6
                name="circle-dot"
                style={{marginLeft: 10, color: 'blue'}}
              />
              <TextInput
                style={styles.input_text}
                placeholder="Vị trí của bạn"
                value={currentInfo?.properties?.searchAddress}
                focusable={false}
                onPressIn={() => {
                  dispatch(setIsSearchCurrent(true));
                  dispatch(setIsDirected(false));
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
              }}>
              <FontAwesome6
                name="location-dot"
                size={20}
                style={{marginLeft: 40, color: 'red'}}
              />
              <TextInput
                style={[styles.input_text, {marginLeft: 12}]}
                placeholder="Chọn điểm đến"
                value={destinationInfo?.properties?.searchAddress}
                onPressIn={() => {
                  dispatch(setIsSearchDestination(true));
                  dispatch(setIsDirected(false));
                }}
              />
            </View>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}>
              <FontAwesome6 name="car" size={20} style={{marginRight: 10}} />
              <FontAwesome6
                name="motorcycle"
                size={20}
                style={{marginRight: 10}}
              />
              <FontAwesome6
                name="truck-fast"
                size={20}
                style={{marginRight: 10}}
              />
              <FontAwesome6
                name="person-walking"
                size={25}
                style={{marginRight: 10}}
              />
            </View>
          </View>
        </Animated.View>
      )}

      {isSearchCurrent || isSearchDestination ? <SearchScreen /> : <></>}
    </>
  );
};

export default DirectionScreen;

const styles = StyleSheet.create({
  input_text: {
    height: 40,
    width: '65%',
    borderColor: tertiaryColor,
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 15,
    marginVertical: 5,
  },
});
