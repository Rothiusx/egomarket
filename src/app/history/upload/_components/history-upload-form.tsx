'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { historySchema } from '@/schemas/history'
import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const historySchemaInput = z.object({
  history: z.string().min(1, {
    message: 'Session cannot be empty!',
  }),
  report: z.literal('').or(
    z
      .string()
      .url({
        message: 'Input must be a valid URL!',
      })
      .startsWith('https://classic.warcraftlogs.com/reports/', {
        message: 'Input must be a valid Warcraft Logs URL of a report!',
      })
  ),
})

export function HistoryUploadForm() {
  const createSession = api.history.create.useMutation({
    onSuccess: () => {
      toast.success(`History session imported!`)
    },
  })

  const form = useForm<z.infer<typeof historySchemaInput>>({
    resolver: zodResolver(historySchemaInput),
    defaultValues: {
      history: '',
      report: '',
    },
  })

  function onSubmit({ history, report }: z.infer<typeof historySchemaInput>) {
    try {
      createSession.mutate({
        history: historySchema.parse(JSON.parse(history)),
        report,
      })
    } catch (error) {
      console.error(error)
      form.setError('history', {
        message: 'Invalid GDKP history data',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="history"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GDKP Export</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[4 00px] h-[50vh] w-[50vw] min-w-[400px]"
                  placeholder="{ Auctions: { ... }, Pot: { ... }, ... }"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter Gargul GDKP session JSON export
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="report"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warcraft Logs Report</FormLabel>
              <FormControl>
                <Input
                  className="w-[50vw] min-w-[400px]"
                  placeholder="https://classic.warcraftlogs.com/reports/..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter Warcraft Logs URL of a report
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Import</Button>
      </form>
    </Form>
  )
}
