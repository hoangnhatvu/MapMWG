import {StyleSheet, TextInput, View, Animated, Easing} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import React, {useState, useEffect} from 'react';
import DirectionButton from '../components/DirectionButton';
import BottomSheet from '../components/BottomSheet';
import {primaryColor, tertiaryColor} from '../constants/color';

const DirectionScreen = () => {
  const [showView, setShowView] = useState(false);
  const slideAnimation = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [showView]);

  const slideDown = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 100],
  });

  const slideUp = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -200],
  });
  const handleBack = () => {
    setShowView(false);
  };

  const handleOnPress = () => {
    setShowView(true);
  };

  return (
    <>
      <DirectionButton onPress={handleOnPress} />

      <Animated.View
        style={{
          transform: showView
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
            <TextInput style={styles.input_text} placeholder="Vị trí của bạn" />
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
      <BottomSheet />
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
