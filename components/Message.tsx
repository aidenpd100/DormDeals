import { View, Text } from 'react-native'
import React from 'react'
import { Timestamp } from 'firebase/firestore';
import { styles } from '@/constants/Styles';

interface Message {
    id: string;
    sender: string;
    timestamp: Timestamp;
    content: string;
}

const Message = ({ id, currentUsername, sender, timestamp, content }: { id: string, currentUsername: string, sender: string, timestamp: Timestamp, content: string }) => {
    const messageTimestamp = timestamp ? new Date(timestamp.toDate()).toLocaleTimeString([], { timeStyle: 'short' }) : null

    return (
        <View style={sender === currentUsername ? styles.sentMessage : styles.receivedMessage}>
            {messageTimestamp ?
                <>
                    <Text style={{ color: '#fff', fontFamily: 'lex-light', fontSize: 18 }}>{content}</Text>
                    <Text style={styles.timestamp}>{messageTimestamp}</Text>
                </>
                : null}
        </View>

    )
}

export default Message