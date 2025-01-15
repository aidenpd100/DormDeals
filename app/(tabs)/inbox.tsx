import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { collection, query, where, onSnapshot, orderBy, Timestamp, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '@/FirebaseConfig';
import { styles } from '@/constants/Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import Chat from '@/components/Chat';

const Inbox = ({ username, chatsIn }: { username: string, chatsIn: Chat[] }) => {
    const [chats, setChats] = useState<Chat[]>(chatsIn);
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const fetchChats = async () => {
        setLoading(true)
        try {
            const q = query(
                collection(FIREBASE_DB, 'chats'),
                where('participants', 'array-contains', username),
                orderBy('lastMessageTimestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const chatsList: Chat[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Chat[];

            setChats(chatsList);
        } catch (error) {
            console.error("Error fetching chats: ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const q = query(
            collection(FIREBASE_DB, 'chats'),
            where('participants', 'array-contains', username),
            orderBy('lastMessageTimestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatsList: Chat[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Chat[];
            setChats(chatsList);
        }, (error) => {
            console.error("Error fetching chats: ", error);
        });

        return () => unsubscribe();
    }, [username]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchChats();
        setRefreshing(false);
    };

    const Item = ({ id, lastMessage, lastMessageTimestamp, participants }: { id: string, lastMessage: string, lastMessageTimestamp: Timestamp, participants: string[] }) => (
        <Chat id={id} lastMessage={lastMessage} lastMessageTimestamp={lastMessageTimestamp} participants={participants} username={username} />
    );
    const renderItem = ({ item }: { item: Chat }) => (
        <Item id={item.id} lastMessage={item.lastMessage} lastMessageTimestamp={item.lastMessageTimestamp} participants={item.participants} />
    );

    return (
        <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
            <Header title='Inbox' />
            {loading && !refreshing ? <ActivityIndicator style={{ marginTop: 40 }} /> :
                <FlatList
                    contentContainerStyle={{ alignItems: 'center' }} style={{ width: '100%' }}
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl tintColor={'#8A8A8A'} refreshing={refreshing} onRefresh={onRefresh} />}
                />
            }
        </View>
    );
};

export default Inbox;
