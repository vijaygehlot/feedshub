import React, { useEffect, useState } from 'react'
import { Button, Form, FormGroup, Label, Input, FormText, Spinner, CustomInput } from 'reactstrap';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import useForm from "./useForm";
import validate from "./validateForm";
import axios from 'axios'

const EditBlog = props => {
    const [inputValues, setInputValues] = useState({
        title: '',
        description: '',
        category: ''
    });
    const [file, setFile] = useState(null)
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState(null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const id = props.match.params.id
    let bodyText = ''

    useEffect(() => {
        axios.get(`blogs/${id}`)
            .then(res => {
                setInputValues({ title: res.data.title, description: res.data.description, category: res.data.category })
                setFile(res.data.bannerImage)
                setImage(res.data.bannerImage)
                const contentState = convertFromRaw(JSON.parse(res.data.body))
                const editorStateData = EditorState.createWithContent(contentState)
                setEditorState(editorStateData)
            })
            .catch(err => console.log(err))

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

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    }
    bodyText = convertToRaw(editorState.getCurrentContent()).blocks[0].text

    const noClientError = () => {
        let convertedData = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
        const { title, description, category } = inputValues
        let data = {title, description, category, convertedData}
        console.log('submit data - ', data)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('body', convertedData);
        formData.append('category', category)
        formData.append('bannerImage', file.name === undefined ? image : file);
        axios.post(`blogs/update/${id}`, formData)
            .then(res => {
                console.log(res.data)
                setError(res.data.message.msgError)
                setErrorMsg(res.data.message.msgBody)
                setIsLoading(false)
                window.location.push = '/profile'
            })
            .catch(err => {
                console.log(err.response)
                setError(err.response.data.message.msgError)
                setErrorMsg(err.response.data.message.msgBody)
                setIsLoading(false)
            })
        setIsLoading(true)
    }

    const { handleSubmit, inputErrors } = useForm(
        noClientError,
        validate,
        inputValues,
        bodyText,
        file
    )

    let imagePreview = '';
    if (imagePreviewUrl) {
        imagePreview = imagePreviewUrl
    }

    return (
        <div className="container">
            <Form onSubmit={handleSubmit} className="app-form">
                <h1 className="form-heading">Edit Blog</h1>
                <FormGroup>
                    <Label htmlFor="title">Blog Title</Label>
                    <Input type="text" name="title" placeholder="Enter Blog Title" onChange={handleInputChange} value={inputValues.title || ''} />
                    {inputErrors.title && <p className="input-error">{inputErrors.title}</p>}
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="description">Blog Description</Label>
                    <Input type="text" name="description" placeholder="Enter Blog Description" onChange={handleInputChange} value={inputValues.description || ''} />
                    {inputErrors.description && <p className="input-error">{inputErrors.description}</p>}
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="category">Category *</Label>
                    <Input type="select" name="category" onChange={handleInputChange} value={inputValues.category || ''}>
                        <option hidden >- Select a Category -</option>
                        <option>Organization</option>
                        <option>Business</option>
                        <option>Information Technology</option>
                        <option>Course</option>
                        <option>Real Estate</option>
                        <option>Politics</option>
                        <option>Media</option>
                        <option>Sports</option>
                        <option>Others</option>
                    </Input>
                    {inputErrors.category && <p className="input-error">{inputErrors.category}</p>}
                </FormGroup>
                <FormGroup className="mb-0">
                    <Label htmlFor="body">Blog Body</Label>
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
                    <CustomInput id="fileUpload" type="file" name="bannerImage" onChange={handleFileUpload} />
                    <FormText color="muted">
                        Please upload a banner image for the blog
                        </FormText>
                    {inputErrors.file && <p className="input-error">{inputErrors.file}</p>}
                </FormGroup>
                <img className="w-100 mb-4" src={imagePreviewUrl ? imagePreview : image} alt="" />
                <div className="d-felx align-items-center">
                    <Button>Submit</Button>
                    {isLoading && <Spinner className="ml-3" color="dark" />}
                </div>
                <p className="text-center mt-4" style={{ color: error ? 'red' : 'green' }}>{errorMsg}</p>
            </Form>
        </div>
    )
}

export default EditBlog