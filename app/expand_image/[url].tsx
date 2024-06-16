import { View, Text, Image } from 'react-native'
import React, { useCallback, useRef } from 'react'
import { styles } from '@/constants/Styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BackX from '@/components/BackX'
import { useLocalSearchParams } from 'expo-router'
import { Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

const ExpandImage = () => {
    const { url } = useLocalSearchParams()
    const screenWidth = Dimensions.get('window').width

    return (
        <View style={[styles.container, { paddingTop: useSafeAreaInsets().top, opacity: 0.9 }]}>
            <BackX />
            <View style={{ height: '100%' }}>
                <ImageZoom cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').height - 80}
                    imageWidth={screenWidth}
                    imageHeight={screenWidth}
                    minScale={1}
                    maxScale={2}>
                    <Image source={{ uri: url?.toString() }} style={{ width: screenWidth, height: screenWidth }} />
                </ImageZoom>
            </View>
        </View>
    )
}

export default ExpandImage