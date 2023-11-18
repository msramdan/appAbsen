export const Redirect = {
    toLoginScreen: (navigation) => {
        navigation.navigate('Login', {
            is_logout: true
        })
    }
}