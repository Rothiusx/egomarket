'use client'

import { BattleNetIcon } from '@/components/icons/battlenet'
import { DiscordIcon } from '@/components/icons/discord'
import { GitHubIcon } from '@/components/icons/github'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { signIn } from 'next-auth/react'
import { SignInForm } from './sign-in-form'
import { SignUpForm } from './sign-up-form'

export function SignInOptions() {
  return (
    <div className="mt-16 flex flex-col items-center gap-8">
      <Tabs defaultValue="sign-in" className="w-[24rem]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Sign in to access your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <SignInForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sign-up">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create an account to access all features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <SignUpForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex w-full items-start justify-center gap-8">
        {[
          {
            id: 'discord',
            name: 'Discord',
            icon: <DiscordIcon className="size-8" />,
          },
          {
            id: 'github',
            name: 'GitHub',
            icon: <GitHubIcon className="size-8" />,
          },
          {
            id: 'battlenet',
            name: 'Battle.net',
            icon: <BattleNetIcon className="size-8" />,
          },
        ].map(({ id, name, icon }) => (
          <Button
            key={id}
            variant="icon"
            size="icon-lg"
            className="flex-grow rounded-lg bg-slate-400 transition hover:bg-slate-400/50 hover:shadow-md dark:bg-slate-800 dark:hover:bg-slate-800/50"
            onClick={() => signIn(id)}
          >
            {icon}
            <span className="sr-only">{name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
