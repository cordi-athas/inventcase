import express, { Request, Response } from "express";
import { prisma } from "../index";
import {
  ApiError,
  BookBasicInfo,
  BookDetailResponse,
  calculateAverageScore,
} from "../types";

const router = express.Router();

//* Get all books
const getAllBooks = async (
  _req: Request,
  res: Response<BookBasicInfo[] | ApiError>
) => {
  try {
    const books = await prisma.book.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return res.json(books);
  } catch {
    return res.status(500).json({ error: "Failed to fetch books" });
  }
};

//* Get book by ID
const getBookById = async (
  req: Request,
  res: Response<BookDetailResponse | ApiError>
) => {
  try {
    const bookId = parseInt(req.params.id);
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        borrowHistory: {
          where: { returnedAt: { not: null }, score: { not: null } },
          select: { score: true },
        },
        currentOwner: {
          select: { id: true, name: true },
        },
      },
    });

    if (!book) return res.status(404).json({ error: "Book not found" });

    const scores = book.borrowHistory.map((history) => history.score as number);
    const bookResponse: BookDetailResponse = {
      id: book.id,
      name: book.name,
      author: book.author,
      year: book.year,
      score: calculateAverageScore(scores),
      currentOwner: book.currentOwner || undefined,
    };

    return res.json(bookResponse);
  } catch {
    return res.status(500).json({ error: "Failed to fetch book" });
  }
};

router.get("/", getAllBooks);
router.get("/:id", getBookById);

export default router;
