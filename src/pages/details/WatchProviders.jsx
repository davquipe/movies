/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { fetchDataApi } from '../../utils/api'
import './WatchProviders.scss'

const regions = [
	{ value: 'PE', label: 'Peru' }, { value: 'US', label: 'United States' },
	{ value: 'MX', label: 'Mexico' }, { value: 'AR', label: 'Argentina' },
	{ value: 'CL', label: 'Chile' }, { value: 'CO', label: 'Colombia' },
	{ value: 'ES', label: 'Spain' }, { value: 'BR', label: 'Brazil' },
]

const WatchProviders = ({ mediaType, id }) => {
	const [region, setRegion] = useState(() => localStorage.getItem('movies-region') || 'PE')
	const [providers, setProviders] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let active = true
		setLoading(true)
		fetchDataApi(`/${mediaType}/${id}/watch/providers`).then((response) => {
			if (active) {
				setProviders(response?.results?.[region] || null)
				setLoading(false)
			}
		})
		return () => { active = false }
	}, [mediaType, id, region])

	const changeRegion = (event) => {
		setRegion(event.target.value)
		localStorage.setItem('movies-region', event.target.value)
	}

	const options = [...new Map([
		...(providers?.flatrate || []), ...(providers?.free || []),
		...(providers?.ads || []), ...(providers?.rent || []), ...(providers?.buy || []),
	].map((provider) => [provider.provider_id, provider])).values()]

	return (
		<section className="watchProviders">
			<div className="watchProvidersHeader">
				<div><h2>Where to watch</h2><p>Streaming availability varies by region.</p></div>
				<label>Region<select value={region} onChange={changeRegion}>{regions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
			</div>
			{loading ? <p className="providerMessage">Loading availability…</p> : options.length ? (
				<div className="providerList">
					{options.map((provider) => <a className="providerItem" key={provider.provider_id} href={providers.link} target="_blank" rel="noreferrer" title={`Open ${provider.provider_name} availability`}><img src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} alt="" /><span>{provider.provider_name}</span></a>)}
				</div>
			) : <p className="providerMessage">No streaming availability found for this title in {regions.find((item) => item.value === region)?.label || region}.</p>}
			{providers?.link && <a className="providerSource" href={providers.link} target="_blank" rel="noreferrer">Availability data provided by JustWatch</a>}
		</section>
	)
}

export default WatchProviders
