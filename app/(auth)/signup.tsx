import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '@/constants/Styles'
import Images from '@/constants/images'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { Link } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons'

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const signUp = async () => {
        setLoading(true)
        try {
            if (email == '') {
                throw Error('No email provided')
            }
            if (username == '') {
                throw Error('No username provided')
            }
            if (username.indexOf(' ') >= 0) {
                throw Error('Usernames cannot contain spaces')
            }
            if (password.indexOf(' ') >= 0) {
                throw Error('Passwords cannot contain spaces')
            }

            const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password).then(async (registeredUser) => {
                await setDoc(doc(collection(FIREBASE_DB, 'users'), registeredUser.user.uid), {
                    username: username,
                    createdAt: serverTimestamp()
                })
            })
        } catch (err: any) {
            console.log('Sign up failed ' + err)
            if (err.toString() == "FirebaseError: Firebase: Error (auth/invalid-email).") {
                Alert.alert('Error: Invalid email address')
            } else if (err.toString() == "FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).") {
                Alert.alert('Error: Password should be at least 6 characters')
            } else if (err.toString() == "FirebaseError: Firebase: Error (auth/email-already-in-use).") {
                Alert.alert('Error: An account is already associated with this email')
            } else {
                Alert.alert(err.toString())
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
                <Image source={Images.logoTitle} style={{ marginTop: 60, marginBottom: 120, width: 350, height: 70, resizeMode: 'contain' }}></Image>

                <Link href='signin' style={{ color: '#A8A8A8', fontFamily: 'lex-reg', fontSize: 17, textDecorationLine: 'underline', marginBottom: 20 }}>Already have an account?</Link>
                <KeyboardAvoidingView>
                    <TextInput style={styles.input} placeholder='Email' placeholderTextColor='#4a4a4a' autoCapitalize='none' onChangeText={(text) => setEmail(text)} />
                    <TextInput style={styles.input} placeholder='Username' placeholderTextColor='#4a4a4a' autoCapitalize='none' onChangeText={(text) => setUsername(text)} />
                    <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
                        <TextInput style={{ flex: 1, color: '#fff', fontFamily: 'lex-light', fontSize: 17 }} placeholder='Password' placeholderTextColor='#4a4a4a' autoCapitalize='none' secureTextEntry={!showPassword} onChangeText={(text) => setPassword(text)} />
                        <TouchableOpacity onPress={toggleShowPassword}>
                            <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#A8A8A8" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
                <>
                    <TouchableOpacity style={styles.button} activeOpacity={0.75} onPress={signUp}>
                        {loading ? <ActivityIndicator /> :
                            <Text style={{ fontFamily: 'lex-sb', fontSize: 17, color: '#fff' }}>Sign up</Text>
                        }
                    </TouchableOpacity>
                </>
            </SafeAreaView>
        </TouchableWithoutFeedback >
    )
}

export default SignUp