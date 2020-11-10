import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import store from "./src/store/index.js";

import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from "@react-navigation/drawer";

import { DrawerActions } from "@react-navigation/native";

import { useNavigation } from "@react-navigation/native";

import { NavigationContainer } from "@react-navigation/native";

import { Provider } from "react-redux";

import Login from "src/components/screens/login/LoginScreen";
import Main from "src/components/screens/audit/AuditsListScreen";
import AuditDetails from "src/components/screens/audit/AuditDetailsScreen";
import TextEditor from "src/components/screens/common/TextEditorScreen";
import TaskDetails from "src/components/screens/tasks/TaskDetailsScreen";
import TaskEditor from "src/components/screens/tasks/TaskEditorScreen";

import HazardsList from "src/components/screens/hazards/HazardsListScreen";
import HazardsDetails from "src/components/screens/hazards/HazardsDetailsScreen";
import HazardsEditor from "src/components/screens/hazards/HazardsEditorScreen";

import { navigationRef, navigate } from "./RootNavigation";

import Sidebar from "src/components/screens/sidebar/Sidebar";

const HomeStack = createStackNavigator();
const MapStack = createStackNavigator();

const Drawer = createDrawerNavigator();

export default function App() {
  let [email, setEmail] = useState("");
  let [getName, setName] = useState("");
  let [worker, setWorker] = useState("");

  // setWorker(store.getState().user.key);

  const getInitial = () => {
    const worker2 =
      store.getState().user.key === undefined
        ? "Login"
        : ((email = store.getState().user.staff.mail), "Main");

    setWorker(worker2);
    setName(worker);
    setEmail(email);
  };

  useEffect(() => {
    getInitial();
  });

  const makeGamburger = data => {
    const navigation = useNavigation();
    // let [toggle] = useState(0);

    return {
      ...data,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Image
            source={require("src/img/menu.png")}
            tintColor='white'
            style={{ width: 50, height: 40, marginLeft: 10 }}
          />
        </TouchableOpacity>
      )
    };
  };

  const MakeHomeStack = () => (
    <HomeStack.Navigator
      initialRouteName={getName}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0481D9"
        },
        headerTintColor: "#fff"
      }}
    >
      <HomeStack.Screen
        name='Login'
        component={Login}
        options={{ title: "Вход" }}
      />
      <HomeStack.Screen
        name='Main'
        component={Main}
        options={makeGamburger({ title: "Аудиты" })}
      />
      <HomeStack.Screen
        name='AuditDetails'
        component={AuditDetails}
        options={{ title: "Информация по аудиту" }}
      />
      <HomeStack.Screen
        name='TextEditor'
        component={TextEditor}
        options={{ title: "Текстовый редактор" }}
      />
      <HomeStack.Screen
        name='TaskDetails'
        component={TaskDetails}
        options={{ title: "Информация по задаче" }}
      />
      <HomeStack.Screen
        name='TaskEditor'
        component={TaskEditor}
        options={{ title: "Редактор задачи" }}
      />
    </HomeStack.Navigator>
  );
  const MakeMapStack = () => (
    <MapStack.Navigator
      initialRouteName={Main}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0481D9"
        },
        headerTintColor: "#fff"
      }}
    >
      <MapStack.Screen
        name='Main'
        component={HazardsList}
        options={makeGamburger({ title: "Список карт" })}
      />
      <MapStack.Screen
        name='HazardsDetails'
        component={HazardsDetails}
        options={{ title: "Информация по карте" }}
      />
      <MapStack.Screen
        name='HazardsEditor'
        component={HazardsEditor}
        options={{ title: "Редактор карт" }}
      />
    </MapStack.Navigator>
  );

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Drawer.Navigator
          initialRouteName='Аудиты'
          drawerContent={props => {
            return Sidebar(props, email);
          }}
        >
          <Drawer.Screen name='Аудиты' component={MakeHomeStack} />
          <Drawer.Screen name='Карты' component={MakeMapStack} />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
