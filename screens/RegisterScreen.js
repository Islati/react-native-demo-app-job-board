import React from 'react';
import {ScrollView, StyleSheet, View, TouchableOpacity, Alert, Platform} from 'react-native';

import {Grid, Row, Column as Col} from "react-native-responsive-grid";

import {Button, Text, TextInput} from 'react-native-paper';

import axios from "axios";

import {Endpoints} from "../constants/RestApi";

import {connect} from 'react-redux';

import {login} from "../store/actions/user";

class RegisterScreen extends React.Component {
    static navigationOptions = {
        title: 'Login',
    };

    constructor(props) {
        super(props);

        this.state = {
            emailValue: "",
            passwordValue: "",
            passwordConfirmValue: "",
            name: "",
            registerError: null
        };

        this._processRegistration = this._processRegistration.bind(this);
    }

    _processRegistration() {
        if (this.state.passwordValue !== this.state.passwordConfirmValue) {
            Alert.alert("Password Mismatch", "Your passwords don't match; Please correct this and proceed");
            return;
        }

        this.setState({registerError: null});

        let self = this;

        axios.post(Endpoints.auth_register, {
            email: this.state.emailValue,
            password: this.state.passwordValue,
            name: this.state.name
        }, {
            responseType: 'json'
        }).then(response => {
            let data = response.data;

            let status = data.status;

            if (status === "success") {
                let token = data.token;
                Alert.alert("Registration Success", "Press 'OK'");
                self.props.navigation.navigate("Login");
            } else if (status === "error") {
            }
        }).catch(error => {
            self.setState({registerError: error.response.data.status})
        })
    }

    render() {

        let registerErrorRow = null;

        if (this.state.registerError !== null) {
            registerErrorRow = (<Row style={{marginLeft: "15%"}}>
                <Text style={{color: "#ff402f"}}>{this.state.registerError}</Text>
            </Row>)
        }

        return (
            <View style={{flex: 1}}>
                    <Grid>
                        {({state, setState}) => (
                            <View style={{marginLeft: "15%", marginRight: "15%", marginTop: "10%"}}>
                                {registerErrorRow}

                                <Row>
                                    <TextInput mode={"outlined"}
                                               style={{width: 200, height: 50}}
                                               placeHolder={"you@email.com"}
                                               label={"Email"}
                                               value={this.state.emailValue}
                                               onChangeText={(text) => {this.setState({emailValue: text})}}
                                    />
                                </Row>

                                <Row>
                                    <TextInput mode={"outlined"} style={{width: 200, height: 50}} placeHolder={"Your Name"} label={"Name"}
                                               value={this.state.name} onChangeText={(text) => {
                                        this.setState({name: text})
                                    }}/>
                                </Row>

                                <Row>
                                    <TextInput style={{width: 200, height: 50}} mode={"outlined"}  value={this.state.passwordValue} label={"Password"}
                                               secureTextEntry onChangeText={(text) => {
                                        this.setState({passwordValue: text})
                                    }}/>
                                </Row>

                                <Row>
                                    <TextInput style={{width: 200, height: 50}} mode={"outlined"}  value={this.state.passwordConfirmValue} label={"Confirm Password"}
                                               secureTextEntry onChangeText={(text) => {
                                        this.setState({passwordConfirmValue: text})
                                    }}/>
                                </Row>

                                <Row style={{paddingTop: 10}}>
                                    <Col>
                                        <Button onPress={() => this.props.navigation.navigate("Login")}>Return</Button>
                                    </Col>
                                    <Col>
                                        <Button onPress={this._processRegistration}>Register</Button>
                                    </Col>
                                </Row>
                            </View>
                        )}
                    </Grid>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        searchSettings: state.searchSettings
    }
};
export default connect(mapStateToProps)(RegisterScreen);

const styles = StyleSheet.create({
    container: {
        paddingTop: 15,
        backgroundColor: '#fff',
    }
});
