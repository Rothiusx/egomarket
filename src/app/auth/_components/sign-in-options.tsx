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
import { CredentialsForm } from './credentials-form'
import { SignUpForm } from './sign-up-form'

export function SignInOptions() {
  return (
    <div className="flex flex-col items-center gap-8 mt-16">
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
              <CredentialsForm />
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

      <div className="flex gap-8 items-start justify-center">
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
            className="rounded-lg bg-slate-400 hover:shadow-md transition hover:bg-slate-400/50 dark:hover:bg-slate-800/50 dark:bg-slate-800"
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
