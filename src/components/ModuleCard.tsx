import React from 'react'
import { styled } from '@mui/system'

type Props = {
  title: string
  description: string
  disabled: boolean
  image?: string
  count?: number
}

const Container = styled('div')(() => ({
  transition: '0.3s ease all',
  '&:hover': {
    boxShadow: '0px 0px 25px rgba(0, 0, 0, 0.25)',

    '.module-card__img': {
      height: '110px',
    },
  },
}))

const ImageContainer = styled('div')(() => ({
  height: '240px',
  overflowY: 'hidden',

  '.module-card__inner-img': {
    position: 'relative',
  },

  '> .module-card__img': {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '240px',
    transition: '0.3s ease all',
  },

  '> .module-card__description': {
    transition: '0.3s ease all',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 5,
    WebkitBoxOrient: 'vertical',
    padding: '0 8px',
    fontWeight: 600,
  },

  '.module-card__indicator': {
    width: 26,
    height: 26,
    backgroundColor: '#f26464',
    borderRadius: '100%',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '5px',
    right: '5px',
  },
}))

const ModuleCard = ({ title, description, image, count }: Props) => {
  function CartText(str: string) {
    if (str.length > 40) return str.substring(0, 40) + '...'
    else return str
  }

  return (
    <Container className="tw-bg-white tw-rounded-lg tw-border tw-border-link-water tw-p-3 tw-flex tw-flex-col tw-gap-6">
      <ImageContainer className="tw-bg-mischka tw-rounded-lg">
        <div className="module-card__img">
          <div className="module-card__inner-img">
            <img src={image} />
          </div>
        </div>

        <div className="module-card__description">{description}</div>
      </ImageContainer>
      <div className="tw-px-3">
        <h3 className="tw-font-bold tw-mb-3">{title}</h3>
        <h4 className="tw-text-nobel tw-text-sm tw-font-bold">
          {description && CartText(description)}
        </h4>
      </div>
    </Container>
  )
}

export default ModuleCard
