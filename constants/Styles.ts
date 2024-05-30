import { StyleSheet } from "react-native";
import Colors from "./Colors";
import { useFonts } from "expo-font";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#000',
        color: '#fff'
    },
    title: {
        fontSize: 35,
        fontFamily: 'lex-light',
        color: Colors.primary,
        marginVertical: 10
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    input: {
        width: 270,
        height: 50,
        fontFamily: 'lex-light',
        fontSize: 17,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        borderColor: '#808080',
        color: '#fff'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 50,
        margin: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.dark,
        backgroundColor: Colors.primary
    },
    post: {
        padding: 10,
        marginVertical: 15,
        borderColor: '#fff',
        backgroundColor: '#8A8A8A',
        borderWidth: 1,
        borderRadius: 5,
        width: 350,
        height: 100
    },
    messageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 35,
        paddingTop: 10,
        paddingHorizontal: 25,
        borderColor: '#ccc',
        backgroundColor: '#1f1f1f'
    },
    messageInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#303030',
        fontFamily: 'lex-light',
        fontSize: 17,
        color: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        marginRight: 15,
    },
    sentMessage: {
        backgroundColor: Colors.primary,
        alignSelf: 'flex-end',
        marginHorizontal: 5,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        alignItems: 'flex-end'
    },
    receivedMessage: {
        backgroundColor: '#707070',
        alignSelf: 'flex-start',
        marginHorizontal: 5,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10
    },
    timestamp: {
        fontSize: 13,
        color: '#fff',
        marginTop: 5,
        fontFamily: 'lex-xlight'
    },
});