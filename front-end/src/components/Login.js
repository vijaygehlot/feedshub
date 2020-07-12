import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import useForm from "./useForm";
import validate from "./validateForm";
import axios from 'axios';
import qs from 'query-string';

const Login = () => {
    const [inputValues, setInputValues] = useState({
        email: '',
        password: ''
    })
    const [serverError, setServerError] = useState(false)
    const [serverErrorMsg, setServerErrorMsg] = useState('')

    const handleInputChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value })
    }

    const noClientError = () => {
        const { email, password } = inputValues
        const user = {
            email,
            password
        }
        axios.post('/blogs/users/login', qs.stringify(user))
            .then(res => {
                const token = res.data.message.refreshToken
                setServerError(res.data.message.msgError)
                setServerErrorMsg(res.data.message.msgBody)
                localStorage.setItem('Token', token)
                window.location.href = '/';
            })
            .catch(err => {
                console.log(err.response)
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
            <Form onSubmit={handleSubmit} noValidate className="app-form theme-bottom-footer">
                <h1 className="form-heading">Login</h1>
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
                <Button className="btn-theme">Submit</Button>
                <p className="text-center mt-4" style={{ color: serverError ? 'red' : 'green' }}>{serverErrorMsg}</p>
            </Form>
        </div>
    )
}

export default Login