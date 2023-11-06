import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {primaryColor, tertiaryColor} from '../constants/color';
import Icon from 'react-native-vector-icons/Feather';
import {isString} from '@rnmapbox/maps/lib/typescript/utils';
import {SearchProps} from '../props/SearchProps';

const SearchScreen: React.FC<SearchProps> = ({
  isSearch,
  setIsSearch,
  searchText,
  setSearchText,
  handleSearchResult,
}) => {
  const searchLocation = [
    {
      id: 1,
      coordinates: [70, 78],
      name: 'Address 1',
      address: 'Location 1',
    },
    {
      id: 2,
      coordinates: [11, 33],
      name: 'Address 2',
      address: 'Location 2',
    },
    {
      id: 3,
      coordinates: [22, 44],
      name: 'Address 3',
      address: 'Location 3',
    },
    {
      id: 4,
      coordinates: [33, 55],
      name: 'Address 4',
      address: 'Location 4',
    },
  ];

  const filterSearchResults = (
    searchText: string,
    searchLocation: any[],
  ): any[] => {
    if (searchText.trim() === '') {
      // Return a random item if searchText is empty
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

  return (
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
                  <Icon name="map-pin" size={20} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    height:'100%',
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
