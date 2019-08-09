import React, {Fragment} from 'react'
import ToggleNap from './ToggleNap';
import AddNapEvent from './AddNapEvent';

const Register = () => {
    return (
        <Fragment>
            <h1>Registreer</h1>
            <ToggleNap />
            <AddNapEvent />
        </Fragment>
    )
    
}

export default Register