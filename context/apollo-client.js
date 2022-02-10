import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: `${
    process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:1337/graphql'
  }`,
  cache: new InMemoryCache(),
});

export { client };
