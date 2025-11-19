import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpeedHotFruitDashLayout from '../ComponentsSpeedHotFruitDash/SpeedHotFruitDashLayout';
import {
  fruitDashFruits,
  fruitDashRottenFruits,
} from '../DataSpeedHotFruitDash/speedHotFruitDashGameData';
const { height: fruitDashHeight } = Dimensions.get('window');

const fruitDashTotalRounds = 4;
const fruitDashGridSize = 16;

const SpeedHotFruitDashSpeedChoice = () => {
  const fruitDashNavigation = useNavigation();

  const [fruitDashShowIntro, setFruitDashShowIntro] = useState(true);
  const [fruitDashRound, setFruitDashRound] = useState(1);
  const [fruitDashTimer, setFruitDashTimer] = useState(15);
  const [fruitDashTimerRunning, setFruitDashTimerRunning] = useState(false);
  const [fruitDashStartCountdown, setFruitDashStartCountdown] = useState(3);
  const [fruitDashShowStartCountdown, setFruitDashShowStartCountdown] =
    useState(false);
  const [fruitDashGrid, setFruitDashGrid] = useState(
    Array(fruitDashGridSize).fill(null),
  );
  const [fruitDashShowFruits, setFruitDashShowFruits] = useState(false);
  const [fruitDashSelectedIndex, setFruitDashSelectedIndex] = useState(null);
  const [fruitDashCorrectCount, setFruitDashCorrectCount] = useState(0);
  const [fruitDashGameOver, setFruitDashGameOver] = useState(false);
  const [fruitDashReactionTimes, setFruitDashReactionTimes] = useState([]);
  const [fruitDashStartTime, setFruitDashStartTime] = useState(null);
  const [fruitDashUsedFruitIndexes, setFruitDashUsedFruitIndexes] = useState(
    [],
  );

  const fruitDashTimerRef = useRef(null);
  const fruitDashCountdownRef = useRef(null);

  const fruitDashStartIntro = () => {
    setFruitDashShowIntro(false);
    setFruitDashShowStartCountdown(true);
    setFruitDashStartCountdown(3);
  };

  useEffect(() => {
    if (fruitDashShowStartCountdown && fruitDashStartCountdown > 0) {
      fruitDashCountdownRef.current = setTimeout(() => {
        setFruitDashStartCountdown(prev => prev - 1);
      }, 1000);
    } else if (fruitDashShowStartCountdown && fruitDashStartCountdown === 0) {
      setFruitDashShowStartCountdown(false);
      fruitDashStartRound();
    }

    return () => clearTimeout(fruitDashCountdownRef.current);
  }, [fruitDashStartCountdown, fruitDashShowStartCountdown]);

  useEffect(() => {
    if (fruitDashTimerRunning && fruitDashTimer > 0) {
      fruitDashTimerRef.current = setTimeout(
        () => setFruitDashTimer(prev => prev - 1),
        1000,
      );
    } else if (fruitDashTimerRunning && fruitDashTimer === 0) {
      clearTimeout(fruitDashTimerRef.current);
      fruitDashEndGame();
    }

    return () => clearTimeout(fruitDashTimerRef.current);
  }, [fruitDashTimer, fruitDashTimerRunning]);

  const fruitDashStartRound = (fruitDashRoundNumber = fruitDashRound) => {
    setFruitDashSelectedIndex(null);
    setFruitDashShowFruits(false);

    setFruitDashTimer(15 - (fruitDashRoundNumber - 1) * 3);

    let fruitDashAvailableIndexes = fruitDashFruits
      .map((_, i) => i)
      .filter(i => !fruitDashUsedFruitIndexes.includes(i));

    if (fruitDashAvailableIndexes.length === 0) {
      fruitDashAvailableIndexes = fruitDashFruits.map((_, i) => i);
      setFruitDashUsedFruitIndexes([]);
    }

    const fruitDashFruitIndex =
      fruitDashAvailableIndexes[
        Math.floor(Math.random() * fruitDashAvailableIndexes.length)
      ];

    setFruitDashUsedFruitIndexes(prev => [...prev, fruitDashFruitIndex]);

    const fruitDashRottenPosition = Math.floor(
      Math.random() * fruitDashGridSize,
    );

    const fruitDashNewGrid = Array(fruitDashGridSize)
      .fill(null)
      .map((_, i) => (i === fruitDashRottenPosition ? 'rotten' : 'fresh'));

    setFruitDashGrid(Array(fruitDashGridSize).fill(null));

    setFruitDashStartTime(Date.now());

    setTimeout(() => {
      setFruitDashShowFruits(true);
      setFruitDashGrid(
        fruitDashNewGrid.map(type =>
          type === 'rotten'
            ? fruitDashRottenFruits[fruitDashFruitIndex]
            : fruitDashFruits[fruitDashFruitIndex],
        ),
      );
      setFruitDashTimerRunning(true);
    }, 500);
  };

  const fruitDashPressFruit = index => {
    if (!fruitDashShowFruits || fruitDashSelectedIndex !== null) return;

    const fruitDashRT = (Date.now() - fruitDashStartTime) / 1000;

    setFruitDashReactionTimes(prev => [...prev, fruitDashRT]);
    setFruitDashSelectedIndex(index);

    setFruitDashTimerRunning(false);
    clearTimeout(fruitDashTimerRef.current);

    const fruitDashRottenIndex = fruitDashGrid.findIndex(img =>
      fruitDashRottenFruits.includes(img),
    );

    if (index === fruitDashRottenIndex) {
      setFruitDashCorrectCount(prev => prev + 1);
    }
  };

  const fruitDashNextRound = () => {
    if (fruitDashRound >= fruitDashTotalRounds) {
      fruitDashEndGame();
    } else {
      const fruitDashNext = fruitDashRound + 1;
      setFruitDashRound(fruitDashNext);
      fruitDashStartRound(fruitDashNext);
    }
  };

  const fruitDashEndGame = async () => {
    setFruitDashTimerRunning(false);
    setFruitDashGameOver(true);
    await fruitDashSaveStats();
  };

  const fruitDashSaveStats = async () => {
    try {
      const fruitDashAvg =
        fruitDashReactionTimes.length > 0
          ? (
              fruitDashReactionTimes.reduce((a, b) => a + b, 0) /
              fruitDashReactionTimes.length
            ).toFixed(3)
          : '0.000';

      const fruitDashEntry = {
        date: Date.now(),
        correct: fruitDashCorrectCount,
        total: fruitDashTotalRounds,
        avgTime: fruitDashAvg,
      };

      const fruitDashExisting = await AsyncStorage.getItem(
        'fruitdash_speedchoice_stats',
      );
      const fruitDashArr = fruitDashExisting
        ? JSON.parse(fruitDashExisting)
        : [];

      fruitDashArr.unshift(fruitDashEntry);

      await AsyncStorage.setItem(
        'fruitdash_speedchoice_stats',
        JSON.stringify(fruitDashArr),
      );
    } catch (e) {
      console.log('SAVE ERROR →', e);
    }
  };

  const fruitDashRestart = () => {
    clearTimeout(fruitDashTimerRef.current);
    clearTimeout(fruitDashCountdownRef.current);

    setFruitDashRound(1);
    setFruitDashTimer(15);
    setFruitDashCorrectCount(0);
    setFruitDashReactionTimes([]);
    setFruitDashGameOver(false);
    setFruitDashShowFruits(false);
    setFruitDashTimerRunning(false);
    setFruitDashSelectedIndex(null);
    setFruitDashGrid(Array(fruitDashGridSize).fill(null));
    setFruitDashUsedFruitIndexes([]);

    setFruitDashShowIntro(false);

    setFruitDashShowStartCountdown(true);
    setFruitDashStartCountdown(3);
  };

  const fruitDashFormatTime = sec => {
    const fruitDashMin = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const fruitDashSec = (sec % 60).toString().padStart(2, '0');
    return `${fruitDashMin}:${fruitDashSec}`;
  };

  const fruitDashShareResult = async () => {
    try {
      await Share.share({
        message: `You correctly found: ${fruitDashCorrectCount}/${fruitDashTotalRounds}
Average reaction time: ${
          fruitDashReactionTimes.length > 0
            ? (
                fruitDashReactionTimes.reduce((a, b) => a + b, 0) /
                fruitDashReactionTimes.length
              ).toFixed(3)
            : '0.000'
        } sec`,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <SpeedHotFruitDashLayout>
      <View style={styles.fruitDashWrap}>
        <View style={styles.fruitDashHeader}>
          <TouchableOpacity
            style={styles.fruitDashBackBtn}
            onPress={() => fruitDashNavigation.goBack()}
          >
            <Image source={require('../../assets/images/fruitdashback.png')} />
          </TouchableOpacity>

          <View style={styles.fruitDashHeaderTextBox}>
            <Text style={styles.fruitDashHeaderTitle}>Speed Choice</Text>
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

        {fruitDashShowIntro && (
          <View style={styles.fruitDashIntroCont}>
            <Image
              source={require('../../assets/images/fruitdashspeedchoice.png')}
              style={styles.fruitDashIntroImage}
            />

            <View style={styles.fruitDashIntroBox}>
              <Text style={styles.fruitDashIntroTxt}>
                One rotten fruit hides among the fresh ones. Try to find it as
                fast as possible. The timer becomes shorter every round.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.fruitDashIntroBtn}
              onPress={fruitDashStartIntro}
            >
              <Image
                source={require('../../assets/images/fruitdashplay.png')}
              />
            </TouchableOpacity>
          </View>
        )}

        {fruitDashGameOver && !fruitDashShowIntro ? (
          <View style={styles.fruitDashResultCont}>
            <Image
              source={require('../../assets/images/fruitdashspeedchoice.png')}
              style={styles.fruitDashResultImage}
            />

            <View style={styles.fruitDashResultBox}>
              <Text style={[styles.fruitDashResultTxt, { marginBottom: 28 }]}>
                Result
              </Text>

              <Text style={[styles.fruitDashResultTxt, { marginBottom: 20 }]}>
                Correct: {fruitDashCorrectCount}/{fruitDashTotalRounds}
              </Text>

              <Text style={styles.fruitDashResultTxt}>
                Average reaction time:{' '}
                <Text style={styles.fruitDashResultNum}>
                  {fruitDashReactionTimes.length > 0
                    ? (
                        fruitDashReactionTimes.reduce((a, b) => a + b, 0) /
                        fruitDashReactionTimes.length
                      ).toFixed(3)
                    : '0.000'}{' '}
                  sec
                </Text>
              </Text>
            </View>

            <View style={styles.fruitDashResultBtnsRow}>
              <TouchableOpacity
                style={styles.fruitDashPlayAgainBtn}
                onPress={fruitDashRestart}
              >
                <Text style={styles.fruitDashNextBtnTxt}>Play again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fruitDashShareBtn}
                onPress={fruitDashShareResult}
              >
                <Image
                  source={require('../../assets/images/fruitdashsshr.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {!fruitDashShowIntro && !fruitDashGameOver && (
          <>
            {!fruitDashShowStartCountdown && (
              <View style={styles.fruitDashRoundHeader}>
                <View style={styles.fruitDashRoundTxtBox}>
                  <Text style={styles.fruitDashRoundTxt}>
                    Round {fruitDashRound}/{fruitDashTotalRounds}
                  </Text>
                </View>

                <View style={styles.fruitDashRoundTxtBox}>
                  <Text style={styles.fruitDashRoundTxt}>
                    {fruitDashFormatTime(fruitDashTimer)}
                  </Text>
                </View>
              </View>
            )}

            {fruitDashShowStartCountdown && (
              <View style={styles.fruitDashCountdownBox}>
                <Text style={styles.fruitDashCountdownTxt}>
                  {fruitDashStartCountdown}
                </Text>
              </View>
            )}

            <View style={styles.fruitDashGrid}>
              {Array(fruitDashGridSize)
                .fill(null)
                .map((_, fruitDashIndex) => {
                  const fruitDashImg = fruitDashGrid[fruitDashIndex];
                  const fruitDashRottenIndex = fruitDashGrid.findIndex(i =>
                    fruitDashRottenFruits.includes(i),
                  );

                  const fruitDashIsSelected =
                    fruitDashIndex === fruitDashSelectedIndex;

                  return (
                    <TouchableOpacity
                      key={fruitDashIndex}
                      style={[
                        styles.fruitDashCard,
                        {
                          backgroundColor:
                            fruitDashSelectedIndex !== null
                              ? fruitDashIsSelected
                                ? fruitDashIndex === fruitDashRottenIndex
                                  ? '#03CE0A'
                                  : '#FF090D'
                                : '#370102'
                              : '#370102',
                          borderWidth: 2,
                          borderColor:
                            fruitDashIsSelected &&
                            fruitDashSelectedIndex !== null
                              ? '#F1B931'
                              : '#370102',
                        },
                      ]}
                      onPress={() => fruitDashPressFruit(fruitDashIndex)}
                      activeOpacity={0.7}
                    >
                      {fruitDashShowFruits && fruitDashImg && (
                        <Image
                          source={fruitDashImg}
                          style={styles.fruitDashCardImg}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
            </View>

            {fruitDashSelectedIndex !== null && (
              <TouchableOpacity
                style={styles.fruitDashNextBtn}
                onPress={fruitDashNextRound}
              >
                <Text style={styles.fruitDashNextBtnTxt}>Next Round</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SpeedHotFruitDashLayout>
  );
};

const styles = StyleSheet.create({
  fruitDashWrap: {
    flex: 1,
    alignItems: 'center',
    paddingTop: fruitDashHeight * 0.072,
    padding: 14,
  },
  fruitDashIntroCont: {
    alignItems: 'center',
    marginTop: 30,
  },
  fruitDashIntroImage: {
    marginBottom: 35,
  },
  fruitDashIntroBox: {
    backgroundColor: '#370102',
    borderWidth: 2,
    borderColor: '#F1B931',
    borderRadius: 16,
    padding: 22,
    width: '90%',
    marginBottom: 40,
  },
  fruitDashIntroTxt: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  fruitDashIntroBtn: {
    backgroundColor: '#370102',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F1B931',
    width: 139,
    height: 89,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fruitDashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  fruitDashHeaderTextBox: {
    flex: 1,
    height: 74,
    backgroundColor: '#370102',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F1B931',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fruitDashHeaderTitle: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitDashRoundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
    paddingHorizontal: 25,
  },
  fruitDashRoundTxtBox: {
    width: 140,
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#370102',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F1B931',
    alignItems: 'center',
    marginTop: 15,
  },
  fruitDashRoundTxt: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitDashCountdownBox: {
    backgroundColor: '#370102',
    borderColor: '#F1B931',
    borderWidth: 1.5,
    borderRadius: 18,
    width: 147,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  fruitDashCountdownTxt: {
    fontSize: 42,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitDashGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginTop: 28,
  },
  fruitDashCard: {
    width: 75,
    height: 75,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fruitDashCardImg: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  fruitDashNextBtn: {
    backgroundColor: '#370102',
    borderWidth: 2,
    borderColor: '#F1B931',
    borderRadius: 18,
    width: 238,
    height: 89,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  fruitDashNextBtnTxt: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitDashResultCont: {
    alignItems: 'center',
    width: '100%',
  },
  fruitDashResultImage: {
    marginBottom: 34,
    marginTop: 10,
  },
  fruitDashResultBox: {
    backgroundColor: '#370102',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F1B931',
    padding: 20,
    marginBottom: 30,
    width: '100%',
    paddingBottom: 40,
  },
  fruitDashResultTxt: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Montserrat-Regular',
  },
  fruitDashResultNum: {
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
  },
  fruitDashResultBtnsRow: {
    flexDirection: 'row',
    gap: 35,
  },
  fruitDashPlayAgainBtn: {
    backgroundColor: '#370102',
    borderWidth: 2,
    borderColor: '#F1B931',
    borderRadius: 18,
    flex: 1,
    height: 89,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fruitDashShareBtn: {
    backgroundColor: '#370102',
    borderWidth: 2,
    borderColor: '#F1B931',
    borderRadius: 18,
    width: 89,
    height: 89,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpeedHotFruitDashSpeedChoice;
