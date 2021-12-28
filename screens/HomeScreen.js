import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, Button } from 'react-native'

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View>
            <Text>This is the Home Screen</Text>
            <Button title="Go to Chat Screen" onPress={() => navigation.navigate("Chat")}/>
            <Button title="Logout" onPress={() => navigation.navigate("Login")}/>
        </View>
    )
}

export default HomeScreen
