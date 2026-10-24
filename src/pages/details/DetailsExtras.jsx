/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'
import { BsX } from 'react-icons/bs'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import Carousel from '../../components/carousel/Carousel'
import useFetch from '../../hooks/useFetch'
import './DetailsExtras.scss'

const imageBase = 'https://image.tmdb.org/t/p/'

const CollectionCarousel = ({ collectionId }) => {
	const { data, loading } = useFetch(`/collection/${collectionId}`)
	if (!loading && !data?.parts?.length) return null
	return <Carousel title={data?.name || 'More from this collection'} data={data?.parts} loading={loading} endpoint="movie" />
}

const DetailsExtras = ({ data, mediaType }) => {
	const [gallery, setGallery] = useState('backdrops')
	const [selectedImage, setSelectedImage] = useState(null)
	const images = data?.images
	const keywords = mediaType === 'movie'
		? data?.keywords?.keywords || []
		: data?.keywords?.results || []
	const galleries = useMemo(() => [
		{ id: 'backdrops', label: 'Backdrops', items: images?.backdrops || [], size: 'w780' },
		{ id: 'posters', label: 'Posters', items: images?.posters || [], size: 'w342' },
		{ id: 'logos', label: 'Logos', items: images?.logos || [], size: 'w500' },
	].filter((item) => item.items.length), [images])
	const activeGallery = galleries.find((item) => item.id === gallery) || galleries[0]

	useEffect(() => {
		if (!selectedImage) return undefined
		const closeOnEscape = (event) => { if (event.key === 'Escape') setSelectedImage(null) }
		window.addEventListener('keydown', closeOnEscape)
		return () => window.removeEventListener('keydown', closeOnEscape)
	}, [selectedImage])

	if (!data) return null

	return (
		<>
			{galleries.length > 0 && <section className="detailsExtras">
				<ContentWrapper>
					<div className="detailsExtras__header"><div><p className="detailsExtras__eyebrow">Take a closer look</p><h2 className="detailsExtras__title">Images</h2></div><div className="detailsExtras__tabs" role="tablist" aria-label="Image types">
						{galleries.map((item) => <button key={item.id} type="button" role="tab" aria-selected={activeGallery?.id === item.id} className={`detailsExtras__tab ${activeGallery?.id === item.id ? 'detailsExtras__tab--active' : ''}`} onClick={() => setGallery(item.id)}>{item.label}<span>{item.items.length}</span></button>)}
					</div></div>
					<div className={`detailsExtras__gallery detailsExtras__gallery--${activeGallery?.id}`}>
						{activeGallery?.items.slice(0, 16).map((image) => <button key={image.file_path} className="detailsExtras__image" type="button" onClick={() => setSelectedImage({ ...image, size: activeGallery.size })} aria-label={`View ${activeGallery.label.toLowerCase()} image`}><img src={`${imageBase}${activeGallery.size}${image.file_path}`} alt="" loading="lazy" /></button>)}
					</div>
				</ContentWrapper>
			</section>}

			{keywords.length > 0 && <section className="detailsExtras detailsExtras--keywords">
				<ContentWrapper>
					<p className="detailsExtras__eyebrow">Explore the story</p><h2 className="detailsExtras__title">Themes &amp; keywords</h2>
					<div className="detailsExtras__keywords">{keywords.slice(0, 18).map((keyword) => <span className="detailsExtras__keyword" key={keyword.id}>{keyword.name}</span>)}</div>
				</ContentWrapper>
			</section>}

			{mediaType === 'movie' && data.belongs_to_collection?.id && <CollectionCarousel collectionId={data.belongs_to_collection.id} />}

			{selectedImage && <div className="detailsExtras__lightbox" role="dialog" aria-modal="true" aria-label="Image preview" onClick={(event) => { if (event.target === event.currentTarget) setSelectedImage(null) }}>
				<button className="detailsExtras__close" type="button" onClick={() => setSelectedImage(null)} aria-label="Close image preview"><BsX /></button>
				<img src={`${imageBase}original${selectedImage.file_path}`} alt="" />
			</div>}
		</>
	)
}

export default DetailsExtras
