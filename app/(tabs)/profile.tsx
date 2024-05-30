import { View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from '@/constants/Styles'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig'
import { User } from 'firebase/auth'
import { Firestore, collection, doc, getDoc, getDocFromServer, getFirestore } from 'firebase/firestore'
import Header from '@/components/Header'

const Profile = ({ username }: { username: string }) => {

    const db = getFirestore()
    const [loading, setLoading] = useState(false)

    const signOut = async () => {
        try {
            setLoading(true)
            await FIREBASE_AUTH.signOut()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
            <Header title='Profile' />
            <Text style={{ color: '#fff', fontFamily: 'lex-xlight', marginTop: 30, fontSize: 20 }}>Username: {username}</Text>
            <TouchableOpacity style={styles.button} onPress={signOut} activeOpacity={0.75}>
                {loading ? <ActivityIndicator /> :
                    <Text style={{ fontFamily: 'lex-sb', fontSize: 17 }}>Sign out</Text>
                }
            </TouchableOpacity>
        </View>
    )
}

export default Profile