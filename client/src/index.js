import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';


const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();

    return (
        promiseInProgress &&
        <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
    );
}
ReactDOM.render(<div>
     <LoadingIndicator/>
    <App />
   
</div>, document.getElementById('root'));