import {View, StyleSheet} from 'react-native';

export function moveToBottom(component) {
    /**
     * Generate a style wrapped component to move an element to the bottom of a flex.
     */
    return (<View style={styles.bottom}>
        {component}
    </View>)
}

export function toQueryString(params) {
    /**
     * Convert an object to a query string
     */
    return '?' + Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}

const styles = StyleSheet.create({
   bottom: {
       flex: 1,
       justifyContent: "flex-end",
       marginBottom: 20
   }
});