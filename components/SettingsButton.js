import React, {Component} from 'react';

import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from "@expo/vector-icons";

export default class SettingsButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<View style={styles.settingsButton}>
            <TouchableOpacity onPress={() => this.props.callback()}>
                <Ionicons name={"md-settings"} size={26} solid/>
            </TouchableOpacity>
        </View>)
    }

}

const styles = StyleSheet.create({
    settingsButton: {
        top: 0,
        right: 0,
        marginTop: 20,
        marginRight: 10,
        position: 'absolute'
    },
});