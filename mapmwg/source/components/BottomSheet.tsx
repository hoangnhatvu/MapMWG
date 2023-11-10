import {WINDOW_HEIGHT} from '../utils/window_height';
import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Animated,
  PanResponder,
  FlatList,
  Text,
  ScrollView,
  Button,
  Pressable,
} from 'react-native';
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from '../constants/color';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const BOTTOM_SHEET_MAX_HEIGHT = WINDOW_HEIGHT * 0.6;
const BOTTOM_SHEET_MIN_HEIGHT = WINDOW_HEIGHT * 0.05;
const MAX_UPWARD_TRANSLATE_Y =
  BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT;
const MAX_DOWNWARD_TRANSLATE_Y = 0;
const DRAG_THRESHOLD = 0;

const BottomSheet = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        animatedValue.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (e, gesture) => {
        animatedValue.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        animatedValue.flattenOffset();

        // lastGestureDy.current += gesture.dy;
        // if (lastGestureDy.current < MAX_UPWARD_TRANSLATE_Y) {
        //   lastGestureDy.current = MAX_UPWARD_TRANSLATE_Y;
        // } else if (lastGestureDy.current > MAX_DOWNWARD_TRANSLATE_Y) {
        //   lastGestureDy.current = MAX_DOWNWARD_TRANSLATE_Y;
        // }

        if (gesture.dy > 0) {
          // draging down
          if (gesture.dy <= DRAG_THRESHOLD) {
            springAnimation('up');
          } else {
            springAnimation('down');
          }
        } else {
          // draging up
          if (gesture.dy >= -DRAG_THRESHOLD) {
            springAnimation('down');
          } else {
            springAnimation('up');
          }
        }
      },
    }),
  ).current;

  const springAnimation = (direction: 'up' | 'down') => {
    lastGestureDy.current =
      direction === 'down' ? MAX_DOWNWARD_TRANSLATE_Y : MAX_UPWARD_TRANSLATE_Y;
    Animated.spring(animatedValue, {
      toValue: lastGestureDy.current,
      useNativeDriver: true,
    }).start();
  };

  const bottomSheetAnimation = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          outputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.bottom__container, bottomSheetAnimation]}>
      <View style={styles.dragable__area} {...panResponder.panHandlers}>
        <View style={styles.drag_handle} />
      </View>
      <View style={styles.content__container}>
        <ScrollView style={styles.button__container} horizontal={true}>
          <Pressable style={styles.button} onPress={() => {}}>
            <FontAwesome6 name="route" size={16} />
            <Text style={styles.text}>Directions</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <FontAwesome6 name="location-arrow" size={16} />
            <Text style={styles.text}>Start</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <FontAwesome6 name="bookmark" size={16} />
            <Text style={styles.text}>Save</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <FontAwesome6 name="share" size={16} />
            <Text style={styles.text}>Share</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <FontAwesome6 name="plus" size={16} />
            <Text style={styles.text}>Post</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <FontAwesome6 name="pen-to-square" size={16} />
            <Text style={styles.text}>Post</Text>
          </Pressable>
        </ScrollView>
        <View>
          
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottom__container: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: BOTTOM_SHEET_MAX_HEIGHT,
    bottom: BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT,
    backgroundColor: primaryColor,
    elevation: 3,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  dragable__area: {
    width: 100,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drag_handle: {
    width: 100,
    height: 6,
    backgroundColor: tertiaryColor,
    borderRadius: 10,
  },
  content__container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  button__container: {
    height: '13%',
    margin: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 8,
    borderRadius: 16,
    borderColor: tertiaryColor,
    borderWidth: 2,
    elevation: 3,
    backgroundColor: primaryColor,
    height: '100%',
    width: 128,
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: textColor,
  },
  item: {
    fontSize: 40,
  },
});

export default BottomSheet;
