import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  lightGray,
  primaryColor,
} from '../constants/color';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setDestination} from '../redux/slices/destinationSlice';
import RootState from '../../redux';
import {setIsSearch} from '../redux/slices/isSearchSlice';
import {setSearchText} from '../redux/slices/searchTextSlice';
import {searchApi} from '../services/search';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { setIsSearchCurrent } from '../redux/slices/isSearchCurrentSlice';
import { setCurrent } from '../redux/slices/currentSlice';
import { setIsSearchDestination } from '../redux/slices/isSearchDestinationSlice';
import SearchBar from '../components/SearchBar';
import { setIsDirected } from '../redux/slices/isDirectedSlide';
import { setIsSearchBar } from '../redux/slices/isSearchBarSlice';
import { setDestinationInfo } from '../redux/slices/destinationInfoSlice';
import { setCurrentInfo } from '../redux/slices/currentInfoSlice';

const SearchScreen = () => {
  const searchText = useSelector((state: RootState) => state.searchText.value);
  const [searchList, setSearchList] = useState<any[] | []>([]);
  const isSearch = useSelector((state: RootState) => state.isSearch.value);
  const isSearchCurrent = useSelector(
    (state: RootState) => state.isSearchCurrent.value,
  );
  const isSearchDestination = useSelector(
    (state: RootState) => state.isSearchDestination.value,
  );
  const dispatch = useDispatch();

  const getSearchList = async () => {
    try {
      const data = await searchApi(searchText);
      console.log(data);
      setSearchList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSearchList();
  }, [searchText]);

  const handleSearchLocation = (location: any) => {
    if(isSearchCurrent || isSearchDestination) {
      dispatch(setIsDirected(true));
      dispatch(setIsSearchBar(false));
    }
    handleSearchResult(location);
  };

  const handleSearchResult = (location: any) => {
    if(isSearch){
      dispatch(setIsSearch(false));
      dispatch(setSearchText(location.properties.searchAddress));
      dispatch(setDestination(location.geometry.coordinates));
      dispatch(setDestinationInfo(location))
    } else if (isSearchCurrent)
    {
      dispatch(setIsSearchCurrent(false));
      dispatch(setCurrentInfo(location));
      dispatch(setCurrent(location.geometry.coordinates));
      dispatch(setSearchText(''));
    } else if (isSearchDestination){
      dispatch(setIsSearchDestination(false));
      dispatch(setDestinationInfo(location));
      dispatch(setDestination(location.geometry.coordinates));
      dispatch(setSearchText(''));
    }  
    
  };

  return (
    <>
        <View style={styles.container}>
          <View style={styles.search__container}>
            <ScrollView>
              {searchList?.map(location => (
                <View style={styles.menuWrapper}>
                  <Ionicons name="location-outline" size={24} />
                  <TouchableOpacity
                    key={location.id}
                    style={styles.search__location}
                    onPress={() => handleSearchLocation(location)}>
                    <View style={{flexDirection: 'row'}}>
                      <View>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.addressText}>
                          {location.properties.searchAddress}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        {isSearchCurrent || isSearchDestination ? <SearchBar/> : <></>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  search__container: {
    flex: 1,
    top: '10%',
    marginTop: 10,
    width: '80%',
  },
  search__location: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
  },
  menuWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 14,
    color: '#888',
  },
});

export default SearchScreen;
