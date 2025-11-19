import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SpeedHotFruitDashLayout from '../ComponentsSpeedHotFruitDash/SpeedHotFruitDashLayout';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const SpeedHotFruitDashAbout = () => {
  const navigation = useNavigation();

  const shareFruitDashInfo = async () => {
    try {
      await Share.share({
        message:
          Platform.OS === 'ios'
            ? `Speed Hot Fruit Dash is a fast-paced reflex and attention game where
every second matters. Choose the fresh fruit, avoid the spoiled
ones, and challenge your memory by counting how many fruits appear
on screen. Sharpen your focus, test your speed, and enjoy the fiery
energy of classic arcade gameplay.`
            : `Hot Speed: Fruit Dash is a fast-paced reflex and attention game where
every second matters. Choose the fresh fruit, avoid the spoiled
ones, and challenge your memory by counting how many fruits appear
on screen. Sharpen your focus, test your speed, and enjoy the fiery
energy of classic arcade gameplay.`,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <SpeedHotFruitDashLayout>
      <View style={styles.fruitdashwrap}>
        <View style={styles.fruitdashheader}>
          <TouchableOpacity
            style={styles.fruitdashbackbtn}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Image source={require('../../assets/images/fruitdashback.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.fruitdashtextcont}>
            <Text style={styles.fruitdashheadtitletxt}>About</Text>
          </TouchableOpacity>
          {Platform.OS === 'ios' ? (
            <Image
              source={require('../../assets/images/fruitdashheadlogo.png')}
            />
          ) : (
            <Image
              source={require('../../assets/images/andricon.png')}
              style={{
                width: 74.84,
                height: 74.84,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#F1B931',
              }}
            />
          )}
        </View>

        {Platform.OS === 'ios' ? (
          <Image
            source={require('../../assets/images/fruitdashhomelogo.png')}
            style={{ borderRadius: 25 }}
          />
        ) : (
          <Image
            source={require('../../assets/images/andricon.png')}
            style={{
              width: 250,
              height: 250,
              borderRadius: 25,
            }}
          />
        )}

        <View style={styles.fruitdashtextaboutcont}>
          {Platform.OS === 'ios' ? (
            <Text style={styles.fruitdashtitle}>
              Speed Hot Fruit Dash is a fast-paced reflex and attention game
              where every second matters. Choose the fresh fruit, avoid the
              spoiled ones, and challenge your memory by counting how many
              fruits appear on screen. Sharpen your focus, test your speed, and
              enjoy the fiery energy of classic arcade gameplay.
            </Text>
          ) : (
            <Text style={styles.fruitdashtitle}>
              Hot Speed: Fruit Dash is a fast-paced reflex and attention game
              where every second matters. Choose the fresh fruit, avoid the
              spoiled ones, and challenge your memory by counting how many
              fruits appear on screen. Sharpen your focus, test your speed, and
              enjoy the fiery energy of classic arcade gameplay.
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.fruitdashstatbtn}
          activeOpacity={0.7}
          onPress={shareFruitDashInfo}
        >
          <Text style={[styles.fruitdashbtntxt]}>Share</Text>
        </TouchableOpacity>
      </View>
    </SpeedHotFruitDashLayout>
  );
};

const styles = StyleSheet.create({
  fruitdashwrap: {
    alignItems: 'center',
    flex: 1,
    paddingTop: height * 0.072,
    padding: 14,
  },
  fruitdashbackbtn: {
    width: 74.84,
    height: 74.84,
    justifyContent: 'center',
    backgroundColor: '#370102',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F1B931',
    alignItems: 'center',
  },
  fruitdashtextaboutcont: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 30,
    backgroundColor: '#370102',
    borderRadius: 22,
    padding: 10,
    borderWidth: 2,
    borderColor: '#F1B931',
    paddingVertical: 40,
    marginBottom: 30,
  },
  fruitdashheader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 6,
  },
  fruitdashtextcont: {
    height: 74.84,
    flex: 1,
    alignSelf: 'center',
    backgroundColor: '#370102',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F1B931',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fruitdashtitle: {
    fontSize: 13,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    lineHeight: 22,
  },
  fruitdashbtntxt: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitdashheadtitletxt: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitdashstatbtn: {
    height: 89,
    width: '55%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#370102',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F1B931',
  },
});

export default SpeedHotFruitDashAbout;
