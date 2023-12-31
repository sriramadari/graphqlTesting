const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList, GraphQLID } = require('graphql');
var cors = require('cors')
var app = express()

app.use(cors({
    origin:"*"
}))
const PORT = 4000;

const products = [
  { id: '1', name: 'Hoppscotch', price: 100 },
  { id: '2', name: 'Graphql', price: 149 },
  { id: '3', name: 'Sockets', price: 149 },
  { id: '4', name: 'APIs', price: 99 },
];

const users = [
  { id: '1', username: 'SriramAdari', email: 'user1@example.com', orders: ['1', '2'] },
  { id: '2', username: 'LeviAckerman', email: 'user2@example.com', orders: ['2'] },
];

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLFloat },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    orders: {
      type: new GraphQLList(ProductType),
      resolve: (parent) => {
            return parent.orders.map(orderId => products.find(product => product.id === orderId));
      },
    },
  }),
});


const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getProduct: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return products.find(product => product.id === args.id);
      },
    },
    getUser: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
           return users.find(user => user.id === args.id);
      },
    },
    getAllProducts: {
      type: new GraphQLList(ProductType),
      resolve: () => {       
         return products;
      },
    },
    getAllUsers: {
      type: new GraphQLList(UserType),
      resolve: () => {
        return users;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
