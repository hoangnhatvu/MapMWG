import {WINDOW_HEIGHT} from '../utils/window_height';
import React, {useRef, useState, useEffect} from 'react';
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
  TouchableOpacity,
} from 'react-native';
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from '../constants/color';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {setRouteDirection} from '../redux/slices/routeDirectionSlide';
import {createRouterLine} from '../services/createRoute';
import {useDispatch, useSelector} from 'react-redux';
import RootState from '../../redux';
import { setIsInstructed } from '../redux/slices/isInstructedSlice';
import { setIsDirected } from '../redux/slices/isDirectedSlide';
import { setIsSearch } from '../redux/slices/isSearchSlice';
import { callRoutingAPI } from '../services/fetchAPI';
import { setInstructions } from '../redux/slices/instructionsSlice';

const BOTTOM_SHEET_MAX_HEIGHT = WINDOW_HEIGHT * 0.4;
const BOTTOM_SHEET_MIN_HEIGHT = WINDOW_HEIGHT * 0.05;
const MAX_UPWARD_TRANSLATE_Y =
  BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT;
const MAX_DOWNWARD_TRANSLATE_Y = 0;
const DRAG_THRESHOLD = 0;

interface BottomSheetProps {
  name?: string;
  address?: string;
  getRoute?: () => void;
  start?: () => void;
  currentLocation: [number, number] | any;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  name,
  address,
  getRoute,
  start,
  currentLocation,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const [distance, setDistance] = useState<number | null>(null);


  const isInstructed = useSelector(
    (state: RootState) => state.isInstructed.value,
  );
  const isDirected = useSelector(
    (state: RootState) => state.isDirected.value,
  );
  const isSearch = useSelector(
    (state: RootState) => state.isSearch.value,
  );
  const destination = useSelector(
    (state: RootState) => state.destination.value,
  );
  const routeDirection = useSelector(
    (state: RootState) => state.routeDirection.value,
  );

  const dispatch = useDispatch();

  const getData = async () => {
    const data = await callRoutingAPI(currentLocation, destination);
    dispatch(
      setInstructions(
        data.Data?.features[0]?.properties?.segments[0]?.steps,
      ),
    );
    setDistance(data.Data.features[0].properties.summary.distance);
  }

  useEffect(() => {
    getData();
  }, []);


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

  const makeRoute = async () => {
    if (!destination) {
      return null;
    }

    const route = await createRouterLine(currentLocation, destination);
    dispatch(setIsDirected(true));
    dispatch(setRouteDirection(route));
  };

  const instruct = async () => {
    try {
      if (!routeDirection) {
        await makeRoute();
      }

      dispatch(setIsSearch(false));
      dispatch(setIsInstructed(true));

      
      
    } catch (error) {
      console.error("Can't make route: " + error);
      return null;
    }
  };

  return (
    <Animated.View style={[styles.bottom__container, bottomSheetAnimation]}>
      <View style={styles.dragable__area} {...panResponder.panHandlers}>
        <View style={styles.drag_handle} />
      </View>
      <View style={styles.content__container}>
        <View style={styles.button__container}>
          <ScrollView
            style={{}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.button} onPress={makeRoute}>
              <FontAwesome6 name="route" size={16} />
              <Text style={styles.text}>Đường đi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={instruct}>
              <FontAwesome6 name="location-arrow" size={16} />
              <Text style={styles.text}>Bắt đầu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <FontAwesome6 name="bookmark" size={16} />
              <Text style={styles.text}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <FontAwesome6 name="share" size={16} />
              <Text style={styles.text}>Chia sẻ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <FontAwesome6 name="plus" size={16} />
              <Text style={styles.text}>Đăng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <FontAwesome6 name="pen-to-square" size={16} />
              <Text style={styles.text}>Post</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={{marginHorizontal: 8}}>
          <Text style={{fontSize: 32, fontWeight: 'bold'}}>{name || null}</Text>
          <Text style={{fontSize: 16}}>{address || null}</Text>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <FontAwesome6 name="car" size={16} />
            <Text style={{fontSize: 16, marginLeft: 8}}>{distance} km</Text>
          </View>
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
    alignItems: 'center',
  },
  button__container: {
    marginTop: 20,
    height: 80,
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
    height: 40,
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
