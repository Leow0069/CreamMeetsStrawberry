import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import { View, Text } from 'react-native'
import useAuth from './hooks/useAuth';
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ModalScreen from './screens/ModalScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const { user } = useAuth();

    return (
    // <Stack.Navigator>
    //     {user ? (
    //     <>
    //     <Stack.Screen name="Home" component={HomeScreen} />
    //     <Stack.Screen name="Chat" component={ChatScreen} />
    //     </>
    //     ) : (
    //     <Stack.Screen name="Login" component={LoginScreen} />
    //     )}
    // </Stack.Navigator> 

    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Update Your Profile" component={ModalScreen} /> 
    </Stack.Navigator>
    );
};

export default StackNavigator
