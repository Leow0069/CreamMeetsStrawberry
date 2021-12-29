import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import tw from 'tailwind-rn';

const HomeScreen = ({route}) => {
    const navigation = useNavigation();
    const profile = require('../data.json');

    if (route.params.paramKey === 'Loki'){
        return (
            <View style={tw("items-center")}>
                <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>Hi {route.params.paramKey}!</Text>
                <Image style= { tw("items-center h-96 w-96") } source = {{ uri: profile.female[0].photoURL}} />
                <Button title="Go to Chat Screen" onPress={() => navigation.navigate("Chat")}/>
                <Button title="Go to Modal Screen" onPress={() => navigation.navigate("Update Your Profile", {paramKey: 'Loki'})}/>
                <Button title="Logout" onPress={() => navigation.navigate("Login")}/>
            </View>
        )
    } else {
        return (
            <View style={tw("items-center")}>
                <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>Hi {route.params.paramKey}!</Text>
                <Image style= { tw("items-center h-96 w-96") } source = {{ uri: profile.male[0].photoURL}} />
                <Button title="Go to Chat Screen" onPress={() => navigation.navigate("Chat")}/>
                <Button title="Go to Modal Screen" onPress={() => navigation.navigate("Update Your Profile", {paramKey: 'Black Widow' })}/>
                <Button title="Logout" onPress={() => navigation.navigate("Login")}/>
            </View>
        )
    }
}

export default HomeScreen
