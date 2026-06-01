'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { LockKeyhole, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loginAdmin, type LoginState } from './actions';

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action] = useActionState(loginAdmin, initialState);

  return (
    <form action={action} className="relative overflow-hidden rounded-[2rem] border border-emerald-900/12 bg-white/88 p-6 shadow-2xl shadow-emerald-950/10 backdrop-blur md:p-8">
      <div className="absolute -right-14 -top-14 size-36 rounded-full bg-emerald-400/20 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-16 left-8 size-36 rounded-full bg-amber-300/20 blur-2xl" aria-hidden="true" />

      <div className="relative">
        <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-emerald-900 text-amber-100 shadow-lg shadow-emerald-950/20">
          <LockKeyhole className="size-5" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-emerald-950">今择易管理台</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          管理访问趋势、工具使用、内容选题和 AI 解读入口。
        </p>
      </div>

      <div className="relative mt-8 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-emerald-950">
          管理账号
          <input
            name="username"
            autoComplete="username"
            defaultValue="admin"
            className="h-11 rounded-xl border border-stone-200 bg-white px-3 text-base outline-none transition focus-visible:border-emerald-700 focus-visible:ring-4 focus-visible:ring-emerald-700/12"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-emerald-950">
          密码
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            className="h-11 rounded-xl border border-stone-200 bg-white px-3 text-base outline-none transition focus-visible:border-emerald-700 focus-visible:ring-4 focus-visible:ring-emerald-700/12"
          />
        </label>
      </div>

      {state.error ? (
        <p className="relative mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700" aria-live="polite">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="relative mt-6 w-full bg-emerald-900 text-amber-50 hover:bg-emerald-800" disabled={pending}>
      <LogIn data-icon="inline-start" />
      {pending ? '进入中' : '进入管理台'}
    </Button>
  );
}
