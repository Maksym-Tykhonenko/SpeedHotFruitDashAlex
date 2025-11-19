import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SpeedHotFruitDashLayout from '../ComponentsSpeedHotFruitDash/SpeedHotFruitDashLayout';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const { height: fruitDashHeight } = Dimensions.get('window');

const SpeedHotFruitDashOnboard = () => {
  const [fruitDashIdx, setFruitDashIdx] = useState(0);
  const fruitDashNavigation = useNavigation();

  return (
    <SpeedHotFruitDashLayout>
      <View style={styles.fruitDashWrap}>
        {fruitDashIdx === 0 ? (
          <Image source={require('../../assets/images/fruitdashwelc1.png')} />
        ) : fruitDashIdx === 1 ? (
          <Image source={require('../../assets/images/fruitdashwelc2.png')} />
        ) : (
          <Image source={require('../../assets/images/fruitdashwelc3.png')} />
        )}

        <View style={styles.fruitDashTextCont}>
          <Text style={styles.fruitDashTitle}>
            {fruitDashIdx === 0
              ? 'Welcome to the world of fast fruit challenges!'
              : fruitDashIdx === 1
              ? 'Test your reaction in two modes:'
              : 'Track your stats, scores and records.'}
          </Text>

          <Text style={styles.fruitDashSubtitle}>
            {fruitDashIdx === 0
              ? 'Your task is to think fast and tap only on fresh fruits before the time runs out.'
              : fruitDashIdx === 1
              ? `1. Choose a ripe fruit among the spoiled ones.

2. Remember how many fruits appeared on the screen.`
              : 'Improve your reflexes, collect points and become a real fruit master!'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.fruitDashPlayBtn}
          activeOpacity={0.7}
          onPress={() =>
            fruitDashIdx < 2
              ? setFruitDashIdx(fruitDashIdx + 1)
              : fruitDashNavigation.navigate('SpeedHotFruitDashHome')
          }
        >
          <Image source={require('../../assets/images/fruitdashplay.png')} />
        </TouchableOpacity>
      </View>
    </SpeedHotFruitDashLayout>
  );
};

const styles = StyleSheet.create({
  fruitDashWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    paddingBottom: fruitDashHeight * 0.07,
  },
  fruitDashTextCont: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 30,
    backgroundColor: '#370102',
    borderRadius: 22,
    padding: 10,
    borderWidth: 2,
    borderColor: '#F1B931',
    paddingVertical: 45,
  },
  fruitDashTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitDashSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
  },
  fruitDashPlayBtn: {
    width: 139,
    height: 89,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 43,
    backgroundColor: '#370102',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F1B931',
  },
});

export default SpeedHotFruitDashOnboard;
