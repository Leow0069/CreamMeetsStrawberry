import React, {useEffect, useState} from 'react';
import { Text, Button, FlatList, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';
import tw from 'tailwind-rn';
import {addDoc, collection, serverTimestamp, query, orderBy, onSnapshot} from "@firebase/firestore";
import {db} from '../configurations/firebase';

const Messages = ({message}) => {
    const {user} = useAuth();
    return(
        <View>
            {message.userId === user.uid ? (
                <SenderMessage key = {message.id} message={message} />
            ) : (
                <ReceiverMessage key = {message.id} message={message} />
            )
        }
        </View>)
}


const MessageScreen = () => {

    const {user} = useAuth();
    const {params} = useRoute();
    const {matchDetails} = params;

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(()=>
        onSnapshot(
            query(
                collection(db, "matches", matchDetails.id, "messages"),
                orderBy('timestamp', 'desc')
            ),
            (snapshot) => setMessages(snapshot.docs.map((doc) => {
                return {id: doc.id, ...doc.data()};
            })),
        ), [matchDetails, db]);

    const sendMessage = () => {
        addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input,
        });

        setInput("");
    };

    return (
        <SafeAreaView style = {tw("flex-1")}>

            <Header title = {getMatchedUserInfo(matchDetails.users, user.uid).displayName} callEnabled/>
            <KeyboardAvoidingView
                behavior = {Platform.OS === "ios"? "padding" : "height"}
                style = {tw("flex-1")}
                keyboardVerticalOffset = {10}
            >
                <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
                    <FlatList 
                        data = {messages}
                        inverted = {-1}
                        style = {tw('pl-4')}
                        keyExtractor = {(item) => item.id}
                        renderItem = {({item})=> <Messages message = {item}/>}
                    />
                </TouchableWithoutFeedback>
                
                <View
                    style = {tw("flex-row justify-between bg-white items-center border-t border-gray-200 px-5 py-2")}>
                    <TextInput
                        style = {tw("h-10 text-lg")}
                        placeholder = "Send message..."
                        onChangeText = {setInput}
                        onSubmitEditing = {sendMessage}
                        value = {input}
                    />
                    <Button 
                        onPress = {sendMessage} 
                        title ="Send"
                        color = "#FF5864"
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};

export default MessageScreen;
