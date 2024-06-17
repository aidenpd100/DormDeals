import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { styles } from '@/constants/Styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/Header';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { Firestore, collection, doc, getDoc, query, where } from 'firebase/firestore'
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword } from 'firebase/auth'
import { router } from 'expo-router'

const ChangePassword = () => {
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword1, setShowNewPassword1] = useState(false)
    const [showNewPassword2, setShowNewPassword2] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword1, setNewPassword1] = useState('')
    const [newPassword2, setNewPassword2] = useState('')

    const changePassword = async () => {
        if (newPassword1.indexOf(' ') >= 0) {
            Alert.alert('Passwords cannot contain spaces')
        } else if (newPassword1 == '') {
            Alert.alert('You must enter a password')
        } else if (newPassword1 == newPassword2) {
            Alert.alert('Are you sure?', 'You will automatically be signed out', [
                {
                    text: 'Change Password', onPress: async () => {
                        try {
                            const credential = EmailAuthProvider.credential(
                                FIREBASE_AUTH.currentUser!.email!,
                                oldPassword
                            )
                            await reauthenticateWithCredential(FIREBASE_AUTH.currentUser!, credential)
                            await updatePassword(FIREBASE_AUTH.currentUser!, newPassword1)
                            Alert.alert('Password changed successfully!')
                            router.back()
                        } catch (err: any) {
                            console.log(err.toString())
                            if (err.toString() == "FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).") {
                                Alert.alert('Error: Password should be at least 6 characters')
                            } else if (err.toString() == "FirebaseError: Firebase: Error (auth/invalid-credential).") {
                                Alert.alert('Incorrect current password')
                            }
                        }

                    }
                },
                { text: 'Cancel', onPress: () => { } },
            ])
        } else {
            Alert.alert('Passwords do not match')
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
                <Header title='Change Password' />
                <View style={[styles.input, { flexDirection: 'row', alignItems: 'center', marginTop: 30 }]}>
                    <TextInput style={{ flex: 1, color: '#fff', fontFamily: 'lex-light', fontSize: 17 }} placeholder='Current password' placeholderTextColor='#4a4a4a' autoCapitalize='none' secureTextEntry={!showOldPassword} onChangeText={(text) => setOldPassword(text)} />
                    <TouchableOpacity onPress={() => { setShowOldPassword(!showOldPassword) }}>
                        <FontAwesome5 name={showOldPassword ? 'eye-slash' : 'eye'} size={20} color="#A8A8A8" />
                    </TouchableOpacity>
                </View>
                <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
                    <TextInput style={{ flex: 1, color: '#fff', fontFamily: 'lex-light', fontSize: 17 }} placeholder='New password' placeholderTextColor='#4a4a4a' autoCapitalize='none' secureTextEntry={!showNewPassword1} onChangeText={(text) => setNewPassword1(text)} />
                    <TouchableOpacity onPress={() => { setShowNewPassword1(!showNewPassword1) }}>
                        <FontAwesome5 name={showNewPassword1 ? 'eye-slash' : 'eye'} size={20} color="#A8A8A8" />
                    </TouchableOpacity>
                </View>
                <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
                    <TextInput style={{ flex: 1, color: '#fff', fontFamily: 'lex-light', fontSize: 17 }} placeholder='Repeat password' placeholderTextColor='#4a4a4a' autoCapitalize='none' secureTextEntry={!showNewPassword2} onChangeText={(text) => setNewPassword2(text)} />
                    <TouchableOpacity onPress={() => { setShowNewPassword2(!showNewPassword2) }}>
                        <FontAwesome5 name={showNewPassword2 ? 'eye-slash' : 'eye'} size={20} color="#A8A8A8" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} activeOpacity={0.75} onPress={changePassword}>
                    <Text style={{ fontFamily: 'lex-sb', fontSize: 17, color: '#fff' }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default ChangePassword