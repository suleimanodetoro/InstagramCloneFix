import { CognitoUser } from "@aws-amplify/auth";
//import { CognitoUser } from "amazon-cognito-identity-js"
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Alert } from "react-native";
import { Hub } from "aws-amplify";


// Assuming the event payload has a property named 'payload'
type HubEventData = {
    payload: any; // Replace 'any' with the actual type of the payload if known
  };

type UserType = CognitoUser | undefined | null;
type AuthContextType = {
    user: UserType,
}


//Initially the create context should be poassed an object that contains the default value of our context. 
const AuthContext = createContext<AuthContextType>({ user: undefined, setUser: () => { } }); //Contains mainly two values: provider and consumer 
//Wrap the components that need the auth context with the provider





const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType>(undefined);
    const checkUser = async () => {
        //Check if user is authenticated 
        try {
            const authUser = await Auth.currentAuthenticatedUser({ bypassCache: true });
            setUser(authUser)

        } catch (error) {
            setUser(null);
        }
    }
    //when the application is opened, check the Auth library local storage for the last authenticated user.
    // If authenticated user exists, let the user log in
    useEffect(() => {
        
        checkUser();
    }, []);

    //UseEffect to sign out by listening to  hub events and then changing context value
    useEffect(() => {
        const listener = (data: HubEventData) => {
            const { event } = data.payload;
            if (event === 'signOut') {
                setUser(null);
            }
            if (event === 'signIn') {
                checkUser();
            }
        };
        //Hub will receive events fir almost everything you do with auth now
        const hubListener = Hub.listen('auth', listener)
        // Since the cleanup function must return a function, we can return an empty function here
        // It doesn't need to do anything, but it satisfies the return type requirement        
        return() => hubListener();

    }, [])


    console.log('usr', user);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;
//So we don't have to import useContext and AuthContext everytime we want to use that data, do the following =>
export const useAuthContext = () => useContext(AuthContext);