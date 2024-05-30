import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { styles } from '@/constants/Styles'
import { Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/FirebaseConfig';
import { usePostContext } from './PostsContext';
import { FontAwesome5 } from '@expo/vector-icons';

interface Chat {
    id: string;
    lastMessage: string;
    lastMessageTimestamp: Timestamp;
    participants: string[];
};

const Chat = ({ id, lastMessage, lastMessageTimestamp, participants, username }: { id: string, lastMessage: string, lastMessageTimestamp: Timestamp, participants: string[], username: string }) => {

    const deleteChatDoc = async () => {
        await deleteDoc(doc(FIREBASE_DB, 'chats', id))
    }

    const deleteChat = async () => {
        Alert.alert('Delete chat?', '', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => deleteChatDoc() },
        ])
    }

    const getFromUsername = () => {
        if (participants[0] == username) {
            return participants[1]
        }
        return participants[0]
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
        <TouchableOpacity onPress={() => router.push({ pathname: `/chat/${id}`, params: { username: username } })} activeOpacity={0.75}>
            <View style={[styles.post, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View>
                    <Text style={{ color: '#fff', fontFamily: 'lex-reg', fontSize: 23, marginBottom: 8 }}>{getFromUsername()}</Text>
                    <Text style={{ color: '#fff', fontFamily: 'lex-reg', fontSize: 15 }}>{lastMessage}</Text>
                    <Text style={{ color: '#fff', fontFamily: 'lex-xlight', fontSize: 15 }}>{lastMessageTimestamp ? getTimeDifference(lastMessageTimestamp) : ''}</Text>
                </View>
                {/* <TouchableOpacity onPress={deleteChat} activeOpacity={0.75} style={{ margin: 5 }}>
                    <FontAwesome5 name='trash' size={30} color='red' />
                </TouchableOpacity> */}
            </View>
        </TouchableOpacity>
    )
}

export default Chat