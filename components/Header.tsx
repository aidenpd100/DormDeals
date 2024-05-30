import { View, Text } from 'react-native'
import React from 'react'
import { styles } from '@/constants/Styles'
import Colors from '@/constants/Colors'

const Header = ({ title }: { title: string }) => {
    return (
        <View
            style={{
                borderBottomColor: Colors.dark,
                width: '100%',
                alignItems: 'center',
                borderBottomWidth: 1,
            }}
        >
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

export default Header