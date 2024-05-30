import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import Header from '@/components/Header';
import Post from '@/components/Post';
import { styles } from '@/constants/Styles';
import { Timestamp, collection, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePostContext } from '@/components/PostsContext';

export default function TabOneScreen() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { myPostsUpdated, setMyPostsUpdated } = usePostContext();

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const q = query(collection(FIREBASE_DB, 'posts'), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q);
      const postsList: Post[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsList);
    } catch (error) {
      console.error("Error fetching posts: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (myPostsUpdated) {
      fetchPosts().then(() => setMyPostsUpdated(false));
    }
  }, [myPostsUpdated]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const Item = ({ id, author, title, description, price, createdAt }: { id: string, author: string, title: string, description: string, price: string, createdAt: Timestamp }) => (
    <Post myPosts={false} id={id} author={author} title={title} description={description} price={price} createdAt={createdAt} />
  );
  const renderItem = ({ item }: { item: Post }) => (
    <Item id={item.id} author={item.author_username} title={item.title} description={item.description} price={item.price} createdAt={item.createdAt} />
  );

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', paddingTop: useSafeAreaInsets().top }}>
        <Header title='Latest Deals' />
      </View >
      {loading && !refreshing ? <ActivityIndicator style={{ marginTop: 40 }} /> :
        <FlatList contentContainerStyle={{ alignItems: 'center' }} style={{ width: '100%' }} data={posts} renderItem={renderItem} refreshControl={<RefreshControl tintColor={'#8A8A8A'} refreshing={refreshing} onRefresh={onRefresh}></RefreshControl>} keyExtractor={(item) => item.id.toString()} />
      }
    </View>
  );
}


