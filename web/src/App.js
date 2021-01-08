import './App.css'
import React from 'react'
import { Route, Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from './page/home'
import Welcome from './page/welcome'
import Register from './page/register'

const ProtectedComponent = () => {
	window.location.href = 'https://netflix-movie-recommendation.auth.ap-northeast-1.amazoncognito.com/login?client_id=6qbg5tf3h4mjvu02l6cdqpnl5a&response_type=code&scope=netflix-movie-recommendation/user.read&redirect_uri=https://u1x8vr375i.execute-api.ap-northeast-1.amazonaws.com/dev'; 
	return null
}

function App() {

	const App = () => (
		<div>
	        <Switch>
		        <Route exact path='/' component={Welcome}/>
		        <Route path='/welcome' component={Welcome}/>
		        <Route path='/home' component={Home}/>
		        <Route path='/login' component={ProtectedComponent}/>
		        <Route path='/register' component={Register}/>
	        </Switch>
    	</div>
	)

	return (
		<BrowserRouter>
			<App />
		</BrowserRouter>
  )
}

export default App
