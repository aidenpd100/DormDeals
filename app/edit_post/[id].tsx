import { View, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Post from '@/components/Post'
import { styles } from '@/constants/Styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BackArrow from '@/components/BackArrow'
import { router, useLocalSearchParams } from 'expo-router'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '@/FirebaseConfig'
import { usePostContext } from '@/components/PostsContext'

const EditPost = () => {
    const { setMyPostsUpdated } = usePostContext()
    const { id } = useLocalSearchParams()
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [post, setPost] = useState<Post | undefined>(undefined)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')

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
        setTitle(post ? post.title : '')
        setDescription(post ? post.description : '')
        setPrice(post ? post.price : '')
    }, [post])

    const updatePost = async () => {
        try {
            if (title == '') {
                throw Error('No title provided')
            }
            if (title == post!.title && description == post!.description && price == post!.price) {
                throw Error('No changes were made')
            }

            setUpdating(true)
            await setDoc(doc(FIREBASE_DB, 'posts', id!.toString()), {
                title: title,
                description: description,
                price: price
            }, { merge: true });
            setUpdating(false)
            setMyPostsUpdated(true)
            router.back()
        } catch (err: any) {
            Alert.alert(err.toString())
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
                <BackArrow />
                <Text style={styles.title}>Edit Post</Text>
                {loading ? <ActivityIndicator /> :
                    <>
                        <KeyboardAvoidingView>
                            <TextInput style={styles.input} placeholder='Title' placeholderTextColor='#4a4a4a' autoCapitalize='none' onChangeText={(text) => setTitle(text)}>{title}</TextInput>
                            <TextInput multiline={true} style={[styles.input, { height: 100 }]} placeholder='Description' placeholderTextColor='#4a4a4a' autoCapitalize='none' onChangeText={(text) => setDescription(text)} >{description}</TextInput>
                            <TextInput style={styles.input} placeholder='Price' placeholderTextColor='#4a4a4a' keyboardType={'numeric'} onChangeText={(price) => setPrice(price)} >{price}</TextInput>
                        </KeyboardAvoidingView>
                        <>
                            <TouchableOpacity onPress={updatePost} style={styles.button} activeOpacity={0.75}>
                                {updating ? <ActivityIndicator /> :
                                    <Text style={{ fontFamily: 'lex-sb', fontSize: 17 }}>Update</Text>
                                }
                            </TouchableOpacity>
                        </>
                    </>
                }
            </View>
        </TouchableWithoutFeedback>
    )
}

export default EditPost