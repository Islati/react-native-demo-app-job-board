import React, {Component} from 'react';

import {View, StyleSheet, ScrollView, Image, SafeAreaView, TouchableOpacity} from 'react-native';
import {Grid, Row, Column} from "react-native-responsive-grid";
import {TextInput, Card, Button, Chip, Title, Text} from "react-native-paper";

import {Rating} from 'react-native-ratings';

import {Ionicons, AntDesign, EvilIcons, Entypo} from "@expo/vector-icons";

import {connect} from 'react-redux';

var _ = require('lodash');

import axios from 'axios';
import {Endpoints} from "../../constants/RestApi";

import {getUserInfo} from "../../store/actions/user";

import watch from 'redux-watch';

import store from '../../store'

class SettingsContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            profileDescription: "",
            spokenEnglishRating: 5,
            writtenEnglishRating: 5,
            experience: []
        };


        this.spokenEnglishRating = this.spokenEnglishRating.bind(this);
        this.writtenEnglishRating = this.writtenEnglishRating.bind(this);
        this.updateAbout = this.updateAbout.bind(this);
        this.postProfileDescription = this.postProfileDescription.bind(this);

        let userDataWatch = watch(store.getState, 'user.data');

        let self = this;
        store.subscribe(userDataWatch((newVal, oldVal, objectPath) => {
            self.setState({
                profileDescription: store.getState().user.data.about,
                experience: store.getState().user.data.experience
            });
        }))
    }

    spokenEnglishRating(rating) {
        this.setState({spokenEnglishRating: rating});
    }

    writtenEnglishRating(rating) {
        this.setState({writtenEnglishRating: rating});
    }

    postProfileDescription() {
        let self = this;
        axios({
            url: Endpoints.user_about_me_update,
            method: 'POST',
            headers: {'Authorization': `Bearer ${this.props.user.authToken}`},
            data: {
                about: self.state.profileDescription
            },
            responseType: 'json'
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error(error);
        })
    }

    updateAbout(value) {

        this.setState({profileDescription: value});

        _.debounce(this.postProfileDescription, 500);
    }


    componentWillMount() {
        this.props.getUserInfo(this.props.user.authToken);
    }


    render() {
        let userExperience = null;
        let experienceElement = null;
        try {
            userExperience = this.state.experience;


            let experience = [];

            if (userExperience.length > 0) {
                for (let ue of userExperience) {
                    experience.push({name: ue.job_category, experience: ue.years_experience});
                }

                let experienceElement = null;

                if (experience.length > 0) {
                    let chips = [];

                    for (let i = 0; i < 4; i++) {
                        let exp = experience[i];

                        if (exp === null) {
                            chips.push(null);
                            continue;
                        }
                        chips.push(<Chip key={i}>{exp.name} {exp.experience}</Chip>)
                    }

                    experienceElement = <View>
                        <Column>
                            {chips.splice(0, 1)}
                        </Column>
                        <Column>
                            {chips.splice(2, 3)}
                        </Column>
                    </View>
                }
            }
        } catch (err) {
            console.log(err);
        }


        return (<SafeAreaView style={{flex: 1, backgroundColor: "#879287"}}>
            <Grid>
                {({state, setState}) => (
                    <View>
                        <View>
                            <Row style={{...styles.settingsObjectContainer}}>
                                <Column size={20}>
                                    <TouchableOpacity onPress={() => {
                                        this.props.navigation.navigate("Home")
                                    }}>
                                        <Ionicons size={24} name={"ios-arrow-back"} solid/>
                                    </TouchableOpacity>
                                </Column>
                                <Column size={60}>
                                    <Title>My Profile</Title>
                                </Column>
                            </Row>
                        </View>
                        <View>
                            <Row style={{...styles.settingsObjectContainer, marginTop: 5}}>
                                <TextInput
                                    style={{width: "100%"}}
                                    label={"About Me"}
                                    value={this.state.profileDescription}
                                    onBlur={this.postProfileDescription}
                                    onChangeText={(text) => this.updateAbout(text)}
                                    mode={'outlined'}
                                    placeholder={"Enter information about yourself."}
                                    multiline
                                    numberOfLines={4}
                                />
                            </Row>
                        </View>
                        <View>
                            {/*Job Experience Section*/}
                            <Row style={{...styles.settingsObjectContainer, marginTop: 5}}>
                                <View>
                                    <Row>
                                        <Column size={20}>
                                            <AntDesign size={24} name={"user"} solid style={{marginTop: "10%"}}/>
                                        </Column>

                                        <Column size={60}>
                                            <Title>
                                                My Experience
                                            </Title>
                                        </Column>

                                        <Column size={20}>
                                            <TouchableOpacity onPress={() => {
                                                this.props.navigation.navigate("JobExperience")
                                            }}>
                                                <Ionicons size={24} name={"ios-arrow-forward"} solid
                                                          style={{marginTop: "10%"}}/>
                                            </TouchableOpacity>
                                        </Column>
                                    </Row>
                                </View>
                                <View>
                                    <Row>
                                        {experienceElement}
                                    </Row>
                                </View>
                            </Row>
                        </View>
                        <View>
                            {/* Education Section */}
                            <Row style={{...styles.settingsObjectContainer, marginTop: 5}}>
                                <View>
                                    <Row>
                                        <Column size={20}>
                                            <AntDesign name={"book"} size={24} solid style={{marginTop: "10%"}}/>
                                        </Column>
                                        <Column size={60}>
                                            <Title>My Education</Title>
                                        </Column>
                                        <Column size={20}>
                                            <Ionicons size={24} name={"ios-arrow-forward"} solid
                                                      style={{marginTop: "10%"}}/>
                                        </Column>
                                    </Row>
                                </View>
                                <View>
                                    <Row>
                                        <Column offset={30} size={50}>
                                            <Text style={{color: "#777777"}}>Primary Education</Text>
                                        </Column>
                                    </Row>
                                </View>
                            </Row>
                        </View>
                        {/*Top Row of Language Skills Section.*/}

                        <View>
                            <Row style={{...styles.settingsObjectContainer, marginTop: 5}}>
                                <View>
                                    <Row>
                                        <Column size={20}>
                                            <Entypo name={"language"} size={24} solid style={{marginTop: "10%"}}/>
                                        </Column>
                                        <Column size={60}>
                                            <Title>Language Skills</Title>
                                        </Column>
                                        <Column size={20}>
                                            <Ionicons size={24} name={"ios-arrow-forward"} solid
                                                      style={{marginTop: "10%"}}/>
                                        </Column>
                                    </Row>
                                </View>
                                {/*Spoken Language Skills*/}
                                <View>
                                    <Row>
                                        <Column offset={55}>
                                            <Text style={{fontWeight: "bold", fontSize: 14}}>Spoken</Text>
                                        </Column>
                                    </Row>
                                    <View>
                                        <Row>
                                            <Column size={20} offset={20}>
                                                <Text>English</Text>
                                            </Column>
                                            <Column size={50} offset={10}>
                                                <Rating startingValue={this.state.spokenEnglishRating} type={"star"}
                                                        imageSize={16} fractions={0}
                                                        onFinishRating={this.spokenEnglishRating}/>
                                            </Column>
                                        </Row>
                                    </View>
                                </View>
                                <View>
                                    <View>
                                        <Row>
                                            <Column offset={55}>
                                                <Text style={{fontWeight: "bold", fontSize: 14}}>Written</Text>
                                            </Column>
                                        </Row>
                                    </View>
                                    <View>
                                        <Row>
                                            <Column size={20} offset={20}>
                                                <Text>English</Text>
                                            </Column>
                                            <Column size={50} offset={10}>
                                                <Rating startingValue={this.state.writtenEnglishRating} type={"star"}
                                                        imageSize={16} fractions={0}
                                                        onFinishRating={this.writtenEnglishRating}/>
                                            </Column>
                                        </Row>
                                    </View>
                                </View>
                            </Row>
                        </View>

                        {/* Skills Section */}

                        <View>
                            <Row style={{...styles.settingsObjectContainer, marginTop: 5}}>
                                <View>
                                    <Row>
                                        <Column size={20}>
                                            <AntDesign name={"pushpin"} size={24} solid style={{marginTop: "10%"}}/>
                                        </Column>
                                        <Column size={60}>
                                            <Title>Other Skills</Title>
                                        </Column>
                                        <Column size={20}>
                                            <TouchableOpacity onPress={() => {
                                                this.props.navigation.navigate("UserSkills")
                                            }}>
                                                <Ionicons size={24} name={"ios-arrow-forward"} solid
                                                          style={{marginTop: "10%"}}/>
                                            </TouchableOpacity>
                                        </Column>
                                    </Row>
                                </View>
                            </Row>
                        </View>
                    </View>
                )}
            </Grid>
        </SafeAreaView>);
    }
}

const styles = StyleSheet.create({

    settingsObjectContainer: {
        backgroundColor: "#fff",
        padding: 10,
    }

});

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = {
    getUserInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);