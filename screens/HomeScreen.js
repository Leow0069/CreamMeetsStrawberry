import { useNavigation } from '@react-navigation/native';
import React, {useLayoutEffect, useRef, useState, useEffect} from 'react';
import { View, Text, Button, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import Swiper from 'react-native-deck-swiper';
import {Ionicons} from '@expo/vector-icons';
import { onSnapshot, doc, collection, setDoc, getDoc, query, where, getDocs, serverTimestamp} from 'firebase/firestore';
import { db } from '../configurations/firebase';

const HomeScreen = ({route}) => {
    const navigation = useNavigation();
    const {user, logout} = useAuth();
    const swipeRef = useRef(null);
    const [profiles, setProfiles] = useState([]);

    useLayoutEffect(()=>
        onSnapshot(doc(db, 'users', user.uid), (snapshot)=>{
            if (!snapshot.exists()){
                navigation.navigate('Modal');
            }
        }),[]);

    useEffect(()=>{
        let unsubscribe;
        const fetchCards = async() => {

            const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then(
                (snapshot) => snapshot.docs.map((doc) => doc.id)
            );

            const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes')).then(
                (snapshot) => snapshot.docs.map((doc) => doc.id)
            );

            const passedUserIds = passes.length > 0 ? passes: ['emptyArray'];
            const swipedUserIds = swipes.length > 0 ? swipes: ['emptyArray'];

            unsubscribe = onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passedUserIds, ...swipedUserIds])), 
            (snapshot) => {
                setProfiles(
                    snapshot.docs.filter((doc) => doc.id !== user.uid).map(doc=>({
                        id:doc.id,
                        ...doc.data(),
                    })));
            });
        };
        fetchCards();
        return unsubscribe;
    },[db]);

    // const profile = require('../data.json');

    // if (route.params.paramKey === 'Loki'){
    //     return (
    //         <View style={tw("items-center")}>
    //             <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>Hi {route.params.paramKey}!</Text>
    //             <Image style= { tw("items-center h-96 w-96") } source = {{ uri: profile.female[0].photoURL}} />
    //             <Button title="Go to Chat Screen" onPress={() => navigation.navigate("Chat")}/>
    //             <Button title="Go to Modal Screen" onPress={() => navigation.navigate("Update Your Profile", {paramKey: 'Loki'})}/>
    //             <Button title="Logout" onPress={() => navigation.navigate("Login")}/>
    //         </View>
    //     )
    // } else {
    //     return (
    //         <View style={tw("items-center")}>
    //             <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>Hi {route.params.paramKey}!</Text>
    //             <Image style= { tw("items-center h-96 w-96") } source = {{ uri: profile.male[0].photoURL}} />
    //             <Button title="Go to Chat Screen" onPress={() => navigation.navigate("Chat")}/>
    //             <Button title="Go to Modal Screen" onPress={() => navigation.navigate("Update Your Profile", {paramKey: 'Black Widow' })}/>
    //             <Button title="Logout" onPress={() => navigation.navigate("Login")}/>
    //         </View>
    //     )
    // }

    const swipeLeft = (cardIndex) => {
        if(!profiles[cardIndex]) return;
        const userSwiped = profiles[cardIndex];
        setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
    };

    const swipeRight = async(cardIndex) => {
        if(!profiles[cardIndex]) return;
        const userSwiped = profiles[cardIndex];
        const loggedInUser = await getDoc(doc(db, 'users', user.uid));
        const loggedInProfile = loggedInUser.data();

        //Get document list from 'users' collection 
        //      --> check if userSwiped's list of swipes also contains the loggedIn person's profile:
        getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then(documentSnapshot=> {

            //Need to record loggedIn person's swipes preferences regardless of match status:
            setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);

            //If there's a match, there will be a documentSnapshot
            if(documentSnapshot.exists()) {
                //Create new collection called 'matches':
                setDoc(doc(db, 'matches', `${user.uid}+${userSwiped.id}`), {
                    users: {
                        [user.uid]: loggedInProfile,
                        [userSwiped.id]: userSwiped
                    },
                    usersMatched: [user.uid, userSwiped.id],
                    timestamp: serverTimestamp(),
                });
                navigation.navigate('Match', {
                    loggedInProfile, 
                    userSwiped
                });
            }
        });
};

    return(
        <SafeAreaView style = {tw('flex-1')}>
            <View style = {tw('flex-row items-center justify-between px-5 py-2')}>
                <TouchableOpacity onPress = {logout}>
                    <Image 
                        style = {tw("h-10 w-10 rounded-full")}
                        source = {{uri: user.photoURL}}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress = {() => navigation.navigate("Modal")}>
                    <Image style = {tw("flex-1 h-14 w-14")} resizeMode="contain" source = {require("../assets/logo.png")} />
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>navigation.navigate("Chat")}>
                    <Ionicons name="chatbubbles-sharp" size={50} color='#FF5864'/>
                </TouchableOpacity>
            </View>



            <View style={tw("flex-1 -mt-6")}>
                <Swiper
                ref={swipeRef}
                containerStyle = {{backgroundColor: "transparent"}}
                cards={profiles}
                stackSize={5}
                cardIndex={0}
                animateCardOpacity
                verticalSwipe={false}
                onSwipedLeft = {(cardIndex) => {
                    // console.log("pass");
                    swipeLeft(cardIndex);
                }}
                onSwipedRight = {(cardIndex) => {
                    // console.log("interested");
                    swipeRight(cardIndex);
                }}
                backgroundColor={"#4FD0E9"}
                overlayLabels={{
                    left:{
                        title: 'NO',
                        style:{
                            label:{
                                textAlign: 'right',
                                color:'red',
                            },
                        },
                    },
                    right:{
                        title: 'YES',
                        style:{
                            label:{
                                color:'#4DED30',
                            },
                        },
                    },
                }}
                renderCard={(card)=>
                card? (
                    <View key = {card.id} style = {tw("relative bg-white h-3/4 rounded-xl")}> 
                        <Image style={tw("absolute top-0 h-full w-full rounded-xl")}
                            source={{uri: card.photoURL}}
                        />

                        <View
                            style={[tw("absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl"),
                            styles.cardShadow,
                            ]}>
                            <View>
                                <Text style={tw("text-xl font-bold")}> {card.displayName} </Text>
                                <Text>{card.job}</Text>
                            </View>
                            <Text style= {tw("text-2xl font-bold")}> {card.age} </Text>
                        </View>

                    </View>
                ):(
                    <View style={[tw("relative bg-white h-3/4 rounded-xl justify-center items-center"), 
                        styles.cardShadow]}>
                            <Text style={tw("font-bold pb-5")}>No more profiles</Text>
                    </View>
                )}
                >
                
                </Swiper>                

            </View>


            <View style={tw("flex flex-row justify-evenly")}>
                <TouchableOpacity onPress={()=>swipeRef.current.swipeLeft()}
                style = {tw("items-center justify-center rounded-full w-16 h-16 bg-red-200")}>
                    <Text>No</Text>
                    {/* <Entypo name="cross" size={24} color="red"/> */}
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>swipeRef.current.swipeRight()}
                style = {tw("items-center justify-center rounded-full w-16 h-16 bg-green-200")}>
                    <Text>Yes</Text>
                    {/* <AntDesign name="heart" size={24} color="green"/> */}
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
};
export default HomeScreen;

const styles= StyleSheet.create({
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity:0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});