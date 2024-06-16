import React from 'react'
import { View, Image, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import ImageZoom from 'react-native-image-pan-zoom'
import BackX from '@/components/BackX'
import { styles } from '@/constants/Styles'

const ExpandImage = () => {
    const { url } = useLocalSearchParams()
    const screenWidth = Dimensions.get('window').width

    return (
        <View style={[styles.container, { paddingTop: useSafeAreaInsets().top, opacity: 0.9 }]}>
            <BackX />
            <View style={{ height: '100%' }}>
                <ImageZoom cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').height - 100}
                    imageWidth={screenWidth}
                    imageHeight={screenWidth}
                    minScale={1}
                    maxScale={3}
                    style={{ marginTop: 15 }}
                >
                    <Image source={{ uri: url?.toString() }} style={{ width: screenWidth, height: screenWidth }} />
                </ImageZoom>
            </View>
        </View>
    )
}

export default ExpandImage