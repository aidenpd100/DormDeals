import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '@/constants/Styles'
import Images from '@/constants/images'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons'

const SignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const auth = FIREBASE_AUTH

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const signIn = async () => {
        setLoading(true)
        try {
            const response = await signInWithEmailAndPassword(auth, email, password)
        } catch (err) {
            console.log('Sign in failed ' + err)
            Alert.alert('Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
                <Image source={Images.logoTitle} style={{ marginTop: 60, marginBottom: 140, width: 350, height: 70, resizeMode: 'contain' }}></Image>

                <Link href='signup' style={{ color: '#A8A8A8', fontFamily: 'lex-reg', fontSize: 17, textDecorationLine: 'underline', marginBottom: 20 }}>Don't have an account?</Link>
                <KeyboardAvoidingView>
                    <TextInput style={styles.input} placeholder='Email' placeholderTextColor='#4a4a4a' autoCapitalize='none' onChangeText={(text) => setEmail(text)} />
                    <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
                        <TextInput style={{ flex: 1, color: '#fff', fontFamily: 'lex-light', fontSize: 17 }} placeholder='Password' placeholderTextColor='#4a4a4a' autoCapitalize='none' secureTextEntry={!showPassword} onChangeText={(text) => setPassword(text)} />
                        <TouchableOpacity onPress={toggleShowPassword}>
                            <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#A8A8A8" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
                <>
                    <TouchableOpacity style={styles.button} activeOpacity={0.75} onPress={signIn}>
                        {loading ? <ActivityIndicator /> :
                            <Text style={{ fontFamily: 'lex-sb', fontSize: 17, color: '#fff' }}>Sign in</Text>
                        }
                    </TouchableOpacity>
                </>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default SignIn