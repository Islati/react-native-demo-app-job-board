import {getUserInfo} from "../../store/actions/user";
import {connect} from "react-redux";

import React, {Component} from 'react';

import {View, StyleSheet, ScrollView, Image, SafeAreaView, TouchableOpacity, FlatList} from 'react-native';
import {Grid, Row, Column} from "react-native-responsive-grid";
import {TextInput, Card, Button, Chip, Title, Text, List} from "react-native-paper";

import axios from 'axios';
import {Ionicons} from "@expo/vector-icons";

class UserSkillsContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            skillName: "",
            skills: ["Programming", "Music Production", "Rockstar"]
        };
    }

    addSkill() {
        let skills = this.state.skills;

        skills.push(this.state.skillName);

        this.setState({skillName: "", skills: skills});
    }

    deleteSkill(skill) {
        console.log(`Deleting Skill ${skill}`);
        let skills = this.state.skills.filter(sk => sk !== skill);

        this.setState({skills: skills});
    }

    render() {
        let skill_items = [];

        if (this.state.skills.length > 0) {
            let i = 0;
            for (let skill of this.state.skills) {
                skill_items.push(<Column key={i}><Chip onPress={() => this.deleteSkill(skill)}>{skill}</Chip></Column>);
                i+=1;
            }
        }

        return (
          <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
              <Grid>{({state, setState}) => (
                  <View>
                      <View>
                          <Row style={{...styles.settingsObjectContainer}}>
                              <Column size={20}>
                                  <TouchableOpacity onPress={() => {this.props.navigation.navigate("Home")}}>
                                      <Ionicons size={24} name={"ios-arrow-back"} solid/>
                                  </TouchableOpacity>
                              </Column>
                              <Column size={60}>
                                  <Title>Other Skills</Title>
                              </Column>
                          </Row>
                      </View>
                      <View>
                          <Row style={{...styles.settingsObjectContainer}}>
                              <Column size={70} offset={5}>
                              <TextInput
                                  label={"Add a Skill"}
                                  value={this.state.skillName}
                                  onChangeText={(text) => this.setState({skillName: text})}
                                  mode={'outlined'}
                                  placeholder={"i.e Dog Walking"}
                              />
                              </Column>
                              <Column offset={5} size={15}>
                                  <View style={{marginTop: "10%"}}>
                                      <TouchableOpacity onPress={() => {this.addSkill()}}>
                                        <Ionicons size={24} name={"ios-add-circle"} solid/>
                                      </TouchableOpacity>
                                  </View>
                              </Column>
                          </Row>
                      </View>
                      <View>
                          <Row style={{...styles.settingsObjectContainer}}>
                              {skill_items}
                          </Row>
                      </View>
                  </View>
              )}
              </Grid>
          </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({

    settingsObjectContainer: {
        backgroundColor: "#fff",
        padding: 10,
    },

    listItemOdd: {
        backgroundColor: "#ebebeb"
    },
    listItemEven: {
        backgroundColor: "#fdfdfd"
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

export default connect(mapStateToProps,mapDispatchToProps)(UserSkillsContainer);