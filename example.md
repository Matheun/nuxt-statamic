const { entries } = await useStatamicCollection('blog')

const { entry } = await useStatamicEntry('blog', 'my-post')

const { query } = await useStatamicQuery(gql)
