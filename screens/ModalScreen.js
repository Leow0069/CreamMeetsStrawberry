import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, {useState} from 'react';
import { Text, Image, TextInput, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import tw from 'tailwind-rn';
import { db } from '../configurations/firebase';
import useAuth from '../hooks/useAuth';

const ModalScreen = ({route}) => {
    
    const {user} = useAuth();
    const navigation = useNavigation();

    const [image, setImage] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const updateUserProfile = () => {
        setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp()
        }).then(()=>{
            setModalVisible(true);
        }).catch((error)=>{
            alert(error.message);
        });
    }

    return (

        <SafeAreaView style={tw("flex-1 items-center pt-1")}>

        <Modal
            animationType = {"slide"}
            transparent={false}
            visible={modalVisible}>
        
        <Image style={tw("h-20 w-full")}
            resizeMode="contain"
            source={{uri: "https://www.techadvisor.com/cmsdata/features/3515013/tinder_logo_thumb800.png"}} />

        <Text style={tw("text-xl font-bold")}>Your profile has been sucessfully updated!</Text>
        <Text></Text>
        <Text style={tw("text-base")}>Profile Pic URL: {image}</Text>
        <Text style={tw("text-base")}>Occupation: {job}</Text>
        <Text style={tw("text-base")}>Age: {age}</Text>
        <Text></Text>

        <TouchableOpacity 
            style={tw("w-full p-3 rounded-xl bottom-0 bg-red-400")} 
            onPress={() => {setModalVisible(false); navigation.navigate("Home")}}>
            <Text style={tw("text-center text-white text-xl")}>Close</Text>
        </TouchableOpacity> 
      </Modal>

            <Image style={tw("h-20 w-full")}
            resizeMode="contain"
            source={{uri: "https://www.techadvisor.com/cmsdata/features/3515013/tinder_logo_thumb800.png"}} />
            <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>
                Welcome {user.displayName}
            </Text>

            <Text style={tw("text-center p-4 text-gray-400 font-bold")}>
                Step 1: The Profile Pic
            </Text>
            <TextInput
            value={image}
            onChangeText={text => setImage(text)} 
            style={tw("text-center text-xl pb-2")}
            showSoftInputOnFocus={true} 
            placeholder="Enter a Profile Pic URL" />

            <Text style={tw("text-center p-4 text-gray-400 font-bold")}>
                Step 2: The Job
            </Text>
            <TextInput
            value={job}
            onChangeText={text => setJob(text)}  
            style={tw("text-center text-xl pb-2")} 
            showSoftInputOnFocus={true}
            placeholder="Enter your occupation" />

            <Text style={tw("text-center p-4 text-gray-400 font-bold")}>
                Step 3: The Age
            </Text>

            <TextInput 
            value={age}
            onChangeText={text => setAge(text)} 
            style={tw("text-center text-xl pb-2")} 
            showSoftInputOnFocus={true}
            placeholder="Enter your age" />

            <TouchableOpacity 
            style={tw("w-64 p-3 rounded-xl absolute bottom-10 bg-red-400")} 
            onPress={updateUserProfile}>
                <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
            </TouchableOpacity> 

        </SafeAreaView>
    )
}

export default ModalScreen;
