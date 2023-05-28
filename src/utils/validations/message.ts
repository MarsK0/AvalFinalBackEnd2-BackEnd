import { z } from "zod"

const messageSchema = z
.object({
  date_message: z
    .string()
    .nonempty()
    .refine(val => {
      const date = Date.parse(val)
      return date >= 0
    }),
  title: z
    .string()
    .nonempty(),
  description: z
    .string()
    .nonempty()
})

export default messageSchema