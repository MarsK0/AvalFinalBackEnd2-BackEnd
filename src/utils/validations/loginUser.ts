import { z } from "zod"

const LoginUserSchema = z
.object({
  username: z
    .string(),
  password: z
    .string()
})

export default LoginUserSchema