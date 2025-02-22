import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  //* sample users
  const users = await Promise.all([
    prisma.user.create({
      data: { name: "Enes Faruk Meniz" },
    }),
    prisma.user.create({
      data: { name: "Emre Yılmaz" },
    }),
    prisma.user.create({
      data: { name: "Cordi Athas" },
    }),
  ]);

  //* sample books
  const books = await Promise.all([
    prisma.book.create({
      data: {
        name: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
      },
    }),
    prisma.book.create({
      data: {
        name: "To Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
      },
    }),
    prisma.book.create({
      data: {
        name: "1984",
        author: "George Orwell",
        year: 1949,
      },
    }),
    prisma.book.create({
      data: {
        name: "Pride and Prejudice",
        author: "Jane Austen",
        year: 1813,
      },
    }),
    prisma.book.create({
      data: {
        name: "The Hobbit",
        author: "J.R.R. Tolkien",
        year: 1937,
      },
    }),
  ]);

  //* sample borrow history
  await prisma.borrowHistory.create({
    data: {
      userId: users[0].id,
      bookId: books[0].id,
      borrowedAt: new Date("2025-01-01"),
      returnedAt: new Date("2025-01-15"),
      score: 9,
    },
  });

  await prisma.borrowHistory.create({
    data: {
      userId: users[1].id,
      bookId: books[1].id,
      borrowedAt: new Date("2025-01-05"),
      returnedAt: new Date("2025-01-20"),
      score: 8,
    },
  });

  //* set currently borrowed books
  await prisma.book.update({
    where: { id: books[2].id },
    data: { currentOwnerId: users[2].id },
  });

  await prisma.borrowHistory.create({
    data: {
      userId: users[2].id,
      bookId: books[2].id,
      borrowedAt: new Date(),
    },
  });

  console.log("Database has been seeded with sample data! 🌱");
}

main()
  .catch((e) => {
    console.error(e);

    //? npm i --save-dev @types/node
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
