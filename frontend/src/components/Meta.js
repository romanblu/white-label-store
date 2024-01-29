import React from 'react'
import { Helmet } from 'react-helmet-async'
const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
    title: "Welcome To Alternatif",
    description: "We sell the most scents for the price",
    keywords: "Perfume, fragrances, scents, aromas, cheap prices, alternative"
}

export default Meta