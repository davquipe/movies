import { Helmet } from 'react-helmet-async'
import HeroBanner from './HeroBanner/HeroBanner'
import './Home.scss'
import Trending from './trending/Trending'
import Popular from './popular/Populat'
import TopRated from './topRated/TopRated'

const Home = () => {
	return (
		<div className="homePage">
			<Helmet>
				<title>Home | React Movie App</title>
			</Helmet>
			<HeroBanner />
			<Popular />
			<Trending />
			<TopRated />
			<div style={{ height: 1000 }}></div>
		</div>
	)
}

export default Home
