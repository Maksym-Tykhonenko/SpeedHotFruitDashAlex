import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Share,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpeedHotFruitDashLayout from '../ComponentsSpeedHotFruitDash/SpeedHotFruitDashLayout';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const SpeedHotFruitDashFruitStatistics = () => {
  const navigation = useNavigation();

  const [fruitDashActiveTab, setFruitDashActiveTab] = useState('speed');
  const [fruitDashSpeedStats, setFruitDashSpeedStats] = useState([]);
  const [fruitDashCountStats, setFruitDashCountStats] = useState([]);
  const [fruitDashAvgReaction, setFruitDashAvgReaction] = useState(0);

  const fruitDashLoadStats = async () => {
    try {
      const speed = await AsyncStorage.getItem('fruitdash_speedchoice_stats');
      const speedArr = speed ? JSON.parse(speed) : [];
      setFruitDashSpeedStats(speedArr);

      const count = await AsyncStorage.getItem('fruitdash_fruitcount_stats');
      const countArr = count ? JSON.parse(count) : [];
      setFruitDashCountStats(countArr);

      if (speedArr.length > 0) {
        const avg =
          speedArr.reduce((a, b) => a + Number(b.avgTime || 0), 0) /
          speedArr.length;
        setFruitDashAvgReaction(avg.toFixed(3));
      } else {
        setFruitDashAvgReaction('0.000');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fruitDashLoadStats();
  }, []);

  const fruitDashDeleteItem = async (type, index) => {
    try {
      if (type === 'speed') {
        const arr = [...fruitDashSpeedStats];
        arr.splice(index, 1);
        setFruitDashSpeedStats(arr);
        await AsyncStorage.setItem(
          'fruitdash_speedchoice_stats',
          JSON.stringify(arr),
        );
      } else {
        const arr = [...fruitDashCountStats];
        arr.splice(index, 1);
        setFruitDashCountStats(arr);
        await AsyncStorage.setItem(
          'fruitdash_fruitcount_stats',
          JSON.stringify(arr),
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fruitDashShareEntry = async (entry, type) => {
    try {
      if (type === 'speed') {
        await Share.share({
          message: `Winning Rounds: ${entry.correct}/${entry.total}
Average response time: ${entry.avgTime} sec`,
        });
      } else {
        await Share.share({
          message: `Winning Rounds: ${entry.correct}/${entry.total}`,
        });
      }
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  const fruitDashFormatDate = timestamp => {
    const d = new Date(timestamp);
    return `${String(d.getDate()).padStart(2, '0')}.${String(
      d.getMonth() + 1,
    ).padStart(2, '0')}.${d.getFullYear()}`;
  };

  return (
    <SpeedHotFruitDashLayout>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.fruitDashWrap}>
          <View style={styles.fruitDashHeader}>
            <TouchableOpacity
              style={styles.fruitDashBackBtn}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require('../../assets/images/fruitdashback.png')}
              />
            </TouchableOpacity>

            <View style={styles.fruitDashHeaderTitleBox}>
              <Text style={styles.fruitDashHeaderTitle}>Statistics</Text>
            </View>

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

          <View style={styles.fruitDashAvgBox}>
            <Text style={styles.fruitDashAvgTitle}>Average reaction time</Text>
            <Text style={styles.fruitDashAvgValue}>
              {`${fruitDashAvgReaction} sec`}
            </Text>
          </View>

          <View style={styles.fruitDashTabs}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.fruitDashTab,
                fruitDashActiveTab === 'speed' && styles.fruitDashTabActive,
              ]}
              onPress={() => setFruitDashActiveTab('speed')}
            >
              <Text
                style={[
                  styles.fruitDashTabTxt,
                  fruitDashActiveTab === 'speed' &&
                    styles.fruitDashTabTxtActive,
                ]}
              >
                Speed Choice
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.fruitDashTab,
                fruitDashActiveTab === 'count' && styles.fruitDashTabActive,
              ]}
              onPress={() => setFruitDashActiveTab('count')}
            >
              <Text
                style={[
                  styles.fruitDashTabTxt,
                  fruitDashActiveTab === 'count' &&
                    styles.fruitDashTabTxtActive,
                ]}
              >
                Fruit Count
              </Text>
            </TouchableOpacity>
          </View>

          {fruitDashActiveTab === 'speed' &&
            (fruitDashSpeedStats.length === 0 ? (
              <Text style={styles.fruitDashNoData}>No data….</Text>
            ) : (
              fruitDashSpeedStats.map((item, index) => (
                <View key={index} style={styles.fruitDashCard}>
                  <Text style={styles.fruitDashCardDate}>
                    {fruitDashFormatDate(item.date)}
                  </Text>

                  <View style={styles.fruitDashCardRow}>
                    <Text style={styles.fruitDashCardText}>
                      Winning Rounds:
                    </Text>
                    <Text style={styles.fruitDashCardNumber}>
                      {item.correct}
                    </Text>
                  </View>

                  <View style={styles.fruitDashCardRow}>
                    <Text style={styles.fruitDashCardText}>
                      Average response time:
                    </Text>
                    <Text style={styles.fruitDashCardNumber}>
                      {item.avgTime} sec
                    </Text>
                  </View>

                  <View style={styles.fruitDashCardActions}>
                    <TouchableOpacity
                      style={styles.fruitDashShareBtn}
                      onPress={() => fruitDashShareEntry(item, 'speed')}
                    >
                      <Text style={styles.fruitDashShareTxt}>Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.fruitDashDeleteBtn}
                      onPress={() => fruitDashDeleteItem('speed', index)}
                    >
                      <Image
                        source={require('../../assets/images/fruitdashdelete.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ))}

          {fruitDashActiveTab === 'count' &&
            (fruitDashCountStats.length === 0 ? (
              <Text style={styles.fruitDashNoData}>No data….</Text>
            ) : (
              fruitDashCountStats.map((item, index) => (
                <View key={index} style={styles.fruitDashCard}>
                  <Text style={styles.fruitDashCardDate}>
                    {fruitDashFormatDate(item.date)}
                  </Text>

                  <View style={styles.fruitDashCardRow}>
                    <Text style={styles.fruitDashCardText}>
                      Winning Rounds:
                    </Text>
                    <Text style={styles.fruitDashCardNumber}>
                      {item.correct}
                    </Text>
                  </View>

                  <View style={styles.fruitDashCardActions}>
                    <TouchableOpacity
                      style={styles.fruitDashShareBtn}
                      activeOpacity={0.7}
                      onPress={() => fruitDashShareEntry(item, 'count')}
                    >
                      <Text style={styles.fruitDashShareTxt}>Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.fruitDashDeleteBtn}
                      activeOpacity={0.7}
                      onPress={() => fruitDashDeleteItem('count', index)}
                    >
                      <Image
                        source={require('../../assets/images/fruitdashdelete.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ))}
        </View>
      </ScrollView>
    </SpeedHotFruitDashLayout>
  );
};

const styles = StyleSheet.create({
  fruitDashWrap: {
    alignItems: 'center',
    paddingTop: height * 0.07,
    padding: 14,
    width: '100%',
  },
  fruitDashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    width: '100%',
    gap: 6,
  },
  fruitDashBackBtn: {
    width: 74,
    height: 74,
    justifyContent: 'center',
    backgroundColor: '#370102',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F1B931',
    alignItems: 'center',
  },
  fruitDashHeaderTitleBox: {
    flex: 1,
    height: 74,
    justifyContent: 'center',
    backgroundColor: '#370102',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F1B931',
    alignItems: 'center',
  },
  fruitDashHeaderTitle: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitDashAvgBox: {
    width: '100%',
    backgroundColor: '#370102',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F1B931',
    paddingBottom: 66,
    paddingTop: 14,
    alignItems: 'center',
    marginBottom: 34,
  },
  fruitDashAvgTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 50,
    fontFamily: 'Montserrat-Medium',
  },
  fruitDashAvgValue: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitDashTabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 17,
  },
  fruitDashTab: {
    flex: 1,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#370102',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1B931',
  },
  fruitDashTabActive: {
    backgroundColor: '#FF7A00',
  },
  fruitDashTabTxt: {
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
  },
  fruitDashTabTxtActive: {
    color: '#7D0505',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
  },
  fruitDashNoData: {
    color: '#fff',
    fontSize: 20,
    marginTop: 80,
    fontFamily: 'Montserrat-Regular',
  },
  fruitDashCard: {
    width: '100%',
    backgroundColor: '#370102',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F1B931',
    padding: 14,
    marginBottom: 25,
    paddingBottom: 18,
  },
  fruitDashCardDate: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 31,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },
  fruitDashCardText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
  },
  fruitDashCardNumber: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 17,
    color: '#fff',
  },
  fruitDashCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  fruitDashCardActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  fruitDashShareBtn: {
    backgroundColor: '#F1B931',
    width: 140,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fruitDashShareTxt: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitDashDeleteBtn: {
    backgroundColor: '#370102',
    borderWidth: 1,
    borderColor: '#F1B931',
    padding: 8,
    borderRadius: 14,
  },
});

export default SpeedHotFruitDashFruitStatistics;
