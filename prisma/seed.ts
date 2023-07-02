import prisma from "./prisma-client.js";

const interests = {
  geeky: ['programming', 'videogames', 'anime'],
  normal: ['partying', 'travelling'],
}

async function main() {

  
  await prisma.interest.deleteMany()
  await prisma.categoryOfInterest.deleteMany()

  const payloadCategories = Object.keys(interests).map((category, id)=>({
    name: category,
    id
  }))

  const payloadInterests = Object.keys(interests)
    .map((interest, id)=>interests[interest as keyof typeof interests]
    .map((interestName)=>({name:interestName, categoryId: id}))).flat()

  await prisma.categoryOfInterest.createMany({
    data: payloadCategories
  })

  await prisma.interest.createMany({
    data: payloadInterests
  })
}

main()

