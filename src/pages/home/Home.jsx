import { Helmet } from 'react-helmet-async'
import HeroBanner from './HeroBanner/HeroBanner'
import './Home.scss'
import Trending from './trending/Trending'

const Home = () => {
	return (
		<div className="homePage">
			<Helmet>
				<title>Home | React Movie App</title>
			</Helmet>
			<HeroBanner />
			<Trending />
			<div style={{ height: 1000 }}></div>
		</div>
	)
}

export default Home
