import { View, Text, ActivityIndicator, TouchableOpacity, Touchable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router, useLocalSearchParams, useNavigation } from 'expo-router'
import Post from '@/components/Post'
import { Timestamp, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '@/FirebaseConfig'
import { styles } from '@/constants/Styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ImageDisplay from '@/components/ImageDisplay'
import { Ionicons } from '@expo/vector-icons'
import MessageButton from '@/components/MessageButton'
import { usePostContext } from '@/components/PostsContext'

const PostPage = () => {
    const { myPostsUpdated, setMyPostsUpdated } = usePostContext()
    const { id } = useLocalSearchParams()
    const [loading, setLoading] = useState(false)
    const [post, setPost] = useState<Post | undefined>(undefined)

    const fetchPost = async () => {
        setLoading(true)
        try {
            const postRef = doc(FIREBASE_DB, 'posts', id!.toString())
            const docSnap = await getDoc(postRef)
            if (docSnap.exists()) {
                setPost({ id: docSnap.id, ...docSnap.data() } as Post)
            } else {
                console.error("No such document!")
            }
        } catch (error) {
            console.error("Error fetching posts: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);

    useEffect(() => {
        if (myPostsUpdated) {
            fetchPost().then(() => setMyPostsUpdated(false));
        }
    }, [myPostsUpdated]);

    const formatDate = (timestamp: Timestamp) => {
        const date = timestamp.toDate();
        return date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
            <TouchableOpacity style={{ width: '100%', alignItems: 'flex-start', marginTop: 10, marginLeft: 20 }} onPress={() => router.back()}>
                <Ionicons name='chevron-back' color='#fff' size={30}></Ionicons>
            </TouchableOpacity>
            {loading ? <ActivityIndicator style={{ marginTop: 30 }} /> :
                post ? (
                    <>
                        <Text style={{ color: '#8A8A8A', fontSize: 20, fontFamily: 'lex-xlight', marginTop: 10 }}>Author: {post.author_username}</Text>
                        {post.createdAt && (
                            <Text style={{ color: '#8A8A8A', fontSize: 20, fontFamily: 'lex-xlight', marginTop: 10 }}>
                                Posted on: {formatDate(post.createdAt)}
                            </Text>
                        )}
                        <Text style={{ color: '#fff', fontSize: 35, fontFamily: 'lex-sb', marginTop: 30 }}>{post.title}</Text>
                        <Text style={{ color: '#fff', fontSize: 23, fontFamily: 'lex-xlight' }}>Asking price: ${post.price}</Text>
                        <Text style={{ color: '#fff', fontSize: 23, fontFamily: 'lex-light', margin: 10 }}>{post.description}</Text>
                        <ImageDisplay postID={id!.toString()} />
                        {FIREBASE_AUTH.currentUser?.uid != post.author_id ?
                            <MessageButton toUsername={post.author_username} />
                            : <TouchableOpacity style={[styles.button, { marginTop: 20 }]} activeOpacity={0.75} onPress={() => router.push(`/edit_post/${post.id}`)}>
                                <Text style={{ color: '#fff', fontFamily: 'lex-reg', fontSize: 17 }}>Edit Post</Text>
                            </TouchableOpacity>
                        }

                    </>
                ) : (
                    <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'lex-light', marginTop: 10 }}>Post not found</Text>
                )
            }

        </View>
    )
}

export default PostPage