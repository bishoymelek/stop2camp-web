import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import isEmpty from 'lodash/isEmpty';
import Sticky from 'react-stickynode';
import { Row, Col, Modal, Button } from 'antd';
import Container from 'components/UI/Container/Container';
import Loader from 'components/Loader/Loader';
import { getDeviceType } from 'library/helpers/get-device-type';
import { getAPIData, processAPIData } from 'library/helpers/get-api-data';
import Description from 'containers/SinglePage/Description/Description';
import Amenities from 'containers/SinglePage/Amenities/Amenities';
import Location from 'containers/SinglePage/Location/Location';
import Review from 'containers/SinglePage/Review/Review';
import Reservation from 'containers/SinglePage/Reservation/Reservation';
import BottomReservation from 'containers/SinglePage/Reservation/BottomReservation';
import TopBar from 'containers/SinglePage/TopBar/TopBar';
import SinglePageWrapper, {
  PostImage,
} from 'containers/SinglePage/SinglePageView.style';
import PostImageGallery from 'containers/SinglePage/ImageGallery/ImageGallery';
import { client } from 'context/apollo-client';
import { gql } from '@apollo/client';

export default function SinglePostPage({ deviceType, query, camp }) {
  const [href, setHref] = useState('');
  const [isModalShowing, setIsModalShowing] = useState(false);

  if (isEmpty(camp)) return <Loader />;

  const {
    name,
    about,
    reviews,
    rating,
    ratingCount,
    price,
    title,
    gallery,
    location,
    content,
    amenities,
    author,
    mapCoords,
  } = camp;

  const pageTitle =
    query.slug.split('-').join(' ').charAt(0).toUpperCase() +
    query.slug.split('-').join(' ').slice(1);

  useEffect(() => {
    const path = window.location.href;
    setHref(path);
  }, [setHref]);

  return (
    <>
      <Head>
        <title>{pageTitle} | TripFinder.</title>
      </Head>
      <SinglePageWrapper>
        <PostImage>
          <Image
            src={gallery[0].original}
            layout="fill"
            objectFit="cover"
            alt="Listing details banner"
          />
          <Button
            type="primary"
            onClick={() => setIsModalShowing(true)}
            className="image_gallery_button"
          >
            View Photos
          </Button>
        </PostImage>

        <TopBar title={name} shareURL={href} author={author} media={gallery} />

        <Container>
          <Row gutter={30} id="reviewSection" style={{ marginTop: 30 }}>
            <Col xl={16}>
              <Description
                content={about}
                title={title}
                location={location}
                rating={rating}
                ratingCount={ratingCount}
              />
              <Amenities list={amenities} />
              <Location location={location} />
            </Col>

            <Col xl={8}>
              {deviceType === 'desktop' ? (
                <Sticky
                  innerZ={999}
                  activeClass="isSticky"
                  top={202}
                  bottomBoundary="#reviewSection"
                >
                  <Reservation />
                </Sticky>
              ) : (
                <BottomReservation
                  title={title}
                  price={price}
                  rating={rating}
                  ratingCount={ratingCount}
                />
              )}
            </Col>
          </Row>
          {/*       <Row gutter={30}>
            <Col xl={16}>
              <Review
                reviews={reviews}
                ratingCount={ratingCount}
                rating={rating}
              />
            </Col>
            <Col xl={8} />
          </Row>*/}
        </Container>
      </SinglePageWrapper>

      <Modal
        visible={isModalShowing}
        onCancel={() => setIsModalShowing(false)}
        footer={null}
        width="100%"
        maskStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
        wrapClassName="image_gallery_modal"
        closable={false}
      >
        <>
          <PostImageGallery gallery={gallery} />
          <Button
            onClick={() => setIsModalShowing(false)}
            className="image_gallery_close"
          >
            <svg width="16.004" height="16" viewBox="0 0 16.004 16">
              <path
                id="_ionicons_svg_ios-close_2_"
                d="M170.4,168.55l5.716-5.716a1.339,1.339,0,1,0-1.894-1.894l-5.716,5.716-5.716-5.716a1.339,1.339,0,1,0-1.894,1.894l5.716,5.716-5.716,5.716a1.339,1.339,0,0,0,1.894,1.894l5.716-5.716,5.716,5.716a1.339,1.339,0,0,0,1.894-1.894Z"
                transform="translate(-160.5 -160.55)"
                fill="#909090"
              />
            </svg>
          </Button>
        </>
      </Modal>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, query } = context;

  const deviceType = getDeviceType(req);

  const { data } = await client.query({
    query: gql`
      query campDetails {
        camp(id: "1") {
          data {
            id
            attributes {
              slug
              name
              about
              contactPhone
              contactEmail
              gallery {
                data {
                  attributes {
                    url
                  }
                }
              }
              amenities {
                name
                icon {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
              location {
                address
                latitude
                longitude
                description
              }
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      query,
      deviceType,
      camp: {
        id: data.camp.data.id,
        ...data.camp.data.attributes,
        gallery: data.camp.data.attributes.gallery?.data?.map(
          ({ attributes: imgAttributes }) => ({
            ...imgAttributes,
            original: process.env.NEXT_PUBLIC_SERVER_API + imgAttributes.url,
            // TODO: make it thumbnail
            thumbnail: process.env.NEXT_PUBLIC_SERVER_API + imgAttributes.url,
          })
        ),
        amenities: data.camp.data.attributes.amenities?.map(
          ({
            name,
            icon: {
              data: {
                attributes: { url },
              },
            },
          }) => ({
            name,
            url: process.env.NEXT_PUBLIC_SERVER_API + url,
          })
        ),
      },
    },
  };
}
