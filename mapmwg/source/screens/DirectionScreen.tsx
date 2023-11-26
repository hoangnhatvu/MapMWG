import {
  StyleSheet,
  TextInput,
  View,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import React, {useEffect, useState} from 'react';
import {primaryColor, tertiaryColor} from '../constants/color';
import RootState from '../../redux';
import {useSelector, useDispatch} from 'react-redux';
import {setIsDirected} from '../redux/slices/isDirectedSlide';
import {setIsSearchDirect} from '../redux/slices/isSearchDirectSlice';
import SearchScreen from './SearchScreen';
import DirectionButton from '../components/DirectionButton';
import {setIsSearchBar} from '../redux/slices/isSearchBarSlice';

import {setIsSearch} from '../redux/slices/isSearchSlice';
import {setSearchText} from '../redux/slices/searchTextSlice';
import {
  addSearchDirection,
  initDirectionState,
  removeSearchDirection,
} from '../redux/slices/searchDirectionsSlice';
import {WINDOW_HEIGHT} from '../utils/window_height';

const DirectionScreen = () => {
  const isDirected = useSelector((state: RootState) => state.isDirected.value);
  const isSearchDirect = useSelector(
    (state: RootState) => state.isSearchDirect.value,
  );
  const searchDirections = useSelector(
    (state: RootState) => state.searchDirections.value,
  );
  const slideAnimation = new Animated.Value(0);
  const [viewHeight, setViewHeight] = useState<number>(WINDOW_HEIGHT / 5);
  const [idSearchDirect, setIdSearchDirect] = useState<number>(0);
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
  // const onBackPress() =>{
  // }

  const handleBack = () => {
    dispatch(setIsDirected(false));
    dispatch(setIsSearchDirect(false));
    dispatch(setIsSearchBar(true));
    dispatch(initDirectionState());
    setViewHeight(WINDOW_HEIGHT / 5);
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
            height: viewHeight,
            backgroundColor: primaryColor,
            position: 'absolute',
            elevation: 5,
            top: -100,
          }}>
          <View
            style={{
              flexDirection: 'column',
              position: 'relative',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: 10,
                marginLeft: 14,
              }}>
              <FontAwesome6
                name="arrow-left"
                size={25}
                style={{marginRight: 10, top: 10}}
                onPress={handleBack}
              />
              <View style={{flexDirection: 'column'}}>
                <ScrollView>
                  {searchDirections?.map(value => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 10,
                      }}
                      key={value.id}>
                      <FontAwesome6
                        name={value.id === 0 ? 'circle-dot' : 'location-dot'}
                        style={{
                          marginLeft: 10,
                          width: 15,
                          color: value.id === 0 ? 'blue' : 'red',
                        }}
                        size={15}
                      />
                      <TextInput
                        style={styles.input_text}
                        placeholder={
                          value.id === 0 ? 'Vị trí của bạn' : 'Chọn điểm đến'
                        }
                        value={value.data?.properties?.searchAddress || ''}
                        onPressIn={() => {
                          dispatch(setIsSearchDirect(true));
                          dispatch(setIsDirected(false));
                          setIdSearchDirect(value.id);
                        }}
                      />
                      {value.id > 2 ? (
                        <FontAwesome6
                          name="trash"
                          size={20}
                          style={{
                            position: 'absolute',
                            right: 48,
                            paddingHorizontal: 10,
                            backgroundColor: 'white',
                          }}
                          onPress={() => {
                            dispatch(removeSearchDirection(value.id));
                            setViewHeight(viewHeight - 50);
                          }}
                          color="gray"
                        />
                      ) : null}
                    </View>
                  ))}
                </ScrollView>
              </View>
              <FontAwesome6
                name="circle-plus"
                size={25}
                style={{right: 20, position: 'absolute', bottom: 10}}
                onPress={() => {
                  dispatch(addSearchDirection());
                  setViewHeight(viewHeight + 50);
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

      {isSearchDirect ? <SearchScreen id={idSearchDirect} /> : null}
    </>
  );
};

export default DirectionScreen;

const styles = StyleSheet.create({
  input_text: {
    height: 40,
    width: '75%',
    borderColor: tertiaryColor,
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 15,
    marginVertical: 5,
  },
});
