import { Helmet } from 'react-helmet-async'
import HeroBanner from './HeroBanner/HeroBanner'
import './Home.scss'

const Home = () => {
	return (
		<div className="homePage">
			<Helmet>
				<title>Home | React Movie App</title>
			</Helmet>
			<HeroBanner />
		</div>
	)
}

export default Home
