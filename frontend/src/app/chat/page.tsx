'use client'

import { useParams } from 'next/navigation';
import React from 'react';

const ChatPage = () => {

    const params = useParams();
    const userId = params.userId;

    if (!userId) return <div>nothing</div>;

    return (
        <div>
            <p>User ID: {userId}</p>
        </div>
    );
};

export default ChatPage;