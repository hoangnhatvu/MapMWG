import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {primaryColor, tertiaryColor} from '../constants/color';
import Icon from 'react-native-vector-icons/Feather';

interface SearchScreenProps {
  isSearch: boolean;
  setIsSearch: (value: boolean) => void;
  searchText: string;
  setSearchText: (value: string) => void;
}

const SearchScreen:React.FC<SearchScreenProps> = ({
  isSearch,
  setIsSearch,
  searchText,
  setSearchText
}) => {
  const searchLocation = [
    {
      id: 1,
      coordinates: {latitude: 123.456, longitude: 789.012},
      name: 'Địa điểm 1',
      address: 'Địa chỉ 1',
    },
    {
      id: 2,
      coordinates: {latitude: 111.222, longitude: 333.444},
      name: 'Địa điểm 2',
      address: 'Địa chỉ 2',
    },
    {
      id: 3,
      coordinates: {latitude: 222.333, longitude: 444.555},
      name: 'Địa điểm 3',
      address: 'Địa chỉ 3',
    },
    {
      id: 4,
      coordinates: {latitude: 333.444, longitude: 555.666},
      name: 'Địa điểm 4',
      address: 'Địa chỉ 4',
    },
    {
      id: 5,
      coordinates: {latitude: 444.555, longitude: 666.777},
      name: 'Địa điểm 5',
      address: 'Địa chỉ 5',
    },
    {
      id: 6,
      coordinates: {latitude: 555.666, longitude: 777.888},
      name: 'Địa điểm 6',
      address: 'Địa chỉ 6',
    },
    {
      id: 7,
      coordinates: {latitude: 666.777, longitude: 888.999},
      name: 'Địa điểm 7',
      address: 'Địa chỉ 7',
    },
    {
      id: 8,
      coordinates: {latitude: 777.888, longitude: 999.0},
      name: 'Địa điểm 8',
      address: 'Địa chỉ 8',
    },
    {
      id: 9,
      coordinates: {latitude: 888.999, longitude: 100.111},
      name: 'Địa điểm 9',
      address: 'Địa chỉ 9',
    },
    {
      id: 10,
      coordinates: {latitude: 999.0, longitude: 111.222},
      name: 'Địa điểm 10',
      address: 'Địa chỉ 10',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.search__container}>
        <ScrollView>
          {searchLocation.map(location => (
            <TouchableOpacity
              key={location.id}
              style={styles.search__location}
              onPress={() => {}}>
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
