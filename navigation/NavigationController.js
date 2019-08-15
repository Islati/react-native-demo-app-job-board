import React from 'react';
import {createStackNavigator, createSwitchNavigator} from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from "../screens/RegisterScreen";
import JobListContainer from "../screens/containers/JobListContainer";
import SearchContainer from '../screens/containers/SearchContainer';
import LoginContainer from "../screens/containers/LoginContainer";
import JobPostContainer from "../screens/containers/JobPostContainer";
import SettingsContainer from "../screens/containers/SettingsContainer";
import JobExperienceContainer from "../screens/containers/JobExperienceContainer";
import UserSkillsContainer from "../screens/containers/UserSkillsContainer";


const AppNavigator = createStackNavigator({
    Home: HomeScreen,
    JobList: JobListContainer,
    Search: SearchContainer,
    JobPost: JobPostContainer,
    Settings: SettingsContainer,
    JobExperience: JobExperienceContainer,
    UserSkills: UserSkillsContainer
}, {
    headerMode: "none",
    initialRouteName: "Home"
});


const LoginStackNavigator = createStackNavigator(
    {
        Login: LoginContainer, Register: RegisterScreen,
    }, {
        headerMode: "none"
    }
);

export default createSwitchNavigator({
    Auth: LoginStackNavigator,
    App: AppNavigator
}, {
    initialRouteName: "App"
});
