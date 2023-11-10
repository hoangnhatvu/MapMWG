import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import {primaryColor, tertiaryColor, textColor} from '../constants/color';
import Feather from 'react-native-vector-icons/Feather';
import {StoreData, storesData} from '../data/stores';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setDestination} from '../redux/slices/destinationSlice';
import RootState from '../../redux';
import SearchBar from '../components/SearchBar';
import { setIsSearch } from '../redux/slices/isSearchSlice';
import { setSearchText } from '../redux/slices/searchTextSlice';

const SearchScreen = () => {
  const isSearch = useSelector((state: RootState) => state.isSearch.value);
  const searchText = useSelector((state: RootState) => state.searchText.value);
  const searchLocation = storesData;
  const destination = useSelector(
    (state: RootState) => state.destination.value,
  );
  const dispatch = useDispatch();

  const filterSearchResults = (
    searchText: string,
    searchLocation: readonly StoreData[],
  ): any[] => {
    if (searchText.trim() === '') {
    }

    return searchLocation.filter(location => {
      let nameMatch = location.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      return nameMatch;
    });
  };

  useEffect(() => {
    console.log(isSearch)
  }, [isSearch])

  const filteredSearchResults = filterSearchResults(searchText, searchLocation);

  const handleSearchLocation = (location: any) => {
    handleSearchResult(location.coordinates, location.name);
  };

  const handleSearchResult = (data: [number, number], name: string) => {
    dispatch(setIsSearch(false));
    console.log(name)
    dispatch(setSearchText(name));
    dispatch(setDestination(data));
    console.log('data' + data);
  };

  return (
    <>
      {isSearch && (
        <View style={styles.container}>
          <View style={styles.search__container}>
            <ScrollView>
              {filteredSearchResults.map(location => (
                <TouchableOpacity
                  key={location.id}
                  style={styles.search__location}
                  onPress={() => handleSearchLocation(location)}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{marginRight: 16, alignItems: 'center'}}>
                      <Feather name="map-pin" size={20} />
                      <Text>15km</Text>
                    </View>
                    <View>
                      <Text
                        numberOfLines={3}
                        ellipsizeMode="tail"
                        style={styles.addressText}>
                        Tên: {location.name}
                      </Text>
                      <Text
                        numberOfLines={3}
                        ellipsizeMode="tail"
                        style={styles.addressText}>
                        Địa chỉ: {location.address}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
      <SearchBar/>
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
    borderBottomColor: tertiaryColor,
  },
  addressText: {
    fontSize: 14,
    color: '#888',
  },
});

export default SearchScreen;
