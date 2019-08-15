import React, {Component} from 'react';

import {StyleSheet, Dimensions, View, ScrollView, BackHandler} from 'react-native';

import {TouchableRipple, Text} from 'react-native-paper';

import Checkbox from 'react-native-modest-checkbox';

import {Grid, Column as Col, Row} from 'react-native-responsive-grid';

import {Endpoints} from '../../constants/RestApi';
import {setSearchRadius, addSearchCategory, removeSearchCategory, resetSearchSettings} from "../../store/actions/searchSettings";
import {connect} from "react-redux";
import ApplicationBar from "../../components/ApplicationBar";


const {height, width} = Dimensions.get('window');

const calcTileDimensions = (deviceWidth, tpr) => {
    // Credits to https://medium.com/@emilios1995/implementing-a-tile-view-in-react-native-a-la-ios-12f94c084f4b
    const margin = deviceWidth / (tpr * 10);
    const size = (deviceWidth - margin * (tpr * 2)) / tpr;
    return {size, margin};
};

var axios = require('axios');

class SearchContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tileSelected: null,
            categories: null,
        };

        this.selectTile = this.selectTile.bind(this);
        this.renderSecondarySearchScreen = this.renderSecondarySearchScreen.bind(this);
        this.selectSearchCategory = this.selectSearchCategory.bind(this);
        this._handleBackPress = this._handleBackPress.bind(this);
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
            this.props.navigation.navigate("Home");
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

    selectSearchCategory(checked, category_id) {
        if (!this.props.selectedCategories.includes(category_id)) {
            console.log("Add category " + category_id + " to state");
            this.props.addSearchCategory(category_id);
        } else {
            console.log("Remove category " + category_id + " from state");
            this.props.removeSearchCategory(category_id);
        }

        this.forceUpdate(); //Required as the checkboxes do not update when selected.
    }

    renderSecondarySearchScreen() {
        /**
         * Creates the secondary popover display screen.
         */
        if (this.state.tileSelected === null) {
            return null;
        }

        console.log("Render");

        let check_items = [];

        let activeTile = null;

        let job_types = [];

        for (let cat of this.state.categories) {
            if (cat.name === this.state.tileSelected) {
                activeTile = cat.id;

                for (jt of cat.job_types) {
                    job_types.push({id: jt.id, name: jt.name})
                }

                break;
            }
        }


        for (let job_type of job_types) {
            let checked = this.props.selectedCategories.includes(job_type.id);
            check_items.push(
                <Row key={job_type.id}>
                    <Col size={50}>
                        <Checkbox label={job_type.name} onChange={(checked) => {
                            this.selectSearchCategory(checked, job_type.id);
                        }} checked={checked}/>
                    </Col>
                </Row>
            )
        }

        return (
            <Row size={50} style={{backgroundColor: "#fff", borderTop: "#000", elevation: 2}}>
                <Grid>
                    {(state, setState) => (
                        <View>
                            {check_items}
                        </View>
                    )}
                </Grid>
            </Row>
        )
    }

    render() {

        //Determine the tile dimensions if we have 3 per row.
        const tileDimensions = calcTileDimensions(width, 3);

        let self=this;

        let item_tiles = [];

        if (this.state.categories !== null) {
            for (let category of this.state.categories) {

                let name = category.name;

                item_tiles.push(
                    <Col size={30} key={name}>
                        <SearchTileItem size={tileDimensions.size} margin={tileDimensions.margin} text={name} key={name}
                                        onSelect={this.selectTile} active={this.state.tileSelected === name}/>
                    </Col>)
            }
        }

        return (
            <Grid>
                {(state, setState) => (
                    <View>
                        <Row size={this.state.tileSelected !== null ? 50 : 100}>
                            <ScrollView contentContainerStyle={styles.container}>
                                {item_tiles}

                                <Col size={30}>
                                    <SearchTileItem size={tileDimensions.size} margin={tileDimensions.margin} text={"Reset Search Options"} onSelect={() => {this.props.resetSearchSettings()}} active={false}/>
                                </Col>
                            </ScrollView>
                        </Row>
                        {this.renderSecondarySearchScreen()}
                        <ApplicationBar
                            moveMapCallback={() => this.props.navigation.navigate("Home")}
                            searchCallback={() => {
                                return;
                            }}
                            postCallback={() => {
                                if (this.props.user.authToken === null) {
                                    this.props.navigation.navigate("Login", {next: "JobPost", last: "Search", longitude: this.props.user.geolocation.longitude, latitude: this.props.user.geolocation.latitude})
                                } else {
                                    this.props.navigation.navigate('JobPost');
                                }
                            }}
                            jobListCallback={() => {
                                if (this.props.user.authToken === null) {
                                    this.props.navigation.navigate('Login', {next: "JobList", last: "Search"});
                                } else {
                                    this.props.navigation.navigate('JobList');
                                }
                            }}
                        />
                    </View>
                )}
            </Grid>
        );
    }
}

class SearchTileItem extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
    }

    handleSelection() {
        this.props.onSelect(this.props.active === true ? null : this.props.text);
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

        return (
            <View style={[viewStyle, {width: size, height: size, marginHorizontal: margin}]}>
                <TouchableRipple borderless={true} style={{width: size, height: size, marginHorizontal: margin}}
                                 onPress={() => this.handleSelection()} rippleColor={"rgba(0,0,0,.33)"}>
                    <Text style={styles.itemText}>{text}</Text>
                </TouchableRipple>
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
        backgroundColor: "#d3d3d3",
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        elevation: 4
    },

    itemActive: {
        backgroundColor: "#fbed4c",
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
        selectedCategories: state.searchSettings.selectedCategories
    }
};

const mapDispatchToProps = {
    setSearchRadius,
    addSearchCategory,
    removeSearchCategory,
    resetSearchSettings
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchContainer)