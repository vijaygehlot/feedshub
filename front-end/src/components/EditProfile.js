import React, { useEffect, useState } from 'react'
import { Button, Form, FormGroup, Label, Input, FormText, Spinner, CustomInput } from 'reactstrap';
import axios from 'axios'

const EditProfile = props => {
    const [inputValues, setInputValues] = useState({
        name: '',
        email: '',
        phoneNumber: '', 
        country: ''
    });
    const [file, setFile] = useState(null)
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState(null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
    const id = props.match.params.id
    
    useEffect(() => {
        console.log(id)
        const token = localStorage.getItem('Token')
        const config = {
            headers: {
                'x-auth-header': token,
            }
        }
        axios.get(`/blogs/users/${id}`, config)
            .then(res => {
                console.log('edit user', res.data)
                setInputValues({
                    name: res.data.message.userDetail.name, 
                    email: res.data.message.userDetail.email,
                    phoneNumber: res.data.message.userDetail.phoneNumber,
                    country: res.data.message.userDetail.country
                })
                setFile(res.data.message.userDetail.profileImage)
                setImage(res.data.message.userDetail.profileImage)
            })
            .catch(err => console.log(err.response))

    }, [id])

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
    
        reader.readAsDataURL(event.target.files[0])
    }

    const handleSubmit = event => {
        event.preventDefault()
        const { name, email, phoneNumber, country } = inputValues
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phoneNumber', phoneNumber);
        formData.append('country', country);
        formData.append('profileImage', file.name === undefined ? image : file);
        axios.post(`blogs/users/updateUser/${id}`, formData)
            .then(res => {
                setError(res.data.message.msgError)
                setErrorMsg(res.data.message.msgBody)
                setIsLoading(false)
                window.location.push = '/profile'
            })
            .catch(err => {
                setError(err.response.data.message.msgError)
                setErrorMsg(err.response.data.message.msgBody)
                setIsLoading(false)
            })
        setIsLoading(true)
    }

    let imagePreview = '';
    if (imagePreviewUrl) {
      imagePreview = imagePreviewUrl
    }

    return (
        <div className="container">
                <Form onSubmit={handleSubmit} className="app-form">
                    <h1 className="form-heading">Edit Profile</h1>
                    <FormGroup>
                        <Label htmlFor="title">Name</Label>
                        <Input type="text" name="name" placeholder="Enter Name" onChange={handleInputChange} value={inputValues.name || ''} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" name="email" placeholder="Enter Email" onChange={handleInputChange} value={inputValues.email || ''} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input type="number" name="phoneNumber" placeholder="Enter Phone Number" onChange={handleInputChange} value={inputValues.phoneNumber || ''} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="country">Country</Label>
                        <Input type="text" name="country" placeholder="Enter Country" onChange={handleInputChange} value={inputValues.country || ''} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Profile Image</Label>
                        <CustomInput id="fileUpload" type="file" name="bannerImage" onChange={handleFileUpload} />
                        <FormText color="muted">
                            Change profile image
                        </FormText>
                    </FormGroup>
                    <img src={imagePreviewUrl ? imagePreview : image} alt="profile-pic" width="200" />
                    <div className="d-felx align-items-center mt-3">
                        <Button className="btn-theme">Submit</Button>
                        {isLoading && <Spinner className="ml-3" color="dark" />}
                    </div>
                    <p className="text-center mt-4" style={{ color: error ? 'red' : 'green' }}>{errorMsg}</p>
                </Form>
        </div>
    )
}

export default EditProfile