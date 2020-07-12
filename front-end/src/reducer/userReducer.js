const userReducer = (state = {Name: '', userExist: false}, action) => {
switch (action.type) {
    case "USER_DETAIL":
        return {
            Name: [action.payload],
            userExist: true
        };
    default:
        return {
            userExist: false
        }
    }
}
 
export default userReducer;