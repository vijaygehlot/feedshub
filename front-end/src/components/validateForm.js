export default function validateLogin(values, bodyText, file) {
    let inputErrors = {};

    // Email
    if (values.email !== undefined) {
        if (!values.email) inputErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(values.email)) inputErrors.email = "Email address is invalid"
    }

    // Password
    if (values.password !== undefined) {
        if (!values.password) inputErrors.password = "Password is required"
        else if (values.password.length < 2) inputErrors.password = "Password needs to be more than 2 characters"
    }

    // Name
    if (values.name !== undefined) {
        if (!values.name) inputErrors.name = "Name is required"
        else if (values.name.length < 2) inputErrors.name = "Name needs to be more than 2 characters"
    }

    // Phone Number 
    if (values.phoneNumber !== undefined) {
        if (!values.phoneNumber) inputErrors.phoneNumber = "Phone Number is required"
        else if (values.phoneNumber.length < 5) inputErrors.phoneNumber = "Phone Number needs to be more than 5 digits"
    }

    // Country 
    if (values.country !== undefined) {
        if (!values.country) inputErrors.country = "Country is required"
        else if (values.country.length < 2) inputErrors.country = "Country needs to be more than 2 characters"
    }

    // Blog Title 
    if (values.title !== undefined) {
        if (!values.title) inputErrors.title = "Blog Title is required"
        else if (values.title.length < 2) inputErrors.title = "Blog Title needs to be more than 2 characters"
    }

    // Blog Description 
    if (values.description !== undefined) {
        if (!values.description) inputErrors.description = "Blog Description is required"
        else if (values.description.length < 2) inputErrors.description = "Blog Description needs to be more than 2 characters"
    }

    // Blog Body 
    if (bodyText !== undefined) {
        if (!bodyText.length) inputErrors.body = "Blog Body is required"
        else if (bodyText.length < 2) inputErrors.body = "Blog Body needs to be more than 2 characters"
    }

    // Blog Category 
    if (values.category !== undefined) {
        if (!values.category) inputErrors.category = "Blog Category is required"
        else if (values.category.length < 2) inputErrors.category = "Blog Category needs to be more than 2 characters"
    }

    // Blog Profile Image 
    if (file !== undefined) {
        if (!file) inputErrors.file = "Blog Profile is required"
    }

    return inputErrors;
}