import React, { useState } from 'react';
function Login()
{
    const [message,setMessage] = useState('');
    const [loginName,setLoginName] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');
function doLogin(event:any) : void
{
event.preventDefault();
alert('doIt() ' + loginName + ' ' + loginPassword );
};
 function handleSetLoginName( e: any ) : void
 {
 setLoginName( e.target.value );
 }
 function handleSetPassword( e: any ) : void
 {
 setPassword( e.target.value );
 }
 return(
    <div id="loginDiv">
    <span id="inner-title">PLEASE LOG IN</span><br />
    Login: <input type="text" id="loginName" placeholder="Username"
    onChange={handleSetLoginName} /><br />
    Password: <input type="password" id="loginPassword" placeholder="Password"
    onChange={handleSetPassword} /><br />
    <input type="submit" id="loginButton" className="buttons" value = "Do It"
    onClick={doLogin} />
    <span id="loginResult">{message}</span>
    </div>
 );
};
export default Login;