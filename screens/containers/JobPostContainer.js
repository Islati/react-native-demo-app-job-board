import React, {Component} from 'react';

import {postJob} from "../../store/actions/user";

import {View, Picker, StyleSheet, BackHandler} from 'react-native';
import {connect} from 'react-redux';

import {TextInput, Text, ProgressBar, Button} from 'react-native-paper';
import {Endpoints} from "../../constants/RestApi";

import {Grid, Column as Col, Row} from 'react-native-responsive-grid';
import axios from 'axios';

import watch from 'redux-watch';
import store from '../../store';

import ApplicationBar from '../../components/ApplicationBar';

let jobTypeRow = null;

class JobPostContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            description: "",
            categoriesLoaded: false,
            categoryData: [],
            selectedCategoryName: "Restaurant",
            selectedJobTypeName: "Barista",
            postMessage: null,
        };

        this._handleBackPress = this._handleBackPress.bind(this);
        this.handleJobPost = this.handleJobPost.bind(this);

        let _w = watch(store.getState, "user.jobPostMessage");
        let self = this;
        this.unsubscribe = store.subscribe(_w((oldValue, newValue, objectPath) => {
            self.setState({postMessage: newValue});
        }));
    }

    _handleBackPress() {
        this.props.navigation.navigate('Home');
        return true;
    }

    componentWillUnmount() {
        this.unsubscribe();
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);


        var self = this;
        axios({
            url: Endpoints.job_categories,
            method: 'GET',
            headers: {'Authorization': `Bearer ${this.props.user.authToken}`}
        }).then(response => {
            let categories = response.data.categories;
            self.setState({categoriesLoaded: true, categoryData: categories});
        })
    }

    handleJobPost() {
        // console.log(`Posting a job @ coordinates ${this.props.user.geolocation.longitude} / ${this.props.user.geolocation.latitude} [debug=(${this.props.navigation.getParam('longitude')}) x ${this.props.navigation.getParam('latitude')}`)
        this.props.postJob(
            this.state.title,
            this.state.description,
            this.props.navigation.getParam('longitude'),
            this.props.navigation.getParam('latitude'),
            this.state.selectedJobTypeName,
            this.state.selectedCategoryName,
            this.props.user.authToken
        );
    }

    render() {
        let categoryPicker = null;

        if (!this.state.categoriesLoaded) {
            categoryPicker = (<View><Text>Loading..</Text><ProgressBar progress={0.6}/></View>)
        } else {

            let categoryPickerItems = [];

            for (let category of this.state.categoryData) {
                categoryPickerItems.push(<Picker.Item label={category.name} value={category.name}
                                                      key={category.name}/>);
            }

            categoryPicker = (
                <Picker
                    selectedValue={this.state.selectedCategoryName}
                    style={{height: 100, width: 200}}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({selectedCategoryName: itemValue})
                    }}
                >
                    {categoryPickerItems}
                </Picker>
            )
        }

        //render category picker

        let jobTypePicker = null;

        if (this.state.selectedCategoryName !== null) {
            let jobPickerItems = [];

            let jobCatData = null;

            for (let category of this.state.categoryData) {
                if (category.name === this.state.selectedCategoryName) {
                    try {
                        let jobCatData = category.job_types;

                        for (let jobType of jobCatData) {
                            jobPickerItems.push(<Picker.Item label={jobType.name} value={jobType.name}
                                                             key={jobType.name}/>)
                        }
                    } catch (ex) {
                        console.error(ex);
                    }
                }
            }

            if (jobPickerItems.length === 0) {
                jobTypePicker = (<View><Text>Select a category first..</Text></View>)
            } else {
                jobTypePicker = (<Picker
                    selectedValue={this.state.selectedJobTypeName}
                    style={{height: 100, width: 200}}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({selectedJobTypeName: itemValue})
                    }}
                >
                    {jobPickerItems}
                </Picker>)
            }
        }

        //render job type picker based on category selection.

        let statusRow = null;

        if (this.state.postMessage !== null) {
            let textColor = "#eb3546";

            if (store.getState().user.jobPostFailure !== true) {
                textColor = "#54f81a";
                statusRow = (
                    <Row>
                        <Text style={{color: textColor, marginLeft: "5%"}}>{this.props.user.jobPostMessage}</Text>
                    </Row>
                )
            }
        }


        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Grid>
                    {({state, setState}) => (
                        <View style={{marginTop: "10%", marginLeft: "5%", marginRight: "5%"}}>
                            {statusRow}

                            <Row>
                                <Col fullWidtht offset={10}>
                                    <TextInput
                                        width={250}
                                        label={"Job Title"}
                                        value={this.state.title}
                                        onChangeText={(text) => this.setState({title: text})}
                                        mode={'outlined'}
                                        placeholder={"Help me with ..."}/>
                                </Col>
                            </Row>
                            <Row style={{marginTop: 20}}>
                                <Col fullWidtht offset={10}>

                                    <TextInput
                                        width={250}
                                        label={"Description"}
                                        value={this.state.description}
                                        onChangeText={(text) => this.setState({description: text})}
                                        mode={'outlined'}
                                        placeholder={"Describe the the job"}
                                        multiline
                                        numberOfLines={4}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col offset={15}>
                                    {categoryPicker}
                                </Col>
                            </Row>
                            <Row>
                                <Col offset={15}>
                                    {jobTypePicker}
                                </Col>
                            </Row>
                            <Row>
                                <Col offset={15}>
                                    <Button mode={"outlined"} onPress={() => {
                                        this.props.navigation.navigate('Home')
                                    }}>Back</Button>
                                </Col>
                                <Col offset={20}>
                                    <Button mode={"outlined"} onPress={() => {
                                        this.handleJobPost()
                                    }}>Post</Button>
                                </Col>
                            </Row>

                            <Row>
                                <ApplicationBar
                                    moveMapCallback={() => {
                                        this.props.navigation.navigate('Home');
                                    }}
                                    searchCallback={() => {
                                        this.props.navigation.navigate('Search');
                                    }}
                                    postCallback={() => {
                                        this.props.navigation.navigate('JobPost');
                                    }}
                                    jobListCallback={() => {
                                        this.props.navigation.navigate('JobList');
                                    }}
                                />
                            </Row>
                        </View>
                    )}
                </Grid>
            </View>)
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = {
    postJob
};

export default connect(mapStateToProps, mapDispatchToProps)(JobPostContainer);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});