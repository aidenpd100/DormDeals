import { ref, getDownloadURL } from 'firebase/storage';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FIREBASE_STORAGE } from '@/FirebaseConfig';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

interface ImageDisplayProps {
    postID: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ postID }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImageUrl = async () => {
            const imageRef = ref(FIREBASE_STORAGE, `Pictures/${postID}`);
            try {
                const url = await getDownloadURL(imageRef);
                setImageUrl(url);
                setLoading(false);
            } catch (err) {
                setError('Failed to load image');
                setLoading(false);
                console.error('Error fetching image URL:', err);
            }
        };

        fetchImageUrl();
    }, [postID]);

    if (error) {
        return (<Text>{error}</Text>)
    }

    return (
        <View>
            <TouchableOpacity activeOpacity={0.75} onPress={() => router.push(`expand_image/${encodeURIComponent(imageUrl!)}`)}>
                {imageUrl && <Image source={{ uri: imageUrl }} style={{ width: 300, height: 300, resizeMode: 'cover', marginTop: 30, borderColor: Colors.dark, borderWidth: 2 }} />}
            </TouchableOpacity>
        </View >
    );
};

export default ImageDisplay