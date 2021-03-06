import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Heading from 'components/UI/Heading/Heading';
import IconCard from 'components/IconCard/IconCard';
import AmenitiesWrapper, { AmenitiesArea } from './Amenities.style';
import { TextButton } from '../SinglePageView.style';
import { Element } from 'react-scroll';
import Image from 'next/image';

const Amenities = ({ titleStyle, linkStyle, list }) => {
  return (
    <Element name="amenities" className="Amenities">
      <AmenitiesWrapper>
        <Heading as="h2" content="Amenities" {...titleStyle} />
        <AmenitiesArea>
          {list?.map(({ name, url }) => {
            return (
              <IconCard
                icon={
                  <Image
                    layout="fixed"
                    width={35}
                    height={35}
                    // objectFit="cover"
                    src={url}
                  />
                }
                title={name}
              />
            );
          })}
          {/* <IconCard icon={<FaWifi />} title="Free wifi" />
          <IconCard icon={<FaCarAlt />} title="Free parking" />
          <IconCard icon={<FaSwimmer />} title="Free pool" />
          <IconCard icon={<FaAirFreshener />} title="Air Freshener" /> */}
        </AmenitiesArea>
        {/* <TextButton>
          <Link href="#1">
            <a style={{ ...linkStyle }}>Show all amenities</a>
          </Link>
        </TextButton> */}
      </AmenitiesWrapper>
    </Element>
  );
};

Amenities.propTypes = {
  titleStyle: PropTypes.object,
  linkStyle: PropTypes.object,
};

Amenities.defaultProps = {
  titleStyle: {
    color: '#2C2C2C',
    fontSize: ['17px', '20px', '25px'],
    lineHeight: ['1.15', '1.2', '1.36'],
    mb: ['14px', '20px', '30px'],
  },
  linkStyle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#008489',
  },
};

export default Amenities;
