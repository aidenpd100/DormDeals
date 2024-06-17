import { View, Text, Button, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from '@/constants/Styles'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '@/FirebaseConfig'
import { User, deleteUser } from 'firebase/auth'
import { Firestore, collection, deleteDoc, doc, getDoc, getDocFromServer, getDocs, getFirestore, query, where } from 'firebase/firestore'
import Header from '@/components/Header'
import { ref } from 'firebase/storage'
import { router } from 'expo-router'

const Profile = ({ username }: { username: string }) => {

    const [loadingOut, setLoadingOut] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)

    const signOut = async (onlySignOut: boolean) => {
        try {
            onlySignOut && setLoadingOut(true)
            await FIREBASE_AUTH.signOut()
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingOut(false)
        }
    }

    const deletePrompt = async () => {
        Alert.alert('Are you sure?', 'Your account will be permanently deleted', [
            { text: 'Delete', onPress: () => deleteAccount() },
            { text: 'Cancel', onPress: () => { } },
        ])
    }

    const deleteAccount = async () => {
        try {
            setLoadingDelete(true)
            const deletedUid = FIREBASE_AUTH.currentUser!.uid
            const deletedUser = FIREBASE_AUTH.currentUser!

            signOut(false)
            await deleteDoc(doc(FIREBASE_DB, 'users', deletedUid));
            deleteUser(deletedUser)

            const q = query(collection(FIREBASE_DB, 'posts'), where('author_id', '==', deletedUid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref)
            });

            //TODO: delete messages? or just send a deleted account message?
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingDelete(false)
        }
    }

    return (
        <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
            <Header title='Profile' />
            <Text style={{ color: '#fff', fontFamily: 'lex-xlight', marginTop: 30, marginBottom: 20, fontSize: 20 }}>Username: {username}</Text>
            <TouchableOpacity style={[styles.button]} onPress={() => signOut(true)} activeOpacity={0.75}>
                {loadingOut ? <ActivityIndicator /> :
                    <Text style={{ fontFamily: 'lex-sb', fontSize: 17 }}>Sign out</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button]} onPress={() => router.push('change_password')} activeOpacity={0.75}>
                {loadingOut ? <ActivityIndicator /> :
                    <Text style={{ fontFamily: 'lex-sb', fontSize: 17 }}>Change password</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#af0000' }]} onPress={deletePrompt} activeOpacity={0.75}>
                {loadingDelete ? <ActivityIndicator /> :
                    <Text style={{ fontFamily: 'lex-sb', fontSize: 17 }}>Delete account</Text>
                }
            </TouchableOpacity>
        </View>
    )
}

export default Profile