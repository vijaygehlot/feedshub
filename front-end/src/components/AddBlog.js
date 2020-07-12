import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Spinner, CustomInput } from 'reactstrap';
import { useSelector } from "react-redux";
import useForm from "./useForm";
import validate from "./validateForm";
import axios from 'axios';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const AddBlog = () => {
    const [inputValues, setInputValues] = useState({
        title: '',
        description: '',
        category: ''
    });
    const [file, setFile] = useState(null)
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    let bodyText = ''

    const handleInputChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleFileUpload = event => {
        setFile(event.target.files[0])
        console.log('file upload - ',file)

        let reader = new FileReader();

        reader.onloadend = () => {
            setImagePreviewUrl(reader.result)
        }

        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0])
        }
    }

    const removeImage = () => {
        setImagePreviewUrl(null)
        setFile(null)
    }

    let imagePreview = (<div className="previewText image-container">Please upload an Banner Image for preview</div>);
    if (imagePreviewUrl) {
        imagePreview = (
            <div className="image-container">
                <img src={imagePreviewUrl} alt="banner" className="w-100 mb-4" />
                <p className="remove-profile-image" onClick={removeImage}><i className="fas fa-times"></i> Remove Image</p>
            </div>
        );
    } else {
        imagePreview = (<div className="previewText image-container">Please upload an Banner Image for preview</div>);
    }

    const userExist = useSelector(state => {
        if (state.userExist !== false) {
            return state.userExist
        }
    })

    const userId = useSelector(state => {
        if (state.userExist !== false) {
            return state.Name[0].message.userDetail._id
        }
    })

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    }
    bodyText = convertToRaw(editorState.getCurrentContent()).blocks[0].text

    const noClientError = () => {
        const convertedData = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
        const token = localStorage.getItem('Token')
        if (token == null) {
            return
        } else {
            const { title, description, category } = inputValues
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('body', convertedData);
            formData.append('bannerImage', file);
            formData.append('userId', userId);
            const config = {
                headers: {
                    'x-auth-header': token,
                }
            }
            axios.post('/blogs/add', formData, config)
                .then(res => {
                    setError(res.data.message.msgError)
                    setErrorMsg(res.data.message.msgBody)
                    setInputValues({ title: '', description: '', category: '' })
                    setFile(null)
                    setImagePreviewUrl(null)
                    setEditorState(EditorState.createEmpty())
                    setIsLoading(false)
                })
                .catch(err => {
                    console.log('error - ', err.response)
                    setError(err.response.data.message.msgError)
                    setErrorMsg(err.response.data.message.msgBody)
                    setIsLoading(false)
                })
            setIsLoading(true)
        }
    }

    const { handleSubmit, inputErrors } = useForm(
        noClientError,
        validate,
        inputValues,
        bodyText,
        file
    )

    const writeBlog = () => {
        return (
            <div>
                <Form onSubmit={handleSubmit} className="app-form">
                    <h1 className="form-heading">Write Blog</h1>
                    <FormGroup>
                        <Label htmlFor="title">Blog Title *</Label>
                        <span>
                            (This will be displayed on Blogs page as title)
                        </span>
                        <Input type="text" name="title" placeholder="Enter Blog Title" onChange={handleInputChange} value={inputValues.title || ''} />
                        {inputErrors.title && <p className="input-error">{inputErrors.title}</p>}
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="description">Short Description *</Label>
                        <span>
                            (This will be displayed on Blogs page as short description)
                        </span>
                        <Input type="text" name="description" placeholder="Enter Short Description" onChange={handleInputChange} value={inputValues.description || ''} />
                        {inputErrors.description && <p className="input-error">{inputErrors.description}</p>}
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="category">Category *</Label>
                        <span>
                            (Select a category for your blog, if not mentioned select others)
                        </span>
                        <Input type="select" name="category" onChange={handleInputChange} value={inputValues.category || ''}>
                            <option hidden >- Select a Category -</option>
                            <option>Organization</option>
                            <option>Business</option>
                            <option>Information Technology</option>
                            <option>Covid-19</option>
                            <option>India</option>
                            <option>Media</option>
                            <option>Sports</option>
                            <option>Others</option>
                        </Input>
                        {inputErrors.category && <p className="input-error">{inputErrors.category}</p>}
                    </FormGroup>
                    <FormGroup className="mb-0">
                        <Label htmlFor="body">Body *</Label>
                        <span>
                            (In detail content related to blog)
                        </span>
                    </FormGroup>
                    <Editor
                        editorState={editorState}
                        wrapperClassName="blog-editor-wrapper"
                        editorClassName="blog-body-editor"
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'remove', 'history'],
                        }}
                        onEditorStateChange={onEditorStateChange}
                    />
                    {inputErrors.body && <p className="input-error">{inputErrors.body}</p>}
                    <FormGroup>
                        <Label>Banner Image *</Label>
                        <span>
                            (This will be displayed on Blogs page as blog banner image)
                        </span>
                        <CustomInput type="file" id="fileUpload" name="bannerImage" onChange={handleFileUpload} />
                        <FormText color="muted">
                            Please upload a banner image for the blog
                        </FormText>
                        {inputErrors.file && <p className="input-error">{inputErrors.file}</p>}
                    </FormGroup>
                    {imagePreview}
                    <div className="d-felx align-items-center">
                        <Button className="btn-theme">Submit</Button>
                        {isLoading && <Spinner className="ml-3" color="dark" />}
                    </div>
                    <p className="text-center mt-4" style={{ color: error ? 'red' : 'green' }}>{errorMsg}</p>
                </Form>
            </div>
        )
    }

    const notAuthorized = () => {
        return (
            <div className="not-authorized-page theme-bottom-footer">
                You need to login in order to write a blog.
            </div>
        )
    }

    return (
        <div className="container">
            {userExist ? writeBlog() : notAuthorized()}
        </div>
    )
}

export default AddBlog