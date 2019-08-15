import React, {Component} from 'react';

import {StyleSheet, Dimensions, View, ScrollView, BackHandler, Picker, TouchableOpacity} from 'react-native';

import {TouchableRipple, Text, Dialog, Portal, Chip, Title} from 'react-native-paper';
import {Grid, Column as Col, Row} from 'react-native-responsive-grid';

import {Endpoints} from '../../constants/RestApi';
import {connect} from "react-redux";
import ApplicationBar from "../../components/ApplicationBar";

import {getUserInfo} from "../../store/actions/user";

import watch from 'redux-watch';

import store from '../../store'

const {height, width} = Dimensions.get('window');

const calcTileDimensions = (deviceWidth, tpr) => {
    // Credits to https://medium.com/@emilios1995/implementing-a-tile-view-in-react-native-a-la-ios-12f94c084f4b
    const margin = deviceWidth / (tpr * 10);
    const size = (deviceWidth - margin * (tpr * 2)) / tpr;
    return {size, margin};
};

import axios from 'axios';
import {Ionicons} from "@expo/vector-icons";

//todo map users experience to job category

class JobExperienceContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tileSelected: null,
            categories: null,
        };

        this.selectTile = this.selectTile.bind(this);
        this._handleBackPress = this._handleBackPress.bind(this);
        this.processExperienceSelection = this.processExperienceSelection.bind(this);

        let userInfoWatch = watch(store.getState, "user.data");

        let self = this;
        store.subscribe(userInfoWatch((newVal,oldVal,objectPath) => {
          self.forceUpdate(() => {console.warn("Force update complete")});
        }));
    }

    componentWillMount() {
        this.props.getUserInfo(this.props.user.authToken);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);


        var self = this;
        axios({
            url: Endpoints.job_categories,
            method: 'GET',
            // headers: {'Authorization': `Bearer ${this.props.navigation.getParam('token')}`}
        }).then(response => {
            let categories = response.data.categories;

            self.setState({categories: categories});
        })
    }

    _handleBackPress() {
        if (this.state.tileSelected === null) {
            this.props.navigation.navigate("Settings");
            return;
        }

        if (this.state.tileSelected !== null) {
            this.setState({tileSelected: null});
        }

        return true;
    }

    selectTile(name) {
        this.setState({tileSelected: name});
    }

    processExperienceSelection(category, value) {
        let self = this;
        axios({
            url: Endpoints.user_job_experience_update,
            method: 'POST',
            responseType: 'json',
            data: {
                skills: [
                    {id: category, years_experience: value}
                ]
            },
            headers: {'Authorization': `Bearer ${this.props.user.authToken}`}
        }).then(response => {
            let status = response.data.status;

            if (status !== "success") {
                console.log("Error Updating User Experience");
            } else {
                console.log("EXPERIENCE UPDATED queing info update");
                this.props.getUserInfo(this.props.user.authToken);
            }
            console.log("Request complete")
        }).catch(error => {
        })
    }

    render() {

        //Determine the tile dimensions if we have 3 per row.
        const tileDimensions = calcTileDimensions(width, 3);

        let self=this;

        let item_tiles = [];

        let userJobExperience = this.props.user.data.experience;
        console.warn(JSON.stringify(userJobExperience));

        let extractedJobExperience = {};

        for (let experience of userJobExperience) {
            extractedJobExperience[experience.job_category_id] = experience.years_experience;
        }

        if (this.state.categories !== null) {
            for (let category of this.state.categories) {

                let name = category.name;

                let experience = category.id in extractedJobExperience ? extractedJobExperience[category.id] : 0;
                item_tiles.push(
                    <Col size={30} key={name}>
                        <JobCategoryTile size={tileDimensions.size} margin={tileDimensions.margin} text={name} key={name}
                                        onSelect={this.selectTile} category={category.id} experience={experience} callback={this.processExperienceSelection}/>
                    </Col>)
            }
        }

        return (
            <Grid>
                {(state, setState) => (
                    <View>
                        <View>
                            <Row style={{...styles.settingsObjectContainer}}>
                                <Col size={20}>
                                    <TouchableOpacity onPress={() => {this.props.navigation.navigate("Settings")}}>
                                        <Ionicons size={24} name={"ios-arrow-back"} solid/>
                                    </TouchableOpacity>
                                </Col>
                                <Col size={60}>
                                    <Title>Job Experience</Title>
                                </Col>
                            </Row>
                        </View>
                        <View>
                            <Row size={this.state.tileSelected !== null ? 50 : 100}>
                                <ScrollView contentContainerStyle={styles.container}>
                                    {item_tiles}
                                </ScrollView>
                            </Row>
                        </View>
                    </View>
                )}
            </Grid>
        );
    }
}

class JobCategoryTile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogVisible: false,
        };

        this.handleSelection = this.handleSelection.bind(this);
        this._hideDialog = this._hideDialog.bind(this);
    }

    componentWillUnmount() {

    }

    handleSelection() {
        this.setState({dialogVisible: true});
        //show dialog, then callback on the dialog is to set experience for users selection.
        // this.props.onSelect(this.props.active === true ? null : this.props.text);
    }

    _hideDialog() {
        this.setState({dialogVisible: false});
    }

    render() {

        let size = this.props.size;

        let margin = this.props.margin;

        let text = this.props.text;

        let viewStyle = null;
        if (this.props.active === true) {
            viewStyle = styles.itemActive;
        } else {
            viewStyle = styles.item;
        }

        let picker_items = [];

        for(let i = 1; i <= 10; i++) {
            picker_items.push(
                <Picker.Item label={`${i}`} value={`${i}`} key={i}/>
            )
        }

        return (
            <View style={[viewStyle, {width: size, height: size, marginHorizontal: margin}]}>
                <TouchableRipple borderless={true} style={{width: size, height: size, marginHorizontal: margin}}
                                 onPress={() => this.handleSelection()} rippleColor={"rgba(0,0,0,.33)"}>
                    <View>
                        <Text style={styles.itemText}>{text}</Text>
                        <Chip>{this.props.experience} yrs</Chip>
                    </View>
                </TouchableRipple>
                <Portal>
                    <Dialog visible={this.state.dialogVisible} onDismiss={this._hideDialog}>
                        <Dialog.Title>Yrs. Experience ({this.props.text})</Dialog.Title>
                        <Dialog.Content>
                            <Picker selectedValue={this.props.experience}
                            onValueChange={(value, index) => {this.props.callback(this.props.category, value)}}>
                            {picker_items}
                            </Picker>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 30
    },

    item: {
        backgroundColor: "#d3d292",
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        elevation: 4
    },

    itemActive: {
        backgroundColor: "#acfb77",
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        elevation: 4
    },
    itemText: {
        fontSize: 16,
        textAlign: 'center'
    }
});

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
};

const mapDispatchToProps = {
  getUserInfo
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(JobExperienceContainer)