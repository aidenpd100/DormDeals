import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Image, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FIREBASE_STORAGE } from '@/FirebaseConfig';
import Colors from '@/constants/Colors';

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

    if (loading) {
        return <ActivityIndicator />
    }

    if (error) {
        return (<Text>{error}</Text>)
    }

    return (
        <View>
            {imageUrl && <Image source={{ uri: imageUrl }} style={{ width: 300, height: 300, resizeMode: 'cover', marginTop: 30, borderColor: Colors.dark, borderWidth: 2 }} />}
        </View>
    );
};

export default ImageDisplay