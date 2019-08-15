import React from 'react';
import {ScrollView, StyleSheet, View, Alert, Platform, BackHandler} from 'react-native';

import {Grid, Row, Column as Col} from "react-native-responsive-grid";

import {getUserInfo, login} from '../../store/actions/user';
import store from '../../store';

import {connect} from 'react-redux';

import s from "underscore.string";

import watch from 'redux-watch';
import {Button, Text, TextInput} from "react-native-paper";
import ApplicationBar from "../../components/ApplicationBar";

class LoginContainer extends React.Component {
    static navigationOptions = {
        title: 'Login',
    };

    constructor(props) {
        super(props);

        this.state = {
            emailValue: __DEV__ ? "Test@test.com" : "You@email.com",
            passwordValue: __DEV__ ? "test" : "",
            emailError: false,
            passwordError: false,
            loginError: false,
        };

        this._processLogin = this._processLogin.bind(this);
        this._handleBackPress = this._handleBackPress.bind(this);

        let self = this;

        let authTokenWatch = watch(store.getState, 'user.authToken');

        let loginMessageWatch = watch(store.getState, 'user.loginMessage');

        store.subscribe(loginMessageWatch((newVal, oldVal, objectPath) => {
            if (store.getState().user.loginStatus === false) {
                self.setState({loginError: true});
                return;
            }

            if (self.state.loginError === false && (s.contains("Invalid") || s.contains("No data"))) {
                self.setState({loginError: true});
            }
        }));

        store.subscribe(authTokenWatch((newVal, oldVal, objectPath) => {
            console.log(`Auth token changed from ${oldVal} to ${newVal}. Retrieving user info and switching navigation`);
            self.props.getUserInfo(newVal);

            self.props.navigation.navigate(self.props.navigation.getParam("next"), {
                longitude: self.props.navigation.getParam('longitude'),
                latitude: self.props.navigation.getParam('latitude')
            });
        }));
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    _handleBackPress() {
        // this.refs.toast.show('Test Toast!');
        this.props.navigation.navigate(this.props.navigation.getParam('last'));
        return true;
    }

    _processLogin() {
        this.setState({loginError: false});

        if (s.isBlank(this.state.emailValue)) {
            this.setState({emailError: true});
        }

        if (s.isBlank(this.state.passwordValue)) {
            this.setState({passwordError: true});
            return;
        }

        this.props.login(this.state.emailValue, this.state.passwordValue);
    }

    render() {

        let loginErrorRow = null;

        if (this.state.loginError === true) {
            loginErrorRow = (<Row>
                <Text style={{color: "#ff7136"}}>{this.props.user.loginMessage}</Text>
            </Row>)
        }

        return (
            <View style={{flex: 1}}>
                <Grid>
                    {({state, setState}) => (
                        <View style={{marginLeft: "15%", marginRight: "15%", marginTop: "10%"}}>
                            {loginErrorRow}

                            <Row>
                                <TextInput mode={"outlined"} style={{width: 200}} label={"Email"}
                                           placeHolder={"you@email.com"} value={this.state.emailValue}
                                           onChangeText={(text) => {
                                               this.setState({emailValue: text})
                                           }} error={this.state.emailError}/>
                            </Row>
                            <Row>
                                <TextInput mode={"outlined"} style={{width: 200}} label={"Password"}
                                           value={this.state.passwordValue} secureTextEntry onChangeText={(text) => {
                                    this.setState({passwordValue: text})
                                }} error={this.state.passwordError}/>
                            </Row>
                            <Row style={{marginTop: 10}}>

                                <Col>
                                    <Button mode="contained" onPress={this._processLogin}>Login</Button>
                                </Col>

                                <Col offset={20}>
                                    <Button mode="contained" onPress={() => {
                                        this.props.navigation.navigate("Register");
                                    }}>Register</Button>
                                </Col>

                            </Row>
                        </View>
                    )}
                </Grid>
                <ApplicationBar
                    moveMapCallback={() => this.props.navigation.navigate("Home")}
                    searchCallback={() => {
                        if (this.props.user.loginStatus) {
                            this.props.navigation.navigate('Search');
                        }
                    }}
                    postCallback={() => {
                        if (this.props.user.loginStatus) {
                            this.props.navigation.navigate('JobPost');
                        }
                    }}
                    jobListCallback={() => {
                        this.props.navigation.navigate('JobList');
                    }}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = {
    login,
    getUserInfo
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginContainer)
