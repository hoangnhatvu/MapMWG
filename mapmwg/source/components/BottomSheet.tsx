import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/window_height';
import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  FlatList,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {primaryColor, tertiaryColor, textColor} from '../constants/color';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {setRouteDirection} from '../redux/slices/routeDirectionSlide';
import {
  createMultipleRouterLine,
  createRouterLine,
} from '../services/createRoute';
import {useDispatch, useSelector} from 'react-redux';
import RootState from '../../redux';
import {setIsInstructed} from '../redux/slices/isInstructedSlice';
import {setIsSearch} from '../redux/slices/isSearchSlice';
import {callRoutingAPI} from '../services/fetchAPI';
import {setInstructions} from '../redux/slices/instructionsSlice';
import {initDirectionState} from '../redux/slices/searchDirectionsSlice';
import {setIsLocated} from '../redux/slices/isLocatedSlice';
import {setTransportation} from '../redux/slices/transportationSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {setChosenRouteIndex} from '../redux/slices/chosenRouteSlice';
import {useToastMessage} from '../services/toast';
import {setIsLoading} from '../redux/slices/isLoadingSlice';

const BOTTOM_SHEET_MAX_HEIGHT = WINDOW_HEIGHT * 0.4;
const BOTTOM_SHEET_MIN_HEIGHT = WINDOW_HEIGHT * 0.06;
const MAX_UPWARD_TRANSLATE_Y =
  BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT;
const MAX_DOWNWARD_TRANSLATE_Y = 0;
const DRAG_THRESHOLD = 0;

interface BottomSheetProps {
  getRoute?: () => void;
  start?: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({getRoute, start}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [routeNumbers, setRouteNumbers] = useState<number>(0);
  const [selectedButton, setSelectedButton] = useState<string>('');
  const {showToast} = useToastMessage();

  const transportations = [
    {id: 'motorcycle', label: 'Motorcycle', icon: 'bicycle-sharp'},
    {id: 'hgv', label: 'Truck', icon: 'car-sharp'},
  ];

  // const transportations = [
  //   {id: 'walking', label: 'Walking', icon: 'walk-sharp'},
  //   {id: 'motorcycle', label: 'Motorcycle', icon: 'bicycle-sharp'},
  //   {id: 'car', label: 'Car', icon: 'car-sport-sharp'},
  //   {id: 'hgv', label: 'Truck', icon: 'car-sharp'},
  // ];

  const routeDirection = useSelector(
    (state: RootState) => state.routeDirection.value,
  );
  const searchDirections = useSelector(
    (state: RootState) => state.searchDirections.value,
  );
  const transportation = useSelector(
    (state: RootState) => state.transportation.value,
  );
  const chosenRouteIndex = useSelector(
    (state: RootState) => state.chosenRouteIndex.value,
  );

  const isLoading = useSelector((state: RootState) => state.isLoading.value);

  const dispatch = useDispatch();

  useEffect(() => {
    setName(
      searchDirections[1]?.data?.properties?.searchName ||
        searchDirections[1]?.data?.object?.searchName ||
        'Chưa có dữ liệu trên hệ thống',
    );
    setAddress(
      searchDirections[1]?.data?.properties?.searchAddress ||
        searchDirections[1]?.data?.object?.searchAddress ||
        'Chưa có dữ liệu trên hệ thống',
    );
    const getData = async () => {
      try {
        dispatch(setIsLoading({key: 'bottom_sheet', value: true}));
        const data = await callRoutingAPI(
          searchDirections[0].coordinates,
          searchDirections[1].coordinates,
          transportation,
        );
        dispatch(
          setInstructions(
            data.Data?.features[0]?.properties?.segments[0]?.steps,
          ),
        );
        try {
          setDistance(data.Data?.features[0]?.properties?.summary?.distance);
          setDuration(data.Data?.features[0]?.properties?.summary?.duration);
        } catch (error) {
          throw new Error('Không tìm thấy tuyến đường !');
        }
      } catch (error) {
        showToast(`${error}`, 'danger');
      } finally {
        dispatch(setIsLoading({key: 'bottom_sheet', value: false}));
      }
    };
    getData();
  }, [searchDirections[0].coordinates, searchDirections[1].coordinates]);

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

  useEffect(() => {
    springAnimation('up');
  }, []);

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
    try {
      dispatch(setIsLoading({key: 'common', value: true}));
      if (duration && distance) {
        if (searchDirections[1].coordinates) {
          const route = await createMultipleRouterLine(
            searchDirections[0].coordinates,
            searchDirections[1].coordinates,
            transportation,
          );

          if (route) {
            setRouteNumbers(route.length);
            dispatch(setRouteDirection(route));
          } else {
            throw new Error('Không thể tạo đường đi !');
          }
        } else {
          throw new Error('Không thể tạo đường đi !');
        }
        setSelectedButton('route');
      } else {
        throw new Error('Không tìm thấy tuyến đường !');
      }
    } catch (error: any) {
      showToast(`${error}`, 'danger');
      throw new Error('Có lỗi xảy ra !');
    } finally {
      dispatch(setIsLoading({key: 'common', value: false}));
    }
  };

  const instruct = async () => {
    try {
      dispatch(setIsLoading({key: 'common', value: true}));
      if (duration && distance) {
        if (!routeDirection) {
          await makeRoute();
        }
        dispatch(setIsSearch(false));
        dispatch(setIsInstructed(true));
        dispatch(setIsLocated(false));
      } else {
        throw new Error('Không tìm thấy tuyến đường !');
      }
      setSelectedButton('start');
    } catch (error: any) {
      showToast(`${error}`, 'danger');
      return null;
    } finally {
      dispatch(setIsLoading({key: 'common', value: false}));
    }
  };

  const changeRoute = async () => {
    try {
      dispatch(setIsLoading({key: 'common', value: true}));
      if (routeNumbers <= 0) {
        return null;
      }
      const updatedChosenRoute = (chosenRouteIndex + 1) % routeNumbers;
      dispatch(setChosenRouteIndex(updatedChosenRoute));
      setSelectedButton('changeRoute');
    } catch (error: any) {
      showToast(`${error}`, 'danger');
      return null;
    } finally {
      dispatch(setIsLoading({key: 'common', value: false}));
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
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === 'route' && styles.selectedButton,
              ]}
              onPress={makeRoute}>
              <FontAwesome6
                name="route"
                size={16}
                color={selectedButton === 'route' ? 'white' : 'black'}
              />
              <Text
                style={[
                  styles.text,
                  {color: selectedButton === 'route' ? 'white' : 'black'},
                ]}>
                Đường đi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === 'start' && styles.selectedButton,
              ]}
              onPress={instruct}>
              <FontAwesome6
                name="location-arrow"
                size={16}
                color={selectedButton === 'start' ? 'white' : 'black'}
              />
              <Text
                style={[
                  styles.text,
                  {color: selectedButton === 'start' ? 'white' : 'black'},
                ]}>
                Bắt đầu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === 'changeRoute' && styles.selectedButton,
              ]}
              onPress={changeRoute}>
              <FontAwesome6
                name="rotate"
                size={16}
                color={selectedButton === 'changeRoute' ? 'white' : 'black'}
              />
              <Text
                style={[
                  styles.text,
                  {color: selectedButton === 'changeRoute' ? 'white' : 'black'},
                ]}>
                Đổi tuyến đường
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={styles.transportContainer}>
          <FlatList
            style={styles.flatList}
            contentContainerStyle={{
              justifyContent: 'space-evenly',
              flexDirection: 'row',
            }}
            data={transportations}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.transportationButton,
                  {
                    backgroundColor:
                      transportation === item.id ? 'black' : 'white',
                  },
                ]}
                onPress={() => dispatch(setTransportation(item.id))}>
                <Ionicons
                  style={[
                    styles.transportationIcon,
                    {
                      color: transportation === item.id ? 'white' : 'black',
                    },
                  ]}
                  name={item.icon}
                  size={25}
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.label}
          />
        </View>
        <View style={{margin: 8, marginLeft: 16, alignSelf: 'flex-start'}}>
          <Text style={{fontSize: 32, fontWeight: 'bold'}}>{name}</Text>
          <Text style={{fontSize: 16}}>{address}</Text>
          {!isLoading.bottom_sheet && (
            <View>
              {distance && duration ? (
                <View style={styles.distanceWrapper}>
                  <FontAwesome6 name="car" size={17} />
                  <Text
                    style={{
                      marginLeft: 8,
                      color: 'forestgreen',
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    {Math.round(duration / 60)} phút
                  </Text>
                  <Text style={{fontSize: 16, marginLeft: 8}}>
                    ({Math.round(distance * 10) / 10} km)
                  </Text>
                </View>
              ) : (
                <Text style={styles.distanceText}>
                  Không tìm thấy tuyến đường !
                </Text>
              )}
            </View>
          )}
        </View>
        {isLoading.bottom_sheet && (
          <View>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={54} color="gray" />
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottom__container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: BOTTOM_SHEET_MAX_HEIGHT,
    bottom: BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT,
    backgroundColor: primaryColor,
    elevation: 3,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
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
    justifyContent: 'space-around',
    marginHorizontal: 8,
    borderRadius: 16,
    borderColor: 'gray',
    borderWidth: 0.5,
    elevation: 2,
    backgroundColor: primaryColor,
    height: 45,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  selectedButton: {
    backgroundColor: '#1A73E8',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: textColor,
    marginLeft: 8,
  },
  item: {
    fontSize: 40,
  },
  transportContainer: {
    flex: 0.5,
    marginTop: -16,
  },
  flatList: {
    position: 'absolute',
    alignSelf: 'center',
    top: '13%',
    height: 40,
    width: '80%',
    flex: 1,
  },
  transportationButton: {
    borderRadius: 100,
    borderColor: 'black',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  transportationIcon: {
    color: 'black',
  },
  distanceWrapper: {
    flexDirection: 'row',
    marginTop: 8,
  },
  distanceText: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
  },
  loadingContainer: {
    alignSelf: 'center',
  },
});

export default BottomSheet;
