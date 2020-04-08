import React, { useState, useEffect, useRef} from 'react';
import { Container, Content ,Text, Button, Icon } from 'native-base';
import {StyleSheet, View, Image, TextInput} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {useNavigation} from '@react-navigation/native';

// import uuid from 'react-native-uuid';
import firebase from '../../../../../FireBase';
// import { parse } from 'url';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import { preventAutoHide } from 'expo/build/launch/SplashScreen';
const db = firebase.firestore();

function ShoppingCart(){
    const[qty, setQty] = useState({});
    const[meal, setMeal] = useState([]);
    const [hasData, setHasData] = useState(false);
    const subtotal = useRef(0.0);
    const user = firebase.auth().currentUser;
    
    const navigation = useNavigation();
    // console.log(route.params.update);
    useEffect(() => {
        subtotal.current = 0;
        const getData = async ()=> {
            
            await db.collection('shopping_cart').doc(user.uid).get()
            .then(function(doc){
                return doc.data();
                // setMetaData(doc.data());
            })
            .then(async function(data){
                for(const d in data){
                    // setQty(parseInt(data[d]));
                    await db.collection('meals').doc(d).get()
                    .then(function(doc){
                        const temp = doc.data();
                        const name = temp.name;
                        const price = temp.price;
                        const quantity = parseInt(data[d]);
                        const meal_id = d;

                        setMeal(prevState => {
                            console.log(prevState);
                            return {...prevState, ...{[d]:{meal_id,name,price,quantity}} } })

                        // setQty(prevState => {
                        //     return {...prevState, ...{[d]:{quantity}}}
                        // })
                        // calculate initial subtotal
                        subtotal.current += (parseFloat(price.substr(1)) * quantity);
                        // subtotal.current.toFixed(2);
                    })
                }
            })
        }

       getData().then(() => {setHasData(true);})
    },[]);
    

    // async 

    async function updateMealInfo(){
        subtotal.current = 0.0;
        await db.collection('shopping_cart').doc(user.uid).get()
        .then(function(doc){
            console.log("inside first then----------------------");
            // console.log("inside then 1");
            // console.log(doc.data());
            setHasData(false);
            return doc.data();
        })
        .then(async function(data){
            console.log("inside second then----------------------");
            subtotal.current = 0.0;
            setMeal([]);
            // setQty({});

            
            for(const d in data) {
                await db.collection('meals').doc(d).get()
                .then(function(doc){
                    // console.log('0000000000000000000000');
                    // console.log(doc.data());
                    console.log("inside for loop then-------------------");
                    const temp = doc.data();
                    const name = temp.name;
                    const price = temp.price;
                    const quantity = parseInt(data[d]);
                    const meal_id = d;

                    
                    setMeal(prevState => {
                        console.log("previous state--------------------------");
                        console.log(prevState);
                        return {...prevState, ...{[d]:{meal_id,name,price, quantity}} } })
                    setQty(prevState => {
                        return {...prevState, ...{[d]:{quantity}}}
                    })
                    // calculate initial subtotal
                    subtotal.current += (parseFloat(price.substr(1)) * quantity);
                    
                })
            }

        })
    }
    function displayMealInfo(){
        updateMealInfo().then(() => {setHasData(true)});
    }

    async function updateQty(field_id, new_val){
        await db.collection("shopping_cart").doc(user.uid).update({
            [field_id]: new_val.toString()
        }).then(function(){
            console.log("update shopping cart successfully.");
        }).catch(function(error){
            console.log("error");
        })
    }


    function logInfo(){
        console.log("meal=",meal);
    }

    function onMinusPress(meal){

        // const quantity = qty[meal.meal_id].quantity;
        // const new_quantity = quantity - 1;
        
        console.log("inside on minus press");
        const quantity = meal.quantity;
        const new_quantity = quantity - 1;
        if(quantity >= 1){
            console.log("inside if statement (if quantity >= 1)");
            // setMeal({...previous, [meal.meal_id]:{...previous[meal.meal_id],quantity:new_quantity} })
            setMeal(prevState => {
                console.log("printing previous state...");
                console.log(prevState);
                return {...prevState, ...{[meal.meal_id]:{...prevState[meal.meal_id], quantity:new_quantity}}}}
                )

            logInfo();
            // console.log("meal ====", meal);
            // console.log("meal ===== ", meal);
            // setQty(prevState => {return {...prevState, ...{[meal.meal_id]: {quantity: new_quantity}}}})
            updateQty(meal.meal_id, new_quantity);
            subtotal.current -= parseFloat(meal.price.substr(1));
        }else{
            console.log("The quantity is already zero.");
        }
    }
    
    

    function onPlusPress(meal){
        // const quantity = qty[meal.meal_id].quantity;
        // const new_quantity = quantity + 1;
        const quantity = meal.quantity;
        const new_quantity = quantity + 1;
        setMeal(prevState => {return {...prevState, ...{[meal.meal_id]:{...prevState[meal.meal_id], quantity:new_quantity}}}})
        // setQty(prevState => {return {...prevState, ...{[meal.meal_id]: {quantity:new_quantity}}} });
        updateQty(meal.meal_id,new_quantity);
        subtotal.current += parseFloat(meal.price.substr(1));
        // console.log(qty);
    }
    
    function AddRemoveBTNs({meal}){
        return(
            <View style={styles.quantity_btn_container}>
                {/* remove quantity */}
                <Button transparent rounded
                    style={styles.remove_btn}
                    onPress={async () => {await onMinusPress(meal)}}
                    >
                <Icon type="AntDesign" name="minuscircle" style={styles.remove_btn} />
                </Button>
                <Text style={{fontSize:wp("3%"), alignSelf:"center", paddingHorizontal:5, fontWeight:"bold" }}>Quantity: { meal.quantity }</Text>
                {/* add quantity */}
                <Button transparent rounded
                    style={styles.remove_btn}
                    onPress={() => {onPlusPress(meal)}}
                    >
                <Icon type="AntDesign" name="pluscircle" style={styles.add_btn} />
                </Button>
            </View>
        )
    }

    function determineImg(meal_id){
        switch(meal_id){
          case "Meal 1": return require("../../../../../assets/meals/meal1.jpg"); break;
          case "Meal 2": return require("../../../../../assets/meals/meal2.jpg"); break;
          case "Meal 3": return require("../../../../../assets/meals/meal3.jpg"); break;
          case "Meal 4": return require("../../../../../assets/meals/meal4.jpg"); break;
          case "Meal 5": return require("../../../../../assets/meals/meal5.jpg"); break;
          case "Meal 6": return require("../../../../../assets/meals/meal6.jpg"); break;
          case "Meal 7": return require("../../../../../assets/meals/meal7.jpg"); break;
          case "Meal 8": return require("../../../../../assets/meals/meal8.jpg"); break;
        }
      }
    
    function MealInfoContainer({meal}){
        console.log("inside meal info container");
        console.log(meal);
        return(
            <View style={styles.meal_info_container}>
                <Image style={styles.img} resizeMode="cover" source={determineImg(meal.meal_id)}/>
                <Text>{meal.name}</Text> 
                <View style={{position:"absolute", right:wp("7%"), marginTop:hp("2%")}}>
                    <AddRemoveBTNs meal={meal}/>
                    <Price price={parseFloat( meal.price.substr(1) * meal.quantity ).toFixed(2)} />
                </View>
            </View>
        )
        
    }
    
    function Price({price}){
        return(
            <View>
                <Text style={{fontSize:wp("3%"), fontWeight:"bold", alignSelf:"center"}}>
                    Price: ${price}
                </Text>
            </View>
        )
        
    }

    function Total(){
        return(
            <View style={{flexDirection:"column", justifyContent:"space-between"}}>
                <Text style={styles.price}>Subtotal: {"\t$"+`${subtotal.current.toFixed(2)}`}</Text> 
                {/* ${subtotal.current.toFixed(2) */}
                <Text style={styles.price}>Tax: {"\t\t$"+`${(subtotal.current * .15).toFixed(2)}`}</Text>
                <Text style={styles.price}>Total: {"\t\t$" + `${(subtotal.current * 1.15).toFixed(2)}`}</Text>
            </View>
        )
    }
    function Payment(){
        return(
            <View style={styles.payment}>
                <MaterialIcons.Button name="payment" color="#007AFF" backgroundColor="transparent" underlayColor="green" size={wp("20%")}
                    onPress={()=>{ navigation.navigate("Payment", {data:meal})}}
                />
            </View>
        )
    }

    const createMealInfoContainer = () => {
        console.log("inside create meal coninters");

        let container = [];

        for(const m in meal){
            container.push(<MealInfoContainer meal={meal[m]} key={m}/>)
        }
        return container;
    }
    return(
        <View style={styles.container}>
            <FontAwesome.Button name="refresh" backgroundColor="green" size={wp("5%")} underlayColor="red" color="#007AFF" onPress={displayMealInfo}/>
            
            {hasData?createMealInfoContainer():null}
            
            <View style={{alignItems:"center", position:"absolute", bottom:hp("1%"), right:wp("1%") }}>
                {/* <View style={{marginRight:wp("5%")}}>
                    
                </View> */}
                <Total />
                <Payment />
            </View>
        </View>
    )
    // }else{return null};
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    checkout_btn:{
        marginTop:20,
        width:wp('50%'),
    },
    quantity_input:{
        width:wp("5%"),
        height:hp("5%"),
        fontSize:wp("2%"),
        borderWidth:1
    },
    remove_btn:{
        color:"red",
    },
    add_btn:{
        color:"#2f71e9"
    },
    quantity_btn_container:{
        flexDirection:"row",
    },
    meal_info_container:{
        flexDirection:"row",
        marginHorizontal:wp("3%"),
        // marginVertical: hp("2%"),
        // borderColor:"red",
        // borderWidth:1,
        marginBottom:hp("1%")
    },
    img:{
        height:hp("12%"),
        width:wp("30%"),
    },
    price:{
        marginBottom:hp("1%")
    }
})
export default ShoppingCart