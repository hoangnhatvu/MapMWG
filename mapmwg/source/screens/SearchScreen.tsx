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
import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setDestination} from '../redux/destinationSlice';
import RootState from '../../redux';

const SearchScreen = () => {
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
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

  const filteredSearchResults = filterSearchResults(searchText, searchLocation);

  const handleSearchLocation = (location: any): any => {
    handleSearchResult(location.coordinates);
  };

  const handleSearchResult = (data: [number, number]): any => {
    setIsSearch(false);
    setSearchText('');
    dispatch(setDestination(data));
    console.log('data' + data);
  };

  const exitSearch = (): any => {
    setIsSearch(false);
    setSearchText('');
  };
  const handleSearch = (event: any): any => {
    setIsSearch(true);
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
      <View style={styles.search__bar}>
        {isSearch ? (
          <Feather
            name="arrow-left"
            style={styles.search__bar_icon}
            size={25}
            color="black"
            onPress={exitSearch}
          />
        ) : (
          <Feather
            name="search"
            style={styles.search__bar_icon}
            size={25}
            color="black"
          />
        )}
        <TextInput
          style={styles.search__input}
          placeholder="Search here"
          onKeyPress={handleSearch}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
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
  search__bar: {
    width: '90%',
    height: 40,
    borderRadius: 20,
    elevation: 5,
    backgroundColor: primaryColor,
    alignSelf: 'center',
    top: 50,
    position: 'absolute',
    color: tertiaryColor,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  search__bar_icon: {
    marginLeft: 5,
    marginRight: 5,
  },
  search__input: {
    flex: 1,
    color: textColor,
  },
});

export default SearchScreen;
