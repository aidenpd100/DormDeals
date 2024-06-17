import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from './(auth)/signin';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import TabLayout from './(tabs)/_layout';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SignIn from './(auth)/signin';
import SignUp from './(auth)/signup';
import CreatePost from './create_post';
import { doc, getDoc } from 'firebase/firestore';
import PostPage from './post/[id]';
import { PostProvider } from '@/components/PostsContext';
import { Text } from 'react-native';
import NewChatPage from './chat/new';
import ChatPage from './chat/[id]';
import EditPost from './edit_post/[id]';
import ExpandImage from './expand_image/[url]';
import ChangePassword from './change_password';

// @ts-ignore
Text.defaultProps = { ...(Text.defaultProps || {}), allowFontScaling: false }

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'lex-xlight': require('../assets/fonts/LexendDeca-ExtraLight.ttf'),
    'lex-light': require('../assets/fonts/LexendDeca-Light.ttf'),
    'lex-reg': require('../assets/fonts/LexendDeca-Regular.ttf'),
    'lex-sb': require('../assets/fonts/LexendDeca-SemiBold.ttf')
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PostProvider>
      <RootLayoutNav />
    </PostProvider>
  )
}

const Stack = createNativeStackNavigator()

function RootLayoutNav() {
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState('')

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user)
      if (user) {
        fetchUsername(user.uid)
      }
    })
  })

  const fetchUsername = useCallback(async (uid: string) => {
    try {
      const docRef = doc(FIREBASE_DB, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsername(docSnap.data()?.username);
      }
    } catch (error) {
      console.error("Error fetching username: ", error);
    }
  }, []);

  return (
    <Stack.Navigator>
      {user && username ? <Stack.Screen name='(tabs)' options={{ headerShown: false, gestureEnabled: false }}>
        {props => <TabLayout {...props} username={username} />}
      </Stack.Screen> :
        <>
          <Stack.Screen name='(auth)/signin' component={SignIn} options={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_left' }} />
          <Stack.Screen name='(auth)/signup' component={SignUp} options={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_left' }} />
        </>
      }
      <Stack.Screen name='create_post' options={{ headerShown: false }}>
        {props => <CreatePost {...props} username={username} />}
      </Stack.Screen>
      <Stack.Screen name='post/[id]' component={PostPage} options={{ headerShown: false }} />
      <Stack.Screen name='chat/[id]' options={{ headerShown: false }}>
        {props => <ChatPage {...props} username={username} />}
      </Stack.Screen>
      <Stack.Screen name='chat/new' options={{ headerShown: false }}>
        {props => <NewChatPage {...props} username={username} />}
      </Stack.Screen>
      <Stack.Screen name='edit_post/[id]' component={EditPost} options={{ headerShown: false }} />
      <Stack.Screen name='expand_image/[url]' component={ExpandImage} options={{ animation: 'fade', animationDuration: 100, headerShown: false }} />
      <Stack.Screen name='change_password' component={ChangePassword} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
