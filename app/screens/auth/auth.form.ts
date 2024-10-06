import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpSchema = z
  .object({
    email: z.string().email('Email không hợp lệ'),
    nickName: z.string().min(1, 'Chưa nhập nickname'),
    avatar: z.string(),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type LoginInfo = z.infer<typeof loginSchema>;
export type SignUpInfo = z.infer<typeof signUpSchema>;
