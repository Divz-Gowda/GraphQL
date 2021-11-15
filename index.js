const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
GraphQLSchema,
GraphQLObjectType,
GraphQLString,
GraphQLNonNull,
GraphQLInt,
GraphQLList,
} = require('graphql')
const app = express()

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const RootQuery = new GraphQLObjectType ({
    name : 'RootQuery',
    description: 'Query',
    fields: () => ({
        book: {
            type : BookType,
            args : {
                name : {type : GraphQLString }
            },
            resolve: (parents, args) => books.find(book => book.name === args.name)
            },
        books: {
        type : new GraphQLList (BookType),
        resolve: () => books
        },
        author: {
            type : new GraphQLList(author),
            resolve: () =>authors
        }
    })
})

const author = new GraphQLObjectType ({
    name : 'AuthorType',
    fields: () =>({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name : {type : GraphQLString},
        book :{
            type : new GraphQLList (BookType),
                resolve : (author) => {
                    return books.filter(book => book.authorId === author.id)
                }
            
        }
    })
})  

const BookType = new GraphQLObjectType ({
    name : 'Book',
    description: 'book details',
    fields: () => ({
        name: {type : new GraphQLNonNull(GraphQLString)},
        id: {type : new GraphQLNonNull(GraphQLInt)},
        authorId: {type : new GraphQLNonNull(GraphQLInt)},
        authorName : {type : author, resolve:(book) => {
            return authors.find (author => author.id === book.authorId)
        }
        }
        })
    })

 const RootMutation = new GraphQLObjectType ({
    name: 'RootMutation',
     fields :() => ({
      addBook : {
        type : BookType,
        args : {
            authorId : { type: new GraphQLNonNull(GraphQLInt) }, 
        name : { type: new GraphQLNonNull(GraphQLString) }
    },
        resolve: (parents, args) => {
            const book = {id: books.length+1, name :args.name, authorId :args.authorId}
            books.push(book)
            return book
        }}
     })
    


 })

    const schema = new GraphQLSchema ({
        query : RootQuery,
        mutation : RootMutation
    })
    

app.use('/graphql', expressGraphQL({
                       graphiql: true,
                       schema: schema
                   }))
app.listen(5000., () => console.log('running'))
