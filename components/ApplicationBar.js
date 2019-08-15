import React, {Component} from 'react';
import {StyleSheet} from 'react-native';

import {Appbar} from "react-native-paper";

export default class ApplicationBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Appbar style={styles.appbar}>
                <Appbar.Action icon={"gps-fixed"} onPress={() => {
                    this.props.moveMapCallback();
                }}/>
                <Appbar.Action icon={"search"} onPress={() => {
                    this.props.searchCallback();
                }}/>
                <Appbar.Action icon={"edit"} onPress={() => {
                    this.props.postCallback();
                }}/>
                <Appbar.Action icon={"list"} onPress={() => {
                    this.props.jobListCallback();
                }}/>
            </Appbar>
        )
    }

}

const styles = StyleSheet.create({
    appbar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0
    },
});