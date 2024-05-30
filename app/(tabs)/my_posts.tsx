import { View, Text, TouchableOpacity, RefreshControl, FlatList, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '@/components/Header'
import { router, useFocusEffect } from 'expo-router'
import { styles } from '@/constants/Styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Post from '@/components/Post'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { usePostContext } from '@/components/PostsContext'

const MyPosts = ({ postsIn }: { postsIn: Post[] }) => {

    const [posts, setPosts] = useState<Post[]>(postsIn);
    const { myPostsUpdated, setMyPostsUpdated } = usePostContext();


    const fetchPosts = async () => {
        try {
            const q = query(collection(FIREBASE_DB, 'posts'), orderBy('createdAt', 'desc'), where('author_id', '==', FIREBASE_AUTH.currentUser!.uid))
            const querySnapshot = await getDocs(q);
            const postsList: Post[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Post[];
            setPosts(postsList);
        } catch (error) {
            console.error("Error fetching posts: ", error);
        }
    };

    useEffect(() => {
        if (myPostsUpdated) {
            fetchPosts().then(() => setMyPostsUpdated(false));
        }
    }, [myPostsUpdated]);

    const renderItem = ({ item }: { item: Post }) => (
        <Post myPosts={true} id={item.id} author={item.author_username} title={item.title} description={item.description} price={item.price} createdAt={item.createdAt} />
    );

    return (
        <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
            <Header title='My Posts' />
            <TouchableOpacity onPress={() => router.push('create_post')} style={[styles.button, { marginTop: 30 }]} activeOpacity={0.75}>
                <Text style={{ fontFamily: 'lex-sb', fontSize: 17 }}>Create New Post</Text>
            </TouchableOpacity>
            <FlatList contentContainerStyle={{ alignItems: 'center' }} style={{ width: '100%' }} data={posts} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
        </View>
    )
}

export default MyPosts