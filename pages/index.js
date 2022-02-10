import Head from 'next/head';
import Link from 'next/link';
import Container from 'components/UI/Container/Container';
import Heading from 'components/UI/Heading/Heading';
import SectionTitle from 'components/SectionTitle/SectionTitle';
import SearchArea from 'containers/Home/Search/Search';
import LocationGrid from 'containers/Home/Location/Location';
import SectionGrid from 'components/SectionGrid/SectionGrid';
import { client } from 'context/apollo-client';
import { getAPIData } from 'library/helpers/get-api-data';
import { getDeviceType } from 'library/helpers/get-device-type';
import { LISTING_POSTS_PAGE, SINGLE_POST_PAGE } from 'settings/constant';
import {
  HOME_PAGE_SECTIONS_ITEM_LIMIT_FOR_MOBILE_DEVICE,
  HOME_PAGE_SECTIONS_ITEM_LIMIT_FOR_TABLET_DEVICE,
  HOME_PAGE_SECTIONS_ITEM_LIMIT_FOR_DESKTOP_DEVICE,
  HOME_PAGE_SECTIONS_COLUMNS_RESPONSIVE_WIDTH,
} from 'settings/config';
import { gql } from '@apollo/client';

export default function HomePage({
  deviceType,
  locationData,
  topHotelData,
  luxaryHotelData,
  camps,
  cities,
}) {
  console.log(cities, camps);
  let limit;

  if (deviceType === 'mobile') {
    limit = HOME_PAGE_SECTIONS_ITEM_LIMIT_FOR_MOBILE_DEVICE;
  }
  if (deviceType === 'tablet') {
    limit = HOME_PAGE_SECTIONS_ITEM_LIMIT_FOR_TABLET_DEVICE;
  }

  if (deviceType === 'desktop') {
    limit = HOME_PAGE_SECTIONS_ITEM_LIMIT_FOR_DESKTOP_DEVICE;
  }
  return (
    <>
      <Head>
        <title>TripFinder. | React Hotel Listing Template</title>
      </Head>
      <SearchArea />
      <LocationGrid data={cities} deviceType={deviceType} />
      <Container fluid={true}>
        {/* <SectionTitle
          title={<Heading content="Travelers’ Choice: Top hotels" />}
          link={
            <Link href={LISTING_POSTS_PAGE}>
              <a>Show all</a>
            </Link>
          }
        />
        <SectionGrid
          link={SINGLE_POST_PAGE}
          columnWidth={HOME_PAGE_SECTIONS_COLUMNS_RESPONSIVE_WIDTH}
          data={topHotelData.slice(0, limit)}
          limit={limit}
          deviceType={deviceType}
        /> */}
        <SectionTitle
          title={<Heading content="Camps World" />}
          link={
            <Link href={LISTING_POSTS_PAGE}>
              <a>Show all</a>
            </Link>
          }
        />
        <SectionGrid
          link={SINGLE_POST_PAGE}
          columnWidth={HOME_PAGE_SECTIONS_COLUMNS_RESPONSIVE_WIDTH}
          data={camps}
          limit={10}
          deviceType={deviceType}
        />
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const apiUrl = [
    {
      endpoint: 'hotel',
      name: 'luxaryHotelData',
    },
    {
      endpoint: 'top-hotel',
      name: 'topHotelData',
    },
  ];

  const deviceType = getDeviceType(req);
  const pageData = await getAPIData(apiUrl);
  let locationData = [],
    topHotelData = [],
    luxaryHotelData = [];

  if (pageData) {
    pageData.forEach((item, key) => {
      if (item.name === 'locationData') {
        locationData = item.data ? [...item.data] : [];
      } else if (item.name === 'topHotelData') {
        topHotelData = item.data ? [...item.data] : [];
      } else if (item.name === 'luxaryHotelData') {
        luxaryHotelData = item.data ? [...item.data] : [];
      }
    });
  }
  const { data } = await client.query({
    query: gql`
      query CampsAndCities {
        camps {
          data {
            id
            attributes {
              slug
              name
              contactPhone
              contactEmail
              address
              gallery {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
        cities {
          data {
            id
            attributes {
              name
              backgroundImage {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      deviceType,
      locationData,
      topHotelData,
      luxaryHotelData,
      camps: data.camps?.data?.map(
        ({
          id,
          attributes: {
            slug,
            name,
            address,
            contactEmail,
            contactPhone,
            gallery,
          },
        }) => ({
          id,
          slug,
          name,
          address,
          contactEmail,
          contactPhone,
          gallery: gallery?.data?.map(({ attributes: imgAttributes }) => ({
            ...imgAttributes,
            url: 'http://localhost:1337' + imgAttributes.url,
          })),
        })
      ),
      cities: data.cities?.data?.map(
        ({ id, attributes: { name, backgroundImage } }) => ({
          id,
          name,
          backgroundImage: {
            url: 'http://localhost:1337' + backgroundImage.data.attributes.url,
          },
        })
      ),
    },
  };
}
