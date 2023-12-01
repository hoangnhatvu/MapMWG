import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {lightGray, primaryColor} from '../constants/color';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import RootState from '../../redux';
import {setIsSearch} from '../redux/slices/isSearchSlice';
import {setSearchText} from '../redux/slices/searchTextSlice';
import {searchApi} from '../services/search';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {setIsSearchDirect} from '../redux/slices/isSearchDirectSlice';
import SearchBar from '../components/SearchBar';
import {setIsDirected} from '../redux/slices/isDirectedSlide';
import {setIsSearchBar} from '../redux/slices/isSearchBarSlice';
import {updateSearchDirection} from '../redux/slices/searchDirectionsSlice';
import { setIsLoading } from '../redux/slices/isLoadingSlice';

interface SearchScreenProps {
  id?: number;
}

const SearchScreen: React.FC<SearchScreenProps> = ({id}) => {
  const isLoading = useSelector((state: RootState) => state.isLoading.value);
  const searchText = useSelector((state: RootState) => state.searchText.value);
  const [searchList, setSearchList] = useState<any[] | []>([]);
  const isSearch = useSelector((state: RootState) => state.isSearch.value);
  const isSearchDirect = useSelector(
    (state: RootState) => state.isSearchDirect.value,
  );
  const searchDirections = useSelector(
    (state: RootState) => state.searchDirections.value,
  );

  const dispatch = useDispatch();

  const getSearchList = async () => {
    try {
      const data = await searchApi(searchText);
      if (data) {
        setSearchList(data);
        dispatch(setIsLoading({key: "search", value: false}));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSearchList();
  }, [searchText]);

  const handleSearchLocation = (location: any) => {
    if (isSearchDirect) {
      dispatch(setIsDirected(true));
      dispatch(setIsSearchBar(false));
    }
    handleSearchResult(location);
  };

  const handleSearchResult = (data: any) => {
    if (isSearch) {
      dispatch(setIsSearch(false));
      dispatch(updateSearchDirection({id: 1, data: data}));
    } else {
      dispatch(updateSearchDirection({id, data}));
      dispatch(setIsSearchDirect(false));
      dispatch(setSearchText(''));
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.search__container}>
          {isLoading.search ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={34} color="gray" />
            </View>
          ) : (
            <ScrollView>
              {searchList?.map((location, index) => (
                <View style={styles.menuWrapper}>
                  <Ionicons name="location-outline" size={24} />
                  <TouchableOpacity
                    key={index}
                    style={styles.search__location}
                    onPress={() => {
                      dispatch(
                        setSearchText(location.properties.searchAddress),
                      );
                      handleSearchLocation(location);
                    }}>
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
          )}
        </View>
      </View>
      {isSearchDirect ? <SearchBar /> : <></>}
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

  loadingContainer: {
    flex: 1,
    paddingTop: 18,
  },
});

export default SearchScreen;
