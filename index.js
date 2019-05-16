const express = require('express')
//Include our server libraries
const { VoyagerServer, gql } = require('@aerogear/voyager-server')

// Stub that reflects data source mapping
const employees = [{employee_id: 1, employee_name: "joe", cateory_id: 1 }, {employee_id: 2, employee_name: "john", cateory_id: 2}];

const categories = [{category_id: 1, employee_type:"Manager", security_clearance: 1}, {category_id: 2, employee_type:"Associate", security_clearance: 2}];

//GraphQL schema for mapping to data source mapping
const typeDefs = gql`
  type Employee {
      employee_id: ID!,
      employee_name: String!
      category: Category
  }
  type Category {
      category_id: ID!,
      employee_type: String!,
      security_clearance: ID!
  }
  type Query {
    listEmployees: [Employee]
  }
`

//Create the resolvers for your schema
const resolvers = {
  Query: {
    listEmployees: (obj, args, context, info) => {
      return employees;
    }
  }
}

//Initialize the library with your GraphQL information
const server = VoyagerServer({
  typeDefs,
  resolvers
})

//Connect the server to express
const app = express()
server.applyMiddleware({ app })

app.listen(4000, () =>
  console.log(`🚀 Server ready at http://localhost:4000/graphql`)
)
