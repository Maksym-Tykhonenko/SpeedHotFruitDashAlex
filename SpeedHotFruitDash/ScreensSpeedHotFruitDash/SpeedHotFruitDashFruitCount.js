import React, { useState, useRef, useEffect } from 'react';
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
import { fruitDashFruits } from '../DataSpeedHotFruitDash/speedHotFruitDashGameData';

const { height: fruitDashHeight, width: fruitDashWidth } =
  Dimensions.get('window');

const fruitDashCountTotalRounds = 4;
const fruitDashCountGridSize = 16;

const fruitDashNumpadImages = {
  1: require('../../assets/images/fruitdash1.png'),
  2: require('../../assets/images/fruitdash2.png'),
  3: require('../../assets/images/fruitdash3.png'),
  4: require('../../assets/images/fruitdash4.png'),
  5: require('../../assets/images/fruitdash5.png'),
  6: require('../../assets/images/fruitdash6.png'),
  7: require('../../assets/images/fruitdash7.png'),
  8: require('../../assets/images/fruitdash8.png'),
  9: require('../../assets/images/fruitdash9.png'),
  0: require('../../assets/images/fruitdash0.png'),
  _: require('../../assets/images/fruitdashplace.png'),
};

const SpeedHotFruitDashFruitCount = () => {
  const fruitDashNavigation = useNavigation();
  const [fruitDashHasSeenIntro, setFruitDashHasSeenIntro] = useState(false);
  const [fruitDashGamePhase, setFruitDashGamePhase] = useState('intro');
  const [fruitDashRound, setFruitDashRound] = useState(1);
  const [fruitDashGrid, setFruitDashGrid] = useState(
    Array(fruitDashCountGridSize).fill(null),
  );
  const [fruitDashShowFruits, setFruitDashShowFruits] = useState(false);
  const [fruitDashUserInput, setFruitDashUserInput] = useState('');
  const [fruitDashAnswerChecked, setFruitDashAnswerChecked] = useState(false);
  const [fruitDashCorrectCount, setFruitDashCorrectCount] = useState(0);
  const [fruitDashResultColor, setFruitDashResultColor] = useState('#370102');
  const [fruitDashActualShown, setFruitDashActualShown] = useState(0);
  const fruitDashActualShownRef = useRef(0);
  const fruitDashTimerRef = useRef(null);
  const fruitDashTimeoutsRef = useRef([]);
  const [fruitDashIsFirstRound, setFruitDashIsFirstRound] = useState(true);
  const [fruitDashStartCountdown, setFruitDashStartCountdown] = useState(3);
  const [fruitDashShowStartCountdown, setFruitDashShowStartCountdown] =
    useState(false);
  const fruitDashClearAllTimers = () => {
    if (fruitDashTimerRef.current) clearTimeout(fruitDashTimerRef.current);
    fruitDashTimeoutsRef.current.forEach(t => clearTimeout(t));
    fruitDashTimeoutsRef.current = [];
  };

  useEffect(() => {
    let fruitDashTimeout;

    if (
      fruitDashIsFirstRound &&
      fruitDashShowStartCountdown &&
      fruitDashStartCountdown > 0
    ) {
      fruitDashTimeout = setTimeout(
        () =>
          setFruitDashStartCountdown(
            prevFruitDashCountdown => prevFruitDashCountdown - 1,
          ),
        1000,
      );
    } else if (
      fruitDashIsFirstRound &&
      fruitDashShowStartCountdown &&
      fruitDashStartCountdown === 0
    ) {
      setFruitDashShowStartCountdown(false);
      fruitDashStartRound();
    }

    return () => clearTimeout(fruitDashTimeout);
  }, [
    fruitDashStartCountdown,
    fruitDashShowStartCountdown,
    fruitDashIsFirstRound,
  ]);

  const fruitDashStartRound = () => {
    fruitDashClearAllTimers();

    setFruitDashGamePhase('show');
    setFruitDashAnswerChecked(false);
    setFruitDashUserInput('');
    setFruitDashShowFruits(true);

    fruitDashActualShownRef.current = 0;
    setFruitDashActualShown(0);

    const fruitDashFruitsCount = Math.floor(Math.random() * (16 - 5 + 1)) + 5;
    const fruitDashTotalTime = 9000;

    const fruitDashBaseIntervals = [900, 700, 550, 400];
    const fruitDashInterval =
      fruitDashBaseIntervals[Math.min(fruitDashRound - 1, 3)];

    let fruitDashShownCount = 0;
    let fruitDashSwitchedToInput = false;

    let fruitDashNewGrid = Array(fruitDashCountGridSize).fill(null);
    setFruitDashGrid([...fruitDashNewGrid]);

    const fruitDashGoToInput = () => {
      if (fruitDashSwitchedToInput) return;

      fruitDashSwitchedToInput = true;

      setFruitDashActualShown(fruitDashActualShownRef.current);
      setFruitDashShowFruits(false);
      setFruitDashGrid(Array(fruitDashCountGridSize).fill(null));
      setFruitDashGamePhase('input');
    };

    const fruitDashShowNextFruit = () => {
      if (fruitDashShownCount >= fruitDashFruitsCount) {
        setTimeout(fruitDashGoToInput, 400);
        return;
      }

      fruitDashNewGrid = Array(fruitDashCountGridSize).fill(null);

      const fruitDashRandomIndex = Math.floor(
        Math.random() * fruitDashCountGridSize,
      );
      const fruitDashRandomFruit =
        fruitDashFruits[Math.floor(Math.random() * fruitDashFruits.length)];

      fruitDashNewGrid[fruitDashRandomIndex] = fruitDashRandomFruit;
      setFruitDashGrid([...fruitDashNewGrid]);

      fruitDashShownCount++;
      fruitDashActualShownRef.current++;

      const fruitDashHideTimer = setTimeout(() => {
        fruitDashNewGrid[fruitDashRandomIndex] = null;
        setFruitDashGrid([...fruitDashNewGrid]);

        const fruitDashNextTimer = setTimeout(
          fruitDashShowNextFruit,
          fruitDashInterval / 1.2,
        );
        fruitDashTimeoutsRef.current.push(fruitDashNextTimer);
      }, fruitDashInterval / 1.4);

      fruitDashTimeoutsRef.current.push(fruitDashHideTimer);
    };

    fruitDashShowNextFruit();

    fruitDashTimerRef.current = setTimeout(() => {
      fruitDashGoToInput();
    }, fruitDashTotalTime + 300);
  };

  const fruitDashHandleNumberPress = fruitDashNum => {
    if (fruitDashGamePhase !== 'input') return;
    if (fruitDashAnswerChecked) return;

    setFruitDashUserInput(prevFruitDashInput =>
      prevFruitDashInput.length < 3
        ? prevFruitDashInput + fruitDashNum
        : prevFruitDashInput,
    );
  };

  const fruitDashHandleDelete = () => {
    if (fruitDashAnswerChecked) return;
    setFruitDashUserInput(prevFruitDashInput =>
      prevFruitDashInput.slice(0, -1),
    );
  };

  const fruitDashHandleSubmit = () => {
    const fruitDashUserAnswer = Number(fruitDashUserInput);
    const fruitDashIsCorrect = fruitDashUserAnswer === fruitDashActualShown;

    if (fruitDashIsCorrect) {
      setFruitDashCorrectCount(prevFruitDashCount => prevFruitDashCount + 1);
      setFruitDashResultColor('#03CE0A');
    } else {
      setFruitDashResultColor('#FF090D');
    }

    setFruitDashAnswerChecked(true);
  };

  const fruitDashSaveFinalFruitCountStats = async () => {
    try {
      const fruitDashEntry = {
        date: Date.now(),
        correct: fruitDashCorrectCount,
        total: fruitDashCountTotalRounds,
      };

      const fruitDashExisting = await AsyncStorage.getItem(
        'fruitdash_fruitcount_stats',
      );
      const fruitDashArr = fruitDashExisting
        ? JSON.parse(fruitDashExisting)
        : [];
      fruitDashArr.unshift(fruitDashEntry);

      await AsyncStorage.setItem(
        'fruitdash_fruitcount_stats',
        JSON.stringify(fruitDashArr),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const fruitDashHandleNextRound = async () => {
    setFruitDashAnswerChecked(false);
    setFruitDashUserInput('');

    if (fruitDashRound >= fruitDashCountTotalRounds) {
      await fruitDashSaveFinalFruitCountStats();
      setFruitDashGamePhase('end');
    } else {
      setFruitDashRound(prevFruitDashRound => prevFruitDashRound + 1);
      setFruitDashIsFirstRound(false);
      fruitDashStartRound();
    }
  };

  const fruitDashRestartGame = () => {
    setFruitDashRound(1);
    setFruitDashCorrectCount(0);
    setFruitDashUserInput('');
    setFruitDashAnswerChecked(false);

    setFruitDashIsFirstRound(true);
    setFruitDashStartCountdown(3);

    setFruitDashGamePhase('show');
    setFruitDashShowStartCountdown(true);

    setFruitDashGrid(Array(fruitDashCountGridSize).fill(null));
    setFruitDashShowFruits(false);
  };

  const fruitDashShareResult = async () => {
    try {
      await Share.share({
        message: `You have guessed the correct amount of fruit in ${fruitDashCorrectCount} rounds out of ${fruitDashCountTotalRounds}.`,
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
            <Text style={styles.fruitDashHeaderTitle}>Fruit Count</Text>
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

        {fruitDashGamePhase === 'intro' && !fruitDashHasSeenIntro && (
          <View style={styles.fruitDashIntroContainer}>
            <Image
              source={require('../../assets/images/fruitdashfruitcount.png')}
              style={styles.fruitDashIntroImage}
            />

            <View style={styles.fruitDashIntroBox}>
              <Text style={styles.fruitDashIntroTxt}>
                {`Different fruits appear quickly on the screen.
After the show is over, you need to indicate the correct number of fruits you saw.
If the score is accurate, you win, if not, you lose.

Reaction and attentiveness decide everything.`}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.fruitDashPlayBtnIntro}
              onPress={() => {
                setFruitDashHasSeenIntro(true);
                setFruitDashIsFirstRound(true);
                setFruitDashStartCountdown(3);
                setFruitDashShowStartCountdown(true);
                setFruitDashGrid(Array(fruitDashCountGridSize).fill(null));
                setFruitDashShowFruits(false);
                setFruitDashGamePhase('show');
              }}
            >
              <Image
                source={require('../../assets/images/fruitdashplay.png')}
              />
            </TouchableOpacity>
          </View>
        )}

        {fruitDashIsFirstRound && fruitDashShowStartCountdown && (
          <>
            <View style={styles.fruitDashCountdownBox}>
              <Text style={styles.fruitDashCountdownTxt}>
                {fruitDashStartCountdown}
              </Text>
            </View>

            <View style={styles.fruitDashGrid}>
              {fruitDashGrid.map((_, fruitDashIndex) => (
                <View key={fruitDashIndex} style={styles.fruitDashCell} />
              ))}
            </View>
          </>
        )}

        {!fruitDashShowStartCountdown &&
          fruitDashGamePhase === 'show' &&
          fruitDashHasSeenIntro && (
            <View style={styles.fruitDashCountdownBox}>
              <Text style={styles.fruitDashRoundTxt}>
                Round {fruitDashRound}/{fruitDashCountTotalRounds}
              </Text>
            </View>
          )}

        {!fruitDashShowStartCountdown && fruitDashGamePhase === 'show' && (
          <View style={styles.fruitDashGrid}>
            {fruitDashGrid.map((fruitDashImage, fruitDashIndex) => (
              <View key={fruitDashIndex} style={styles.fruitDashCell}>
                {fruitDashShowFruits && fruitDashImage && (
                  <Image
                    source={fruitDashImage}
                    style={styles.fruitDashFruitImg}
                  />
                )}
              </View>
            ))}
          </View>
        )}

        {fruitDashGamePhase === 'input' && (
          <>
            <View style={styles.fruitDashQuestionBox}>
              <Text style={styles.fruitDashQuestionTxt}>
                {fruitDashAnswerChecked
                  ? fruitDashResultColor === '#03CE0A'
                    ? 'The answer is correct!'
                    : 'The answer is not correct!'
                  : 'How many fruits did you count?'}
              </Text>
            </View>

            <View>
              <View
                style={[
                  styles.fruitDashAnswerBox,
                  fruitDashAnswerChecked && {
                    backgroundColor: fruitDashResultColor,
                  },
                ]}
              >
                <View style={styles.fruitDashAnswerRow}>
                  {[0, 1, 2].map(fruitDashIndex => {
                    const fruitDashIndexFromRight = 2 - fruitDashIndex;
                    const fruitDashChar =
                      fruitDashUserInput[
                        fruitDashUserInput.length - 1 - fruitDashIndexFromRight
                      ] ?? null;

                    return (
                      <View
                        key={fruitDashIndex}
                        style={styles.fruitDashAnswerSlot}
                      >
                        {fruitDashChar ? (
                          <Image
                            source={fruitDashNumpadImages[fruitDashChar]}
                            style={styles.fruitDashAnswerImg}
                          />
                        ) : (
                          <View style={styles.fruitDashEmptySpace} />
                        )}

                        <View style={styles.fruitDashUnderline} />
                      </View>
                    );
                  })}
                </View>
              </View>
              <TouchableOpacity
                style={styles.fruitDashDeleteBtn}
                onPress={fruitDashHandleDelete}
              >
                <Image
                  source={require('../../assets/images/fruitdashdel.png')}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.fruitDashNumpad}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(
                fruitDashNum => (
                  <TouchableOpacity
                    key={fruitDashNum}
                    style={styles.fruitDashNumBtn}
                    onPress={() => fruitDashHandleNumberPress(fruitDashNum)}
                  >
                    <Image
                      source={fruitDashNumpadImages[fruitDashNum]}
                      style={styles.fruitDashNumImg}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ),
              )}
            </View>

            <View style={{ marginTop: 10 }}>
              {!fruitDashAnswerChecked ? (
                <TouchableOpacity
                  style={[
                    styles.fruitDashPlayBtn,
                    fruitDashUserInput.length === 0 && { opacity: 0.7 },
                  ]}
                  disabled={fruitDashUserInput.length === 0}
                  onPress={fruitDashHandleSubmit}
                >
                  <Image
                    source={require('../../assets/images/fruitdashplay.png')}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.fruitDashNextRoundBtn}
                  onPress={fruitDashHandleNextRound}
                >
                  <Text style={styles.fruitDashNextBtnTxt}>Next round</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        {fruitDashGamePhase === 'end' && (
          <View style={styles.fruitDashResultContainer}>
            <Image
              source={require('../../assets/images/fruitdashfruitcount.png')}
              style={{ marginBottom: 34 }}
            />

            <View style={styles.fruitDashResultBox}>
              <Text style={[styles.fruitDashResultTxt, { marginBottom: 30 }]}>
                Result
              </Text>
              <Text style={styles.fruitDashResultTxt}>
                You have guessed the correct amount of fruit in{' '}
                {fruitDashCorrectCount} rounds out of{' '}
                {fruitDashCountTotalRounds}.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 35 }}>
              <TouchableOpacity
                style={styles.fruitDashPlayAgainBtn}
                onPress={fruitDashRestartGame}
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
  fruitDashCountdownBox: {
    backgroundColor: '#370102',
    borderColor: '#F1B931',
    borderWidth: 1.5,
    borderRadius: 16,
    width: 147,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 37,
  },
  fruitDashCountdownTxt: {
    color: '#fff',
    fontSize: 44,
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitDashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
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
  fruitDashRoundTxt: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitDashGrid: {
    width: fruitDashWidth * 0.8,
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fruitDashCell: {
    width: '25%',
    height: '25%',
    backgroundColor: '#370102',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1B931',
  },
  fruitDashFruitImg: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  fruitDashIntroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fruitDashIntroImage: {
    marginBottom: 30,
  },
  fruitDashIntroBox: {
    backgroundColor: '#370102',
    borderWidth: 2,
    borderColor: '#F1B931',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  fruitDashIntroTxt: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  fruitDashPlayBtnIntro: {
    backgroundColor: '#370102',
    borderColor: '#F1B931',
    borderWidth: 2,
    borderRadius: 20,
    width: 139,
    height: 89,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fruitDashQuestionBox: {
    width: '90%',
    paddingVertical: 45,
    justifyContent: 'center',
    backgroundColor: '#370102',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F1B931',
    alignItems: 'center',
    marginTop: 10,
  },
  fruitDashQuestionTxt: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
  },
  fruitDashAnswerBox: {
    backgroundColor: '#370102',
    borderColor: '#F1B931',
    borderWidth: 2,
    borderRadius: 16,
    padding: 12,
    marginTop: 34,
    marginBottom: 54,
    width: 210,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fruitDashAnswerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fruitDashAnswerSlot: {
    alignItems: 'center',
  },
  fruitDashAnswerImg: {
    marginBottom: 6,
  },
  fruitDashEmptySpace: {
    width: 40,
    height: 48.5,
    marginBottom: 6,
  },
  fruitDashUnderline: {
    width: 48,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  fruitDashDeleteBtn: {
    backgroundColor: '#370102',
    borderColor: '#F1B931',
    borderWidth: 1.5,
    borderRadius: 14,
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -80,
    top: 65,
  },

  fruitDashNumpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    gap: 4,
  },
  fruitDashNumBtn: {
    backgroundColor: '#370102',
    borderRadius: 16,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  fruitDashPlayBtn: {
    backgroundColor: '#370102',
    borderColor: '#F1B931',
    borderWidth: 2,
    borderRadius: 20,
    width: 139,
    height: 89,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fruitDashNextBtnTxt: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
  },

  fruitDashResultContainer: {
    alignItems: 'center',
    width: '100%',
  },
  fruitDashResultBox: {
    backgroundColor: '#370102',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F1B931',
    paddingBottom: 60,
    marginBottom: 30,
    padding: 10,
    width: '100%',
  },
  fruitDashResultTxt: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Montserrat-Regular',
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

  fruitDashNextRoundBtn: {
    backgroundColor: '#370102',
    borderWidth: 2,
    borderColor: '#F1B931',
    borderRadius: 18,
    width: 230,
    height: 89,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpeedHotFruitDashFruitCount;
