import React, { createContext, useContext, useState } from 'react';

interface PostContextType {
    myPostsUpdated: boolean;
    setMyPostsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [myPostsUpdated, setMyPostsUpdated] = useState(false);

    return (
        <PostContext.Provider value={{ myPostsUpdated, setMyPostsUpdated }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePostContext = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePostContext must be used within a PostProvider');
    }
    return context;
};
