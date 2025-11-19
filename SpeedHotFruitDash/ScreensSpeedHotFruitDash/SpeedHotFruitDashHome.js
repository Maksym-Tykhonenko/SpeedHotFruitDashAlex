import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SpeedHotFruitDashLayout from '../ComponentsSpeedHotFruitDash/SpeedHotFruitDashLayout';
import { useNavigation } from '@react-navigation/native';

const { height: fruitDashHeight } = Dimensions.get('window');

const SpeedHotFruitDashHome = () => {
  const fruitDashNavigation = useNavigation();

  return (
    <SpeedHotFruitDashLayout>
      <View style={styles.fruitDashWrap}>
        {Platform.OS === 'ios' ? (
          <Image
            source={require('../../assets/images/fruitdashhomelogo.png')}
            style={{ borderRadius: 25 }}
          />
        ) : (
          <Image
            source={require('../../assets/images/andricon.png')}
            style={{
              borderRadius: 25,
              width: 250,
              height: 250,
            }}
          />
        )}

        <View style={styles.fruitDashBtnsWrap}>
          <TouchableOpacity
            style={styles.fruitDashTextCont}
            activeOpacity={0.7}
            onPress={() =>
              fruitDashNavigation.navigate('SpeedHotFruitDashSpeedChoice')
            }
          >
            <Text style={styles.fruitDashTitle}>Speed Choice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fruitDashTextCont}
            activeOpacity={0.7}
            onPress={() =>
              fruitDashNavigation.navigate('SpeedHotFruitDashFruitCount')
            }
          >
            <Text style={styles.fruitDashTitle}>Fruit Count</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fruitDashBottomRow}>
          <TouchableOpacity
            style={styles.fruitDashStatBtn}
            activeOpacity={0.7}
            onPress={() =>
              fruitDashNavigation.navigate('SpeedHotFruitDashFruitStatistics')
            }
          >
            <Text style={[styles.fruitDashTitle, { fontSize: 16 }]}>
              Statistics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fruitDashPlayBtn}
            activeOpacity={0.7}
            onPress={() =>
              fruitDashNavigation.navigate('SpeedHotFruitDashAbout')
            }
          >
            <Image source={require('../../assets/images/fruitdashinfo.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </SpeedHotFruitDashLayout>
  );
};

const styles = StyleSheet.create({
  fruitDashWrap: {
    alignItems: 'center',
    flex: 1,
    paddingTop: fruitDashHeight * 0.092,
    padding: 55,
  },
  fruitDashTextCont: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#370102',
    borderRadius: 22,
    padding: 40,
    borderWidth: 2,
    borderColor: '#F1B931',
  },
  fruitDashTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitDashPlayBtn: {
    width: 74,
    height: 74,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#370102',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F1B931',
  },
  fruitDashStatBtn: {
    height: 74,
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#370102',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F1B931',
  },
  fruitDashBtnsWrap: {
    marginTop: 40,
    gap: 20,
    width: '100%',
  },
  fruitDashBottomRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 9,
  },
});

export default SpeedHotFruitDashHome;
