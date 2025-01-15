import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { collection, getDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '@/FirebaseConfig';
import { router } from 'expo-router';
import { styles } from '@/constants/Styles';

const MessageButton = ({ toUsername }: { toUsername: string }) => {

    const fetchUsername = async (uid: string): Promise<string | null> => {
        try {
            const userDoc = await getDoc(doc(FIREBASE_DB, 'users', uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return userData.username || null;
            }
            return null;
        } catch (error) {
            console.error('Error fetching username: ', error);
            return null;
        }
    };

    const createChat = async () => {
        try {
            const currentUserUsername = await fetchUsername(FIREBASE_AUTH.currentUser!.uid);
            if (!currentUserUsername) {
                throw new Error('Could not fetch current user username');
            }

            const participants = [currentUserUsername, toUsername].sort();

            const q = query(collection(FIREBASE_DB, 'chats'), where('participants', '==', participants))
            const existingChatRef = await getDocs(q)
            if (!existingChatRef.empty) {
                const existingChatID = existingChatRef.docs[0].id
                router.push(`chat/${existingChatID}`)
            } else {
                router.push(`chat/new?receiver=${toUsername}`);
            }
        } catch (error) {
            console.error("Error creating chat: ", error);
        }
    };

    return (
        <TouchableOpacity style={[styles.button, { marginTop: 25 }]} onPress={createChat}>
            <Text style={{ color: '#fff', fontFamily: 'lex-reg', fontSize: 17 }}>Message</Text>
        </TouchableOpacity>
    );
};

export default MessageButton;
