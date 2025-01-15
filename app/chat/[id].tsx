import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { styles } from '@/constants/Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/FirebaseConfig';
import Chat from '@/components/Chat';
import BackArrow from '@/components/BackArrow';
import Message from '@/components/Message';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const ChatPage = ({ username }: { username: string }) => {
    const { id } = useLocalSearchParams();
    const [sendLoading, setSendLoading] = useState(false);
    const [chat, setChat] = useState<Chat | undefined>(undefined);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const chatRef = doc(FIREBASE_DB, 'chats', id!.toString());
                const docSnap = await getDoc(chatRef);
                if (docSnap.exists()) {
                    setChat({ id: docSnap.id, ...docSnap.data() } as Chat);
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching chat: ", error);
            }
        };

        fetchChat();

        const q = query(collection(FIREBASE_DB, 'chats', id!.toString(), 'messages'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesList: Message[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            setMessages(messagesList);
        });

        return () => unsubscribe();
    }, [id]);

    const getOtherUsername = () => {
        if (chat) {
            if (chat.participants[0] === username) {
                return chat.participants[1];
            }
            return chat.participants[0];
        }
    };

    const sendMessage = async () => {
        if (newMessage.trim().length === 0) {
            return;
        }

        setSendLoading(true);
        setNewMessage('');

        const message = {
            sender: username,
            content: newMessage,
            timestamp: serverTimestamp()
        };

        await addDoc(collection(FIREBASE_DB, 'chats', id!.toString(), 'messages'), message);

        await setDoc(doc(FIREBASE_DB, 'chats', id!.toString()), {
            lastMessage: newMessage,
            lastMessageTimestamp: serverTimestamp()
        }, { merge: true });

        setSendLoading(false);
    };

    const renderItem = ({ item }: { item: Message }) => (
        <Message id={item.id} currentUsername={username} sender={item.sender} timestamp={item.timestamp} content={item.content} />
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 20 }}>
                    <BackArrow />
                    <View style={{ position: 'absolute', left: '50%', transform: [{ translateX: -50 }] }}>
                        <Text style={{ color: '#fff', fontFamily: 'lex-sb', fontSize: 20, marginTop: 10 }}>{getOtherUsername()}</Text>
                    </View>
                </View>
                <FlatList
                    style={{ width: '100%' }}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    inverted
                />
                <View style={styles.messageInputContainer}>
                    <TextInput
                        style={styles.messageInput}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type your message"
                        placeholderTextColor={'#A8A8A8'}
                    />
                    <TouchableOpacity onPress={sendMessage}>
                        <Ionicons name='send' color={Colors.primary} size={30} />
                    </TouchableOpacity>
                </View>
            </View >
        </KeyboardAvoidingView >
    );
};

export default ChatPage;
