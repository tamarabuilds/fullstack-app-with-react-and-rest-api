import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { api } from "../utils/apiHelper";

import ErrorsDisplay from "./ErrorsDisplay";
import UserContext from "./context/UserContext";
import NotFound from "./NotFound";

const UpdateCourse = () => {
    const { authUser } = useContext(UserContext);
    const { id } = useParams();
    const [course, setCourse] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api(`/courses/${id}`, 'GET')
                const json = await response.json();
                console.log(json)
                if (response.status === 200) {
                    await setCourse(json);
                }
            } catch (error) {
                console.log(`Error fetching and parsing the data`, error);
            }
        }
        fetchData();
    }, [])

    // State
    const title = useRef(null)
    const description = useRef(null);
    const estimatedTime = useRef(null);
    const materialsNeeded = useRef(null);
    const [errors, setErrors] = useState([]);

    // Event handlers
    const handleSubmit = async (event) => {
        event.preventDefault();

        const course = {
            userId: authUser.id,
            title: title.current.value,
            description: description.current.value,
            estimatedTime: estimatedTime.current.value,
            materialsNeeded: materialsNeeded.current.value,
        };

        // catch errors in try/catch blocks when using async/await
        try {
            console.log('UpdateCourse try block')
            const response = await api(`/courses/${id}`, 'PUT', course, authUser);
            console.log(response)
            if (response.status === 204) {
                console.log(`204 status for UpdateCourse`)
                navigate(`/courses/${id}`);
            } else if (response.status === 403) {
                navigate(`/forbidden`);
            } else if (response.status === 500) {
                navigate(`/error`);
            } else {
                const data = await response.json();
                console.log(data);
                setErrors(data.errors)
            }
            
        } catch (error) {
            console.log(error);
            navigate('/error');
            
        }
    };

    const handleCancel = (event) => {
        event.preventDefault();
        navigate(`/courses/${id}`);
    }
    

    if (course) {
        return (
            <div className="wrap">
                <h2>Update Course</h2>
                <ErrorsDisplay errors={errors}/>
                <form onSubmit={handleSubmit}>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="courseTitle">Course Title</label>
                            <input id="courseTitle" name="courseTitle" type="text" ref={title} defaultValue={course.title} />
    
                            <p>By {course.User.firstName} {course.User.lastName}</p>
    
                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea id="courseDescription" name="courseDescription" ref={description} defaultValue={course.description} />
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input id="estimatedTime" name="estimatedTime" type="text" ref={estimatedTime} defaultValue={course.estimatedTime} />
    
                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea id="materialsNeeded" name="materialsNeeded" ref={materialsNeeded} defaultValue={course.materialsNeeded} />
                        </div>
                    </div>
                    <button className="button" type="submit">Update Course</button>
                    <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        );
    } else {
        // <h2>No course details</h2>
        return (
            <NotFound />
        );
    }

};

export default UpdateCourse;