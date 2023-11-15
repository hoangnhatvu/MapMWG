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
  tertiaryColor,
  textColor,
} from '../constants/color';
import Feather from 'react-native-vector-icons/Feather';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setDestination} from '../redux/slices/destinationSlice';
import RootState from '../../redux';
import SearchBar from '../components/SearchBar';
import {setIsSearch} from '../redux/slices/isSearchSlice';
import {setSearchText} from '../redux/slices/searchTextSlice';
import {searchApi} from '../services/search';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchScreen = () => {
  const isSearch = useSelector((state: RootState) => state.isSearch.value);
  const searchText = useSelector((state: RootState) => state.searchText.value);
  const [searchList, setSearchList] = useState<any[] | []>([]);
  const destination = useSelector(
    (state: RootState) => state.destination.value,
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
    handleSearchResult(location.geometry.coordinates, location.properties.searchAddress);
  };

  const handleSearchResult = (data: [number, number], name: string) => {
    dispatch(setIsSearch(false));
    dispatch(setSearchText(name));
    dispatch(setDestination(data));
  };

  return (
    <>
      {isSearch && (
        <View style={styles.container}>
          <View style={styles.search__container}>
            <ScrollView>
              {searchList?.map(location => (
                <View style={styles.menuWrapper}>
                  <Ionicons name="location-outline" size={24} />
                  <TouchableOpacity
                    key={location?.id}
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
      )}
      <SearchBar />
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
