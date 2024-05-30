import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { styles } from '@/constants/Styles'
import { FIREBASE_DB, FIREBASE_STORAGE } from '@/FirebaseConfig'
import { Timestamp, deleteDoc, doc } from 'firebase/firestore'
import { router } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons'
import { usePostContext } from './PostsContext'
import { deleteObject, ref } from 'firebase/storage'

interface Post {
    id: string;
    author_id: string;
    author_username: string;
    title: string;
    description: string;
    price: string;
    createdAt: Timestamp;
}

const Post = ({ myPosts, id, title, price, createdAt }: { myPosts: boolean, id: string, author: string, title: string, description: string, price: string, createdAt: Timestamp }) => {
    const { setMyPostsUpdated } = usePostContext()

    const deletePostDoc = async () => {
        const imageRef = ref(FIREBASE_STORAGE, `Pictures/${id}`);
        await deleteDoc(doc(FIREBASE_DB, 'posts', id))
        await deleteObject(imageRef);
        setMyPostsUpdated(true)
    }

    const deletePost = async () => {
        Alert.alert('Delete post?', '', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => deletePostDoc() },
        ])
    }

    const getTimeDifference = (timestamp: Timestamp) => {
        const now = new Date();
        const postDate = timestamp.toDate();
        const diffInMs = now.getTime() - postDate.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) {
            return 'Just now'
        }
        if (diffInMinutes < 60) {
            return `${diffInMinutes} min${diffInHours !== 1 ? 's' : ''} ago`;
        }
        if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else {
            return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        }
    };

    return (
        <TouchableOpacity onPress={() => router.push(`/post/${id}`)} style={styles.post} activeOpacity={0.75}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text style={{ color: '#fff', fontSize: 25, width: 240, fontFamily: 'lex-reg' }}>{title} <Text style={{ color: '#dedede', fontSize: 25, fontFamily: 'lex-light' }}>${price}</Text></Text>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', height: 80 }}>
                    {myPosts ?
                        <TouchableOpacity onPress={deletePost} activeOpacity={0.75} style={{ margin: 5 }}>
                            <FontAwesome5 name='trash' size={30} color='red' />
                        </TouchableOpacity> : <View style={{ height: 35 }} />}
                    <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'lex-light' }}>
                        {getTimeDifference(createdAt)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default Post
