import React from 'react';

import {View, StyleSheet, FlatList} from 'react-native';

import {List} from 'react-native-paper';
import {Endpoints} from "../../constants/RestApi";

import axios from 'axios';

import ApplicationBar from '../../components/ApplicationBar';

import {connect} from 'react-redux';

class JobListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            jobData: [],
        };

        this.getJobListingData.bind(this);
    }

    componentWillMount() {
        this.getJobListingData();
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        //
    }

    getJobListingData() {
        var self = this;
        axios({
            url: Endpoints.job_list,
            method: 'GET',
            headers: {'Authorization': `Bearer ${self.props.navigation.getParam('token')}`}
        }).then(response => {
            let jobs = response.data.jobs;

            self.setState({jobData: jobs})
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.jobData}
                    renderItem={({item, index}) => {
                        if (item === undefined) {
                            console.warn("Item with index " + index + " is undefined");
                            return null;
                        }
                        // Check if it's odd / even
                        if (index % 2 === 0) {
                            return <List.Item key={index} title={item.title} style={styles.listItemEven}/>
                        }
                        return <List.Item key={index} title={item.title} style={styles.listItemOdd}/>
                    }}
                    keyExtractor={({item, index}) => {
                        if (item === undefined) {
                            return null;
                        }

                        return index;
                    }}
                />

                <ApplicationBar
                    moveMapCallback={() => this.props.navigation.navigate("Home")}
                    searchCallback={() => {
                        if (this.props.user.loginStatus === false) {
                            this.props.navigation.navigate('Login', {next: 'Search'});
                        } else {
                            this.props.navigation.navigate('Search');
                        }
                    }}
                    postCallback={() => {
                        if (this.props.user.loginStatus === false) {
                            this.props.navigation.navigate('Login', {next: 'JobPost', last: 'JobList', longitude: this.props.navigation.getParam('longitude'),latitude: this.props.navigation.getParam('latitude')});
                        } else {
                            this.props.navigation.navigate('Search');
                        }
                    }}
                    jobListCallback={() => {
                        return;
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

export default connect(mapStateToProps)(JobListContainer);

const styles = StyleSheet.create({
   container: {
       flex: 1,
       backgroundColor: "#fff",
       marginTop: "5%"
   },
    listItemOdd: {
       backgroundColor: "#ebebeb"
    },
    listItemEven: {
      backgroundColor: "#fdfdfd"
    }
});