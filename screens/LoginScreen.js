import React, { useLayoutEffect } from 'react'
import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native'
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-rn';

const LoginScreen = () => {
    const navigation = useNavigation();
    const { user1, user2 } = useAuth();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);
    
    return (
        <View style={tw("flex-1")}>
            <ImageBackground 
            resizeMode="cover"
            style={tw("flex-1")}
            source={{uri: "https://tinder.com/static/tinder.png"}}>
            <TouchableOpacity style={[tw("absolute bottom-40 w-60 bg-white p-2 rounded-2xl"), 
            { marginHorizontal: "25%"},
            ]} onPress={() => navigation.navigate("Home", {paramKey: 'Loki' })}>
                <Text style={tw("font-bold text-center")}>Sign in as Loki & get swiping</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[tw("absolute bottom-24 w-60 bg-white p-2 rounded-2xl"), 
            { marginHorizontal: "25%"},
            ]} onPress={() => navigation.navigate("Home", {paramKey: 'Black Widow' })}>
                <Text style={tw("font-bold text-center")}>Sign in as Black Window & get swiping</Text>
            </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}

export default LoginScreen
