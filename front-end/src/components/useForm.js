import { useState, useEffect } from "react";

const useForm = (callback, validate, inputValues, bodyText, file) => {
    const [inputErrors, setInputErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = event => {
        event.preventDefault();
        setInputErrors(validate(inputValues, bodyText, file));
        setIsSubmitting(true);
    };

    useEffect(() => {
        if (Object.keys(inputErrors).length === 0 && isSubmitting) {
            callback();
        }
    }, [inputErrors]);

    return {
        handleSubmit,
        inputErrors
    };
};

export default useForm;