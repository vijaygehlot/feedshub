import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, CustomInput } from 'reactstrap';
import useForm from "./useForm";
import validate from "./validateForm";
import axios from 'axios';

const Signup = () => {
    const [inputValues, setInputValues] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        country: ''
    });
    const [serverError, setServerError] = useState(false)
    const [serverErrorMsg, setServerErrorMsg] = useState('')
    const [file, setFile] = useState(null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null)

    const handleInputChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleFileUpload = event => {
        setFile(event.target.files[0])
        
        let reader = new FileReader();
        
        reader.onloadend = () => {
            setImagePreviewUrl(reader.result)
        }
    
        if(event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0])
        }
    }
    
    const removeImage = () => {
        setImagePreviewUrl(null)
        setFile(null)
    }

    let imagePreview = (<div className="previewText image-container">Please upload an Profile Image for preview</div>);
    if (imagePreviewUrl) {
        imagePreview = (
        <div className="image-container">
            <img src={imagePreviewUrl} alt="icon" width="200" />
            <p className="remove-profile-image" onClick={removeImage}><i className="fas fa-times"></i> Remove Image</p>
        </div>
        );
    } else {
        imagePreview = (<div className="previewText image-container">Please upload an Profile Image for preview</div>);
    }

    const noClientError = () => {
        const { name, email, password, phoneNumber, country } = inputValues
        const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phoneNumber', phoneNumber);
            formData.append('country', country);
            formData.append('profileImage', file);

        axios.post('blogs/users/signup', formData)
            .then(res => {
                setServerError(res.data.message.msgError)
                setServerErrorMsg(res.data.message.msgBody)
            })
            .catch(err => {
                console.log(err.response.data.message.msgBody)
                setServerError(err.response.data.message.msgError)
                setServerErrorMsg(err.response.data.message.msgBody)
            })
    }

    const { handleSubmit, inputErrors } = useForm(
        noClientError,
        validate,
        inputValues
    )

    return (
        <div className="container">
            <Form onSubmit={handleSubmit} className="app-form">
                <h1 className="form-heading">Sign up</h1>
                <FormGroup>
                    <Label htmlFor="name">Name *</Label>
                    <Input type="text" name="name" placeholder="Enter Name" onChange={handleInputChange} value={inputValues.name} />
                    {inputErrors.name && <p className="input-error">{inputErrors.name}</p>}
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="email">Email *</Label>
                    <Input type="email" name="email" placeholder="Enter Email" onChange={handleInputChange} value={inputValues.email} />
                    {inputErrors.email && <p className="input-error">{inputErrors.email}</p>}
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="password">Password *</Label>
                    <Input type="password" name="password" placeholder="Enter Password" onChange={handleInputChange} value={inputValues.password} />
                    {inputErrors.password && <p className="input-error">{inputErrors.password}</p>}
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="phoneNumber">Phone number *</Label>
                    <Input type="number" name="phoneNumber" placeholder="Enter Phone number" onChange={handleInputChange} value={inputValues.phoneNumber} />
                    {inputErrors.phoneNumber && <p className="input-error">{inputErrors.phoneNumber}</p>}
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="country">Country *</Label>
                    <Input type="text" name="country" placeholder="Enter Country Name" onChange={handleInputChange} value={inputValues.country} />
                    {inputErrors.country && <p className="input-error">{inputErrors.country}</p>}
                </FormGroup>
                <FormGroup>
                    <Label>Profile Image</Label>
                    <CustomInput type="file" id="fileUpload" name="bannerImage" onChange={handleFileUpload} />
                    <FormText color="muted">
                        You can upload profile image later also
                        </FormText>
                </FormGroup>
                { imagePreview }
                <Button className="btn-theme">Submit</Button>
                <p className="text-center mt-4" style={{ color: serverError ? 'red' : 'green' }}>{serverErrorMsg}</p>
            </Form>
        </div>
    )
}

export default Signup