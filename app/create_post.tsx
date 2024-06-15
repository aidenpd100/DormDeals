import { View, Text, KeyboardAvoidingView, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styles } from '@/constants/Styles'
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '@/FirebaseConfig'
import { router } from 'expo-router'
import { usePostContext } from '@/components/PostsContext'
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { manipulateAsync } from 'expo-image-manipulator';
import BackArrow from '@/components/BackArrow'

const CreatePost = ({ username }: { username: string }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [posting, setPosting] = useState(false)
    const { setMyPostsUpdated } = usePostContext()
    const [image, setImage] = useState('')
    const [uploading, setUploading] = useState(false)

    const uploadPost = async () => {
        try {
            if (title == '') {
                throw Error('No title provided')
            }
            if (image == '') {
                throw Error('No image provided')
            }
            setPosting(true)
            const postRef = doc(collection(FIREBASE_DB, 'posts'))
            await setDoc(postRef, {
                author_id: FIREBASE_AUTH.currentUser?.uid,
                author_username: username,
                title: title,
                description: description,
                price: price,
                createdAt: serverTimestamp()
            })
            uploadImage(postRef.id)
            setPosting(false)
            setMyPostsUpdated(true)
            router.back()
        } catch (err: any) {
            Alert.alert(err.toString())
        }
    }

    const imagePrompt = async () => {
        Alert.alert('Select a method', '', [
            { text: 'Take Image', onPress: () => pickImage('camera') },
            { text: 'Choose Image', onPress: () => pickImage('library') },
        ])
    }

    const pickImage = async (method: 'camera' | 'library') => {
        let result
        if (method === 'camera') {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
            if (cameraStatus !== 'granted') {
                Alert.alert('You must enable access to camera in your device settings')
                return
            }
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
        } else {
            const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (libraryStatus !== 'granted') {
                Alert.alert('You must enable access to photos in your device settings')
                return
            }
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
            });
        }

        if (!result.canceled) {
            const manipulateResult = await manipulateAsync(
                result.assets[0].uri,
                [],
                { compress: 0.1 } // from 0 to 1 "1 for best quality"
            );
            setImage(manipulateResult.uri);
        }
    }

    const uploadImage = async (postID: string) => {
        const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response as Blob);
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', image, true);
            xhr.send(null);
        });

        const storageRef = ref(FIREBASE_STORAGE, `Pictures/${postID}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        return new Promise<string>((resolve, reject) => {
            uploadTask.on('state_changed',
                () => {
                    setUploading(true);
                },
                (error) => {
                    setUploading(false);
                    console.log(error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setUploading(false);
                        resolve(url);
                    });
                }
            );
        });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
                <BackArrow />
                <Text style={styles.title}>Create Post</Text>
                <KeyboardAvoidingView>
                    <TextInput style={styles.input} placeholder='Title' placeholderTextColor='#4a4a4a' autoCapitalize='none' onChangeText={(text) => setTitle(text)} />
                    <TextInput multiline={true} style={[styles.input, { height: 100 }]} placeholder='Description' placeholderTextColor='#4a4a4a' autoCapitalize='none' onChangeText={(text) => setDescription(text)} />
                    <TextInput style={styles.input} placeholder='Price' placeholderTextColor='#4a4a4a' keyboardType={'numeric'} onChangeText={(price) => setPrice(price)} />
                </KeyboardAvoidingView>
                {image ? <Image source={{ uri: image }} style={{ width: 200, height: 200, marginVertical: 15 }} /> : null}
                <TouchableOpacity onPress={imagePrompt} style={[styles.button, { backgroundColor: '#8A8A8A' }]} activeOpacity={0.75}>
                    <Text style={{ fontFamily: 'lex-reg', fontSize: 17 }}>Attach Image</Text>
                </TouchableOpacity>
                <>
                    <TouchableOpacity onPress={uploadPost} style={styles.button} activeOpacity={0.75}>
                        {posting ? <ActivityIndicator /> :
                            <Text style={{ fontFamily: 'lex-sb', fontSize: 17 }}>Post</Text>
                        }
                    </TouchableOpacity>
                </>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default CreatePost