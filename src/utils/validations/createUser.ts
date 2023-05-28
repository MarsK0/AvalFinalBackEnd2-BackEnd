import { z } from "zod"

const createUserSchema = z
.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(new RegExp("^[a-z]*$"),"Nome de usuário não deve conter espaços, números ou símbolos!")
    .min(4, "Nome de usuário deve conter ao menos 4 letras"),
  password: z
    .string()
    .refine((input) => {
      return input.indexOf(" ") === -1
    }, "A senha não deve conter espaços!")
    .refine((input) => {
      return input.length >= 8
    }, "A senha deve conter ao menos 8 caracteres"),
  repeatPassword: z
    .string()
})
.refine(
  schema => {
    return schema.password === schema.repeatPassword
  },
  {
    message: "As senhas não coincidem",
    path: ["repeatPassword"]
  }
)

export default createUserSchema