import { createStackNavigator } from '@react-navigation/stack';
import SpeedHotFruitDashOnboard from '../ScreensSpeedHotFruitDash/SpeedHotFruitDashOnboard';
import SpeedHotFruitDashHome from '../ScreensSpeedHotFruitDash/SpeedHotFruitDashHome';
import SpeedHotFruitDashAbout from '../ScreensSpeedHotFruitDash/SpeedHotFruitDashAbout';
import SpeedHotFruitDashSpeedChoice from '../ScreensSpeedHotFruitDash/SpeedHotFruitDashSpeedChoice';
import SpeedHotFruitDashFruitCount from '../ScreensSpeedHotFruitDash/SpeedHotFruitDashFruitCount';
import SpeedHotFruitDashFruitStatistics from '../ScreensSpeedHotFruitDash/SpeedHotFruitDashFruitStatistics';

const Stack = createStackNavigator();

const SpeedHotFruitDashStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SpeedHotFruitDashOnboard"
        component={SpeedHotFruitDashOnboard}
      />
      <Stack.Screen
        name="SpeedHotFruitDashHome"
        component={SpeedHotFruitDashHome}
      />
      <Stack.Screen
        name="SpeedHotFruitDashAbout"
        component={SpeedHotFruitDashAbout}
      />
      <Stack.Screen
        name="SpeedHotFruitDashSpeedChoice"
        component={SpeedHotFruitDashSpeedChoice}
      />
      <Stack.Screen
        name="SpeedHotFruitDashFruitCount"
        component={SpeedHotFruitDashFruitCount}
      />
      <Stack.Screen
        name="SpeedHotFruitDashFruitStatistics"
        component={SpeedHotFruitDashFruitStatistics}
      />
    </Stack.Navigator>
  );
};

export default SpeedHotFruitDashStack;
