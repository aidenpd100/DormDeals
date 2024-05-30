import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const BackArrow = () => {
    return (
        <TouchableOpacity style={{ marginTop: 10, marginLeft: 10, alignSelf: 'flex-start' }} onPress={() => router.back()}>
            <Ionicons name='chevron-back' color='#fff' size={30}></Ionicons>
        </TouchableOpacity>
    )
}

export default BackArrow