import React, { useEffect, useState } from 'react';
import {FlatList, View, Text} from 'react-native';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import ChatRow from '../components/ChatRow';
import {onSnapshot, collection, query, where} from '@firebase/firestore';
import {db} from '../configurations/firebase';

const ChatList = () => {
    const [matches, setMatches] = useState([]);
    const {user} = useAuth();
    useEffect(()=>{
        onSnapshot(
            query(
                collection(db, "matches"), 
                where("usersMatched", "array-contains", user.uid)
            ), 
        (snapshot) => setMatches(
            snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data(),
                }))
            ))
    }, [user]);

    return (
        matches.length > 0 ? (
            <FlatList
                style = {tw('h-full')}
                data = {matches}
                keyExtractor = { item => item.id} 
                renderItem = {({item}) => <ChatRow matchDetails = {item} />}
            />)
        : (<View style = {tw('p-5')}>
            <Text style = {tw('text-center text-lg')}> No matches at the moment :( </Text>
        </View>)
    )
};

export default ChatList;
