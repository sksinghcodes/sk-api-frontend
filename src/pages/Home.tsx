import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../context/ContextProvider";
import addDataSourceFormEmpty from '../assets/add-data-source-from-empty.png';
import addDataSourceFormFilled from '../assets/add-data-source-from-filled.png';

const Home = () => {
    const context = useContext(Context)

    return (
        <div className="py-4">
            <h1 className="h3">Hello {context?.user?.username || 'User'}</h1>
            <p>Welcome to SK API</p>

            <hr />

            <h2 className="h5">What is SK API?</h2>
            <p>This is an API service that I primary created for myself to deliver and manage data on my porfolio.</p>
            <p>However I am exposing one of its feature for public use. <strong>Form Submission API.</strong></p>

            <hr />

            <h2 className="h5">What is Form Submission API?</h2>
            <p>If you have a form on any of your websites but do not have the backend for handling all the form submission, you can use this api</p>
            <p>After a simple setup here. If someone submits the form on your api, two things will happen-</p>
            <ol>
                <li>You'll get an email notification with the data that was just submitted on your form.</li>
                <li>That data will be stored on this api to check later if you want.</li>
            </ol>

            <hr />

            <h2 className="h5">How do I use it?</h2>

            <ol>
                {!context.isSignedIn &&
                    <li>First you <Link to="/authentication/sign-in">sign in</Link></li>
                }
                <li>
                    <h3 className="h6">Create Data Source</h3>
                    <p>Creating a data-source requires two things</p>
                    <ul>
                        <li className="my-3"><img width={500} src={addDataSourceFormEmpty} alt="" /></li>
                        <li className="my-3">
                            <strong>source:</strong> This is the information about 'where will the data come from?'. if my form is hosted on <a target="_blank" href="https://myusername.github.io">https://myusername.github.io</a>, this is going to be my source.
                        </li>
                        <li className="my-3">
                            <strong>headings:</strong> This is the information about 'What will be its keys?'. if my form send 'first_name', 'last_name', 'email_address' and 'phone_number', these are going to be my headings.
                        </li>
                        <li className="my-3"><img width={500} src={addDataSourceFormFilled} alt="" /></li>
                        <li className="my-3">Now once you hit 'Add New' button, new data-source will be added</li>
                    </ul>
                </li>
                <li>
                    <h3 className="h6">Setup AJAX request on your form page</h3>
                    <p>Now you can send the data to '{import.meta.env.VITE_API_BASE_URL}add-data/' API Route by 'POST' method. The structure of the data will be following</p>
                    <pre className="bg-dark text-white"><code>
                        {`
    {
        key: '--the key generated for this datasource--',
        data: {
            first_name: '--first_name input value from form--',
            last_name: '--last_name input value from form--',
            email_address: '--email_address input value from form--',
            phone_number: '--phone_number input value from form--',
        }
    }
                        `}
                    </code></pre>
                </li>
            </ol>
        </div>
    );
}
 
export default Home;