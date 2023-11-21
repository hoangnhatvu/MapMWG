import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {lightGray, primaryColor} from '../constants/color';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setDestination} from '../redux/slices/destinationSlice';
import RootState from '../../redux';
import {setIsSearch} from '../redux/slices/isSearchSlice';
import {setSearchText} from '../redux/slices/searchTextSlice';
import {searchApi} from '../services/search';
import Ionicons from 'react-native-vector-icons/Ionicons';
<<<<<<< HEAD
import {setIsSearchCurrent} from '../redux/slices/isSearchCurrentSlice';
import {setCurrent} from '../redux/slices/currentSlice';
import {setIsSearchDestination} from '../redux/slices/isSearchDestinationSlice';
import SearchBar from '../components/SearchBar';
import {setIsDirected} from '../redux/slices/isDirectedSlide';
import {setIsSearchBar} from '../redux/slices/isSearchBarSlice';
import {setDestinationInfo} from '../redux/slices/destinationInfoSlice';
import {setCurrentInfo} from '../redux/slices/currentInfoSlice';
=======
import {setIsSearchDirect} from '../redux/slices/isSearchDirectSlice';
import {setCurrent} from '../redux/slices/currentSlice';
import SearchBar from '../components/SearchBar';
import {setIsDirected} from '../redux/slices/isDirectedSlide';
import {setIsSearchBar} from '../redux/slices/isSearchBarSlice';
>>>>>>> main

interface SearchScreenProps {
  id?: number;
}

const SearchScreen: React.FC<SearchScreenProps> = ({id}) => {
  const searchText = useSelector((state: RootState) => state.searchText.value);
  const [searchList, setSearchList] = useState<any[] | []>([]);
  const isSearch = useSelector((state: RootState) => state.isSearch.value);
  const isSearchDirect = useSelector(
    (state: RootState) => state.isSearchDirect.value,
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
<<<<<<< HEAD
    if (isSearchCurrent || isSearchDestination) {
=======
    if (isSearchDirect) {
>>>>>>> main
      dispatch(setIsDirected(true));
      dispatch(setIsSearchBar(false));
    }
    handleSearchResult(location);
  };

  const handleSearchResult = (location: any) => {
    if (isSearch) {
      dispatch(setIsSearch(false));
<<<<<<< HEAD
      dispatch(setSearchText(location.properties.searchAddress));
      dispatch(setDestination(location.geometry.coordinates));
      dispatch(setDestinationInfo(location));
    } else if (isSearchCurrent) {
      dispatch(setIsSearchCurrent(false));
      dispatch(setCurrentInfo(location));
      dispatch(setCurrent(location.geometry.coordinates));
      dispatch(setSearchText(''));
    } else if (isSearchDestination) {
      dispatch(setIsSearchDestination(false));
      dispatch(setDestinationInfo(location));
      dispatch(setDestination(location.geometry.coordinates));
      dispatch(setSearchText(''));
    }
=======
      dispatch(setDestination(location));
    }
    // } else {
    //   dispatch(setIsSearchCurrent(false));
    //   dispatch(set(location));
    //   dispatch(setCurrent(location.geometry.coordinates));
    //   dispatch(setSearchText(''));
    // }
>>>>>>> main
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.search__container}>
          <ScrollView>
            {searchList?.map((location, index) => (
              <View style={styles.menuWrapper}>
                <Ionicons name="location-outline" size={24} />
                <TouchableOpacity
                  key={index}
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
<<<<<<< HEAD
      {isSearchCurrent || isSearchDestination ? <SearchBar /> : <></>}
=======
      {isSearchDirect ? <SearchBar /> : <></>}
>>>>>>> main
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
