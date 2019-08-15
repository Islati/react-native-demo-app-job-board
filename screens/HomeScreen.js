import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Dimensions,
    BackHandler,
    Alert,
    StatusBar
} from 'react-native';

import MapView, {Marker} from 'react-native-maps';

import {Grid, Column as Col, Row} from 'react-native-responsive-grid';

import Modal from 'react-native-modal';

import {Text, Divider, Button} from 'react-native-paper';


import axios from "axios";

import {Endpoints} from "../constants/RestApi";

import SettingsButton from "../components/SettingsButton"

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;

const LATITUDE_DELTA = 0.0922;

const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let faker = require('faker');

import {getUserInfo, updateGeolocation} from "../store/actions/user";
import {connect} from 'react-redux';

import ApplicationBar from '../components/ApplicationBar';


class HomeScreen extends React.Component {

    constructor(props) {
        super(props);

        StatusBar.setHidden(true,false);

        this.state = {
            loading: true,
            jobData: [], //todo add filter to jobs to allow users to see jobs they posted.
            activeJob: -1,
            jobModalVisible: false,
            initialUserLocation: {
                longitude: 0,
                latitude: 0
            },
            mapViewRegion: {
                latitude: 0,
                longitude: 0,

                latitudeDelta: 0,
                longitudeDelta: 0
            },
            userLocationMarker: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            searchModalVisible: false,
            searchLatitude: "46.393254",
            searchLongitude: "-63.790553",
            jobPostModalVisible: false,
            jobPostJobTitle: faker.name.jobTitle(),
            jobPostDescription: `Describe the work.`,
        };

        this._handleBackPress = this._handleBackPress.bind(this);
        this._hideJobModal = this._hideJobModal.bind(this);
        this._showJobModal = this._showJobModal.bind(this);
        this._renderMapMarkers = this._renderMapMarkers.bind(this);
        this._renderJobModal = this._renderJobModal.bind(this);
        this.getUserGeoLocation = this.getUserGeoLocation.bind(this);
        this.generateUserLocationMarker = this.generateUserLocationMarker.bind(this);
        this._moveMapToUserLocation = this._moveMapToUserLocation.bind(this);
        this._renderMapElement = this._renderMapElement.bind(this);
        this.onRegionChange = this.onRegionChange.bind(this);
        this._finishMarkerDrag = this._finishMarkerDrag.bind(this);
        this.getJobListingData = this.getJobListingData.bind(this);
    }

    componentWillMount() {
        /* Logic to handle when the component will mount */
        this.getJobListingData();
        this.retrieve_jobs_interval = setInterval(this.getJobListingData, 15000);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
        clearInterval(this.retrieve_jobs_interval);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
        this.getUserGeoLocation();
        // this.retrieve_jobs_interval = setInterval(this.getJobListingData, 2500);

        if (this.props.user.authToken !== null) {
            console.log("Getting user information");
            this.props.getUserInfo(this.props.user.authToken);
            console.log("Getting user information");
        }
    }

    getJobListingData() {
        var self = this;

        axios({
            url: Endpoints.job_list,
            method: 'GET',
            responseType: 'json',
        }).then(response => {
            let jobs = response.data.jobs;

            self.setState({jobData: jobs})
        }).catch(error => {
            // console.log(error.message);
            console.warn("Error when retrieving job data");
            console.warn(error.message)
        })
    }

    getUserGeoLocation() {
        /*
        After the user location is loaded store the coordinates in state,
        and say we're done loading everything
         */
        navigator.geolocation.getCurrentPosition(
            position => {
                //Call the dispatch to update our usrs geoLocation state var.
                this.props.updateGeolocation(position.coords.longitude, position.coords.latitude);

                //Now set local state.
                this.setState({
                    loading: false,
                    userLocationMarker: {
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude,
                        longitudeDelta: LONGITUDE_DELTA,
                        latitudeDelta: LATITUDE_DELTA
                    },
                    initialUserLocation: {
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude
                    }
                });
            },
            error = () => {
                console.error("Unable to get geo-locations");
                //todo prompt to enable location services.
            }, {
                enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
            }
        );
    }


    _handleBackPress() {
        //
        // if (this.state.jobModalVisible === false) {
        //     this.props.navigation.navigate("Login");
        // }
        return true;
    }

    _renderJobModal() {

        let jobTitle = "";
        if (this.state.activeJob === -1) {
            jobTitle = "Error Loading Job Title";
        } else {
            jobTitle = this.state.jobData[this.state.activeJob].jobTitle;
        }

        let renderedModal = (<Modal style={styles.modalContentContainer} visible={this.state.jobModalVisible}
                                    onBackdropPress={() => this._hideJobModal()}
                                    onBackButtonPress={() => this._hideJobModal()}>

            <Grid>
                {({state, setState}) => (
                    <View>
                        <Row style={{marginBottom: "3%", marginLeft: "15%", marginRight: "15%"}}>
                            <Col fullWidtht>
                                <Text style={{
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}>{`${jobTitle}`}</Text>
                            </Col>
                        </Row>

                        <Divider/>

                        <Row style={{marginTop: "3%", marginBottom: "3%"}}>
                            <Col fullWidtht>
                                <View style={{
                                    marginLeft: "10%",
                                    marginRight: "10%",
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <TouchableOpacity onPress={() => {
                                    }}>
                                        <Image style={styles.modalImage}
                                               source={require("../assets/images/play-video.png")}/>
                                    </TouchableOpacity>
                                </View>
                            </Col>
                        </Row>

                        <Row style={{marginTop: "2%", marginBottom: "1%"}}>
                            <Col>
                                <Text style={{fontSize: 16, fontWeight: "bold"}}>Job Description</Text>
                            </Col>
                        </Row>

                        <Row style={{marginTop: "1%", marginBottom: "1%"}}>
                            <View style={{marginLeft: "1%"}}>
                                <Text>Please watch the video above first.</Text>
                                <Text>Here would lay the job description for this listing. Such as how much it's paying,
                                    what's required, and follow up text for the video.</Text>
                            </View>
                        </Row>

                        <Row>
                            <Col offset={33}>
                                <Button onPress={() => {
                                    this._hideJobModal()
                                }} title={"Close"}
                                />
                            </Col>
                        </Row>
                    </View>
                )}
            </Grid>

        </Modal>);
        return renderedModal;
    }

    _showJobModal(jobKey) {
        this.setState(prevState => ({jobModalVisible: true, activeJob: jobKey}));
    }

    _hideJobModal() {
        this.setState(prevState => ({jobModalVisible: false, activeJob: -1}));
    }

    _finishMarkerDrag(event) {
        console.log(`marker drag coords`);
        let pos = event.nativeEvent.coordinate;
        console.log(pos);
        this.setState({
            userLocationMarker: {
                longitude: pos.longitude,
                latitude: pos.latitude,
                longitudeDelta: LONGITUDE_DELTA,
                latitudeDelta: LATITUDE_DELTA
            }
        });
        this.props.updateGeolocation(pos.longitude, pos.latitude);
    }

    generateUserLocationMarker() {
        return (
            <Marker coordinate={this.state.userLocationMarker} title={"Current Location"} description={"Drag to move"}
                    pinColor={"#00ff00"} draggable={true} onDragEnd={(e) => this._finishMarkerDrag(e)}/>);
    }

    _renderMapMarkers() {
        let markers = [];

        /*
        Create markers for each of the saved bits of job data
         */

        if (this.state.jobData.length === 0) {
            return markers;
        }

        let selectedSearchCategories = this.props.searchSettings.selectedCategories;

        for (let i = 0; i < this.state.jobData.length; i++) {
            let job = this.state.jobData[i];

            //Implement filter on job types.
            if (selectedSearchCategories.length > 0 && !selectedSearchCategories.includes(job.job_type_id)) {
                continue;
            }

            //check job category / job-type to props.searchSettings

            markers.push(<Marker coordinate={{
                latitude: parseFloat(job.latitude),
                longitude: parseFloat(job.longitude),
                longitudeDelta: LONGITUDE_DELTA,
                latitudeDelta: LATITUDE_DELTA
            }} title={job.title} description={job.description} key={i} onCalloutPress={e => {
                this._showJobModal(i)
            }}/>);
        }

        return markers;
    }

    onRegionChange(region) {
        this.setState({mapViewRegion: region});
    }

    _moveMapToUserLocation() {
        this.setState({
            mapViewRegion: {
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
                longitude: this.state.initialUserLocation.longitude,
                latitude: this.state.initialUserLocation.latitude
            },
            userLocationMarker: {
                longitude: this.state.initialUserLocation.longitude,
                latitude: this.state.initialUserLocation.latitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
        });
    }

    _renderMapElement() {

        if (this.state.mapViewRegion.latitude === 0 && this.state.mapViewRegion.longitude === 0) {
            return (
                <MapView style={styles.mapView}
                         initialRegion={{
                             latitudeDelta: LATITUDE_DELTA,
                             longitudeDelta: LONGITUDE_DELTA,
                             longitude: this.state.initialUserLocation.longitude,
                             latitude: this.state.initialUserLocation.latitude
                         }}
                >
                    {this._renderMapMarkers()}

                    {this.generateUserLocationMarker()}
                </MapView>
            );
        }

        return (
            <MapView style={styles.mapView}
                     region={{
                         latitudeDelta: this.state.mapViewRegion.latitudeDelta,
                         longitudeDelta: this.state.mapViewRegion.longitudeDelta,
                         longitude: this.state.mapViewRegion.longitude,
                         latitude: this.state.mapViewRegion.latitude
                     }}
                     onRegionChangeComplete={region => this.onRegionChange(region)}
            >
                {/*Apply Search Settings*/}
                {this._renderMapMarkers()}

                {this.generateUserLocationMarker()}
            </MapView>
        );
    }

    render() {
        if (this.state.loading === true) {
            return (<View styles={styles.container}>
                <Text>Loading..</Text>
            </View>)
        }

        return (
            <View style={styles.container}>

                <ScrollView style={styles.container}>

                    <View style={styles.mapContainer}>
                        {this._renderMapElement()}
                    </View>

                </ScrollView>

                {this._renderJobModal()}


                <SettingsButton callback={() => {
                    if (this.props.user.authToken === null) {
                        this.props.navigation.navigate("Login",{next: 'Settings',
                            last: 'Home',
                            longitude: this.props.user.geolocation.longitude,
                            latitude: this.props.user.geolocation.latitude})
                    } else {
                        this.props.navigation.navigate("Settings");
                    }
                }}/>

                <ApplicationBar
                    moveMapCallback={this._moveMapToUserLocation}
                    searchCallback={() => {
                        this.props.navigation.navigate('Search');
                    }}
                    postCallback={() => {
                        if (this.props.user.authToken === null) {
                            this.props.navigation.navigate('Login', {
                                next: 'JobPost',
                                last: 'Home',
                                longitude: this.props.user.geolocation.longitude,
                                latitude: this.props.user.geolocation.latitude
                            });
                        } else {
                            this.props.navigation.navigate('JobPost', {
                                longitude: this.props.user.geolocation.longitude,
                                latitude: this.props.user.geolocation.latitude
                            });
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

const mapStateToProps = (state) => {
    return {
        user: state.user,
        searchSettings: state.searchSettings
    }
};

const mapDispatchToProps = {
    updateGeolocation,
    getUserInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
    textInputField: {
        marginLeft: 5,
        paddingRight: "20%",
        borderColor: "#c5c3cc",
        borderWidth: 0.5,
        borderRadius: 10,
        paddingLeft: 5
    },
    lineStyle: {
        borderWidth: 0.5,
        borderColor: '#4f4f4f',
        marginLeft: "5%",
        marginRight: "5%",
    },
    modalImage: {
        borderRadius: 5,
        alignSelf: 'stretch',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    jobModalTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#363636"
    },
    modalContentContainer: {
        flex: 1,
        backgroundColor: '#fdfdff',
        padding: 22,
        borderRadius: 20,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {height: -3},
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    // contentContainer: {
    //     paddingTop: 30,
    // },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    mapContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        flex: 1
    },
    mapView: {
        height: screen.height
    },
    mapElement: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {height: -3},
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },
    navigationFilename: {
        marginTop: 5,
    },
    helpContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});
