import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import TabOneScreen from '.';
import Profile from './profile';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import MyPosts from './my_posts';
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import Inbox from './inbox';
import Chat from '@/components/Chat';
import Post from '@/components/Post';

const Tab = createBottomTabNavigator();

export default function TabLayout({ username }: { username: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  const fetchMyPosts = async () => {
    try {
      const q = query(collection(FIREBASE_DB, 'posts'), orderBy('createdAt', 'desc'), where('author_id', '==', FIREBASE_AUTH.currentUser!.uid));
      const querySnapshot = await getDocs(q);
      const postsList: Post[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsList);
    } catch (error) {
      console.error("Error fetching posts: ", error);
    }

    if (!username) {
      console.error("Username is not defined.");
      return;
    }
  };

  const fetchChats = async () => {
    try {
      const q = query(
        collection(FIREBASE_DB, 'chats'),
        where('participants', 'array-contains', username),
        orderBy('lastMessageTimestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const chatsList: Chat[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];

      setChats(chatsList);
    } catch (error) {
      console.error("Error fetching chats: ", error);
    }
  }

  useEffect(() => {
    fetchMyPosts();
    fetchChats();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#222222', borderTopWidth: 0, height: 90 },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Explore"
        component={TabOneScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarLabelStyle: { fontFamily: 'lex-sb' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyPosts"
        options={{
          tabBarLabel: 'My Posts',
          tabBarLabelStyle: { fontFamily: 'lex-sb' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash" color={color} size={size} />
          ),
        }}
      >
        {props => <MyPosts {...props} postsIn={posts} />}
      </Tab.Screen>
      <Tab.Screen
        name="Inbox"
        options={{
          tabBarLabel: 'Inbox',
          tabBarLabelStyle: { fontFamily: 'lex-sb' },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="inbox" color={color} size={size} />
          ),
        }}
      >
        {props => <Inbox {...props} username={username} chatsIn={chats} />}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarLabelStyle: { fontFamily: 'lex-sb' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      >
        {props => <Profile {...props} username={username} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
